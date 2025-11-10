import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import Navigation from "../components/navigation.jsx";
import Footer from "../components/footer.jsx";
import { authAPI } from "../services/api";
import { eventsService } from "../services/eventsService";
import EventCard from "../components/EventCard.jsx";
import "./manager-dashboard.css";

const PANEL = {
  OVERVIEW: "overview",
  PENDING: "pending",
  ENGAGEMENT: "engagement",
  HOT: "hot",
  ALERTS: "alerts",
};

const ManagerDashboard = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [myEvents, setMyEvents] = useState([]);
  const [allRegistrations, setAllRegistrations] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // which panel is selected
  const [selectedPanel, setSelectedPanel] = useState(PANEL.OVERVIEW);

  useEffect(() => {
    fetchData();
    const unsub = eventsService.subscribe(() => fetchData());
    return () => unsub && unsub();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const me = await authAPI.getMe();
      if (me.success) {
        setUser(me.data.user);

        // Check role
        if (
          me.data.user.role !== "event_manager" &&
          me.data.user.role !== "admin"
        ) {
          history.push("/");
          return;
        }
      }

      const createdEvents = await eventsService.getMyCreatedEvents();
      setMyEvents(createdEvents || []);

      // Fetch all registrations for created events
      const allRegs = [];
      for (const event of createdEvents || []) {
        try {
          const regsData = await eventsService.getEventRegistrations(event._id);
          if (regsData.success && regsData.data) {
            allRegs.push({
              eventId: event._id,
              eventTitle: event.title,
              eventDate: event.date,
              ...regsData,
            });
          }
        } catch (err) {
          console.error(
            `Error fetching registrations for event ${event._id}:`,
            err
          );
        }
      }
      setAllRegistrations(allRegs);
    } catch (err) {
      console.error("Error loading manager dashboard:", err);
      setError(err);
      if (err.response?.status === 401) {
        history.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Helpers
  const now = new Date();
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  // Overview stats
  const totalEvents = myEvents.length;
  const upcomingEvents = myEvents.filter((e) => e.status === "upcoming").length;
  const completedEvents = myEvents.filter(
    (e) => e.status === "completed"
  ).length;
  const totalParticipants = myEvents.reduce(
    (sum, e) => sum + (e.registered || 0),
    0
  );

  // Pending registrations across all events
  const allPendingRegs = allRegistrations.flatMap((reg) =>
    (reg.data?.pending || []).map((p) => ({
      ...p,
      eventTitle: reg.eventTitle,
      eventId: reg.eventId,
    }))
  );

  // Engagement metrics (events sorted by activity)
  const eventsWithEngagement = myEvents
    .map((e) => {
      const reg = allRegistrations.find((r) => r.eventId === e._id);
      const stats = reg?.statistics || {};
      const engagement =
        (stats.approved || 0) + (stats.checkedIn || 0) + (stats.completed || 0);
      return { ...e, engagement };
    })
    .sort((a, b) => b.engagement - a.engagement);

  // Hot events (most registrations)
  const hotEvents = [...myEvents]
    .sort((a, b) => (b.registered || 0) - (a.registered || 0))
    .slice(0, 5);

  // Alerts
  const upcomingSoonEvents = myEvents.filter((e) => {
    const eventDate = new Date(e.date);
    return (
      e.status === "upcoming" &&
      eventDate >= now &&
      eventDate <= threeDaysFromNow
    );
  });

  const eventsNeedApproval = allPendingRegs.length;

  const handleApprove = async (eventId, userId) => {
    try {
      await eventsService.approveRegistration(eventId, userId);
      alert("Đã phê duyệt đăng ký!");
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Không thể phê duyệt.");
    }
  };

  const handleReject = async (eventId, userId) => {
    try {
      await eventsService.rejectRegistration(eventId, userId);
      alert("Đã từ chối đăng ký!");
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Không thể từ chối.");
    }
  };

  if (loading) {
    return (
      <div className="manager-dashboard-root">
        <Navigation />
        <main className="dashboard-loading">
          <div className="spinner" />
          <p>Đang tải thông tin Dashboard...</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Render content for the selected panel
  const renderPanelContent = () => {
    switch (selectedPanel) {
      case PANEL.OVERVIEW:
        return (
          <div className="overview-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <div className="stat-value">{totalEvents}</div>
                  <div className="stat-label">Tổng sự kiện</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-info">
                  <div className="stat-value">{upcomingEvents}</div>
                  <div className="stat-label">Sắp diễn ra</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <div className="stat-value">{completedEvents}</div>
                  <div className="stat-label">Đã hoàn thành</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <div className="stat-value">{totalParticipants}</div>
                  <div className="stat-label">Tổng tham gia</div>
                </div>
              </div>
            </div>

            <div className="event-list-section">
              <h3>Danh sách sự kiện của bạn</h3>
              {myEvents.length === 0 ? (
                <div className="empty">Bạn chưa tạo sự kiện nào.</div>
              ) : (
                <div className="event-list">
                  {myEvents.slice(0, 6).map((e, i) => (
                    <div key={e._id || i} className="event-item">
                      <div className="event-item-header">
                        <h4>{e.title}</h4>
                        <span className={`status-badge status-${e.status}`}>
                          {e.status === "upcoming"
                            ? "Sắp diễn ra"
                            : e.status === "completed"
                            ? "Đã hoàn thành"
                            : e.status === "ongoing"
                            ? "Đang diễn ra"
                            : "Đã hủy"}
                        </span>
                      </div>
                      <div className="event-item-info">
                        <span>
                          📅 {new Date(e.date).toLocaleDateString("vi-VN")}
                        </span>
                        <span>
                          👥 {e.registered || 0}/{e.maxParticipants}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {myEvents.length > 6 && (
                <button
                  className="btn btn-outline"
                  onClick={() => history.push("/event-management")}
                >
                  Xem tất cả
                </button>
              )}
            </div>
          </div>
        );

      case PANEL.PENDING:
        return (
          <div className="pending-content">
            {allPendingRegs.length === 0 ? (
              <div className="empty">Không có đăng ký chờ phê duyệt.</div>
            ) : (
              <div className="registration-list">
                {allPendingRegs.map((reg, i) => (
                  <div key={i} className="registration-item">
                    <div className="reg-header">
                      <div className="reg-user">
                        <div className="user-avatar">
                          {reg.user?.username?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div className="user-info">
                          <div className="user-name">
                            {reg.user?.username || "N/A"}
                          </div>
                          <div className="user-email">
                            {reg.user?.email || ""}
                          </div>
                        </div>
                      </div>
                      <div className="reg-date">
                        {new Date(reg.registeredAt).toLocaleDateString("vi-VN")}
                      </div>
                    </div>
                    <div className="reg-event">
                      <strong>Sự kiện:</strong> {reg.eventTitle}
                    </div>
                    <div className="reg-actions">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleApprove(reg.eventId, reg.user._id)}
                      >
                        Phê duyệt
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleReject(reg.eventId, reg.user._id)}
                      >
                        Từ chối
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case PANEL.ENGAGEMENT:
        return (
          <div className="engagement-content">
            {eventsWithEngagement.length === 0 ? (
              <div className="empty">Chưa có dữ liệu engagement.</div>
            ) : (
              <div className="engagement-list">
                {eventsWithEngagement.map((e, i) => (
                  <div key={e._id || i} className="engagement-item">
                    <div className="engagement-rank">{i + 1}</div>
                    <div className="engagement-event">
                      <h4>{e.title}</h4>
                      <div className="engagement-stats">
                        <span>Đăng ký: {e.registered || 0}</span>
                        <span>Engagement: {e.engagement}</span>
                      </div>
                    </div>
                    <div className="engagement-score">{e.engagement} điểm</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case PANEL.HOT:
        return (
          <div className="hot-content">
            {hotEvents.length === 0 ? (
              <div className="empty">Không có sự kiện hot.</div>
            ) : (
              <div className="event-list">
                {hotEvents.map((e, i) => (
                  <EventCard
                    key={e._id || i}
                    event={e}
                    index={i}
                    onRSVP={() => {}}
                  />
                ))}
              </div>
            )}
          </div>
        );

      case PANEL.ALERTS:
        return (
          <div className="alerts-content">
            <div className="alert-section">
              <h3>⏰ Sự kiện sắp diễn ra (3 ngày tới)</h3>
              {upcomingSoonEvents.length === 0 ? (
                <div className="empty">Không có sự kiện nào sắp diễn ra.</div>
              ) : (
                <div className="alert-list">
                  {upcomingSoonEvents.map((e, i) => (
                    <div key={e._id || i} className="alert-item alert-warning">
                      <div className="alert-icon">⚠️</div>
                      <div className="alert-info">
                        <div className="alert-title">{e.title}</div>
                        <div className="alert-meta">
                          {new Date(e.date).toLocaleDateString("vi-VN")} -{" "}
                          {e.registered || 0}/{e.maxParticipants} người
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="alert-section">
              <h3>📋 Đăng ký cần phê duyệt</h3>
              {eventsNeedApproval === 0 ? (
                <div className="empty">Không có đăng ký nào cần phê duyệt.</div>
              ) : (
                <div className="alert-item alert-info">
                  <div className="alert-icon">📋</div>
                  <div className="alert-info">
                    <div className="alert-title">
                      {eventsNeedApproval} đăng ký đang chờ phê duyệt
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setSelectedPanel(PANEL.PENDING)}
                    >
                      Xem ngay
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="manager-dashboard-root">
      <Helmet>
        <title>Manager Dashboard - VolunteerHub</title>
      </Helmet>

      <Navigation />

      <main className="manager-dashboard-container with-sidebar">
        <header className="dashboard-hero">
          <div>
            <h1>Bảng điều khiển Quản lý sự kiện</h1>
            <p>
              Xin chào, {user?.fullName || user?.username || "Bạn"} — quản lý sự
              kiện của bạn.
            </p>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <div className="num">{totalEvents}</div>
              <div className="label">Sự kiện</div>
            </div>
            <div className="stat">
              <div className="num">{totalParticipants}</div>
              <div className="label">Tham gia</div>
            </div>
            <div className="stat">
              <div className="num">{eventsNeedApproval}</div>
              <div className="label">Chờ duyệt</div>
            </div>
          </div>
        </header>

        <section className="dashboard-grid-with-sidebar">
          <nav className="dashboard-sidebar" aria-label="Dashboard panels">
            <ul>
              <li>
                <button
                  className={selectedPanel === PANEL.OVERVIEW ? "active" : ""}
                  onClick={() => setSelectedPanel(PANEL.OVERVIEW)}
                >
                  Tổng quan sự kiện
                </button>
              </li>
              <li>
                <button
                  className={selectedPanel === PANEL.PENDING ? "active" : ""}
                  onClick={() => setSelectedPanel(PANEL.PENDING)}
                >
                  Đăng ký chờ duyệt
                  {eventsNeedApproval > 0 && (
                    <span className="badge">{eventsNeedApproval}</span>
                  )}
                </button>
              </li>
              <li>
                <button
                  className={selectedPanel === PANEL.ENGAGEMENT ? "active" : ""}
                  onClick={() => setSelectedPanel(PANEL.ENGAGEMENT)}
                >
                  Engagement metrics
                </button>
              </li>
              <li>
                <button
                  className={selectedPanel === PANEL.HOT ? "active" : ""}
                  onClick={() => setSelectedPanel(PANEL.HOT)}
                >
                  Sự kiện hot nhất
                </button>
              </li>
              <li>
                <button
                  className={selectedPanel === PANEL.ALERTS ? "active" : ""}
                  onClick={() => setSelectedPanel(PANEL.ALERTS)}
                >
                  Alerts & Nhắc nhở
                </button>
              </li>
            </ul>
          </nav>

          <section className="dashboard-main-panel panel">
            <h2>
              {selectedPanel === PANEL.OVERVIEW && "Tổng quan sự kiện quản lý"}
              {selectedPanel === PANEL.PENDING && "Đăng ký chờ phê duyệt"}
              {selectedPanel === PANEL.ENGAGEMENT && "Engagement Metrics"}
              {selectedPanel === PANEL.HOT && "Sự kiện hot nhất"}
              {selectedPanel === PANEL.ALERTS && "Alerts & Nhắc nhở"}
            </h2>

            {renderPanelContent()}
          </section>
        </section>

        {error && (
          <div className="dashboard-error">
            Có lỗi xảy ra: {error.message || String(error)}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ManagerDashboard;
