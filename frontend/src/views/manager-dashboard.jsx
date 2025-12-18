import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import { authAPI } from "../services/api";
import { eventsService } from "../services/eventsService";
import EventCard from "../components/EventCard.jsx";
import styles from "./manager-dashboard.module.css";

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

  // Time filter
  const [timeFilter, setTimeFilter] = useState("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

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

  // Filter events by time
  const filteredMyEvents = myEvents.filter((event) => {
    if (timeFilter === "all") return true;

    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (timeFilter) {
      case "today": {
        const todayEnd = new Date(today);
        todayEnd.setHours(23, 59, 59, 999);
        return eventDate >= today && eventDate <= todayEnd;
      }
      case "week": {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        return eventDate >= startOfWeek && eventDate <= endOfWeek;
      }
      case "month": {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0
        );
        endOfMonth.setHours(23, 59, 59, 999);
        return eventDate >= startOfMonth && eventDate <= endOfMonth;
      }
      case "upcoming": {
        return eventDate >= today;
      }
      case "past": {
        return eventDate < today;
      }
      case "custom": {
        if (!customStartDate && !customEndDate) return true;
        const start = customStartDate ? new Date(customStartDate) : new Date(0);
        const end = customEndDate
          ? new Date(customEndDate)
          : new Date("2100-01-01");
        end.setHours(23, 59, 59, 999);
        return eventDate >= start && eventDate <= end;
      }
      default:
        return true;
    }
  });

  // Overview stats
  const totalEvents = filteredMyEvents.length;
  const upcomingEvents = filteredMyEvents.filter(
    (e) => e.status === "upcoming"
  ).length;
  const completedEvents = filteredMyEvents.filter(
    (e) => e.status === "completed"
  ).length;
  const totalParticipants = filteredMyEvents.reduce(
    (sum, e) => sum + (e.registered || 0),
    0
  );

  // Pending registrations across all events
  const allPendingRegs = allRegistrations.flatMap((reg) =>
    (reg.data?.pending || [])
      .filter((p) => p.user) // Filter out registrations without user data
      .map((p) => ({
        ...p,
        eventTitle: reg.eventTitle,
        eventId: reg.eventId,
      }))
  );

  // Engagement metrics (events sorted by activity)
  const eventsWithEngagement = filteredMyEvents
    .map((e) => {
      const reg = allRegistrations.find((r) => r.eventId === e._id);
      const stats = reg?.statistics || {};
      const engagement =
        (stats.approved || 0) + (stats.checkedIn || 0) + (stats.completed || 0);
      return { ...e, engagement };
    })
    .sort((a, b) => b.engagement - a.engagement);

  // Hot events (most registrations)
  const hotEvents = [...filteredMyEvents]
    .sort((a, b) => (b.registered || 0) - (a.registered || 0))
    .slice(0, 5);

  // Alerts
  const upcomingSoonEvents = filteredMyEvents.filter((e) => {
    const eventDate = new Date(e.date);
    return (
      e.status === "upcoming" &&
      eventDate >= now &&
      eventDate <= threeDaysFromNow
    );
  });

  const eventsNeedApproval = allPendingRegs.length;

  const handleApprove = async (eventId, userId) => {
    if (!userId) {
      alert("Không tìm thấy thông tin người dùng!");
      return;
    }
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
    if (!userId) {
      alert("Không tìm thấy thông tin người dùng!");
      return;
    }
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
      <div className={styles.managerDashboardContainer}>
        <main className={styles.dashboardLoading}>
          <div className={styles.spinner} />
          <p>Đang tải thông tin Dashboard...</p>
        </main>
      </div>
    );
  }

  // Render content for the selected panel
  const renderPanelContent = () => {
    switch (selectedPanel) {
      case PANEL.OVERVIEW:
        return (
          <div className={styles.overviewContent}>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📊</div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>{totalEvents}</div>
                  <div className={styles.statLabel}>Tổng sự kiện</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📅</div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>{upcomingEvents}</div>
                  <div className={styles.statLabel}>Sắp diễn ra</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>✅</div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>{completedEvents}</div>
                  <div className={styles.statLabel}>Đã hoàn thành</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>👥</div>
                <div className={styles.statInfo}>
                  <div className={styles.statValue}>{totalParticipants}</div>
                  <div className={styles.statLabel}>Tổng tham gia</div>
                </div>
              </div>
            </div>

            <div className={styles.eventListSection}>
              <h3>Danh sách sự kiện của bạn</h3>
              {filteredMyEvents.length === 0 ? (
                <div className={styles.empty}>
                  Không có sự kiện phù hợp với bộ lọc.
                </div>
              ) : (
                <div className={styles.eventList}>
                  {filteredMyEvents.slice(0, 6).map((e, i) => (
                    <div key={e._id || i} className={styles.eventItem}>
                      <div className={styles.eventItemHeader}>
                        <h4>{e.title}</h4>
                        <span
                          className={`${styles.statusBadge} ${
                            styles[
                              "status" +
                                e.status.charAt(0).toUpperCase() +
                                e.status.slice(1)
                            ]
                          }`}
                        >
                          {e.status === "upcoming"
                            ? "Sắp diễn ra"
                            : e.status === "completed"
                            ? "Đã hoàn thành"
                            : e.status === "ongoing"
                            ? "Đang diễn ra"
                            : "Đã hủy"}
                        </span>
                      </div>
                      <div className={styles.eventItemInfo}>
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
                  className={`${styles.btn} ${styles.btnOutline}`}
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
          <div className={styles.pendingContent}>
            {allPendingRegs.length === 0 ? (
              <div className={styles.empty}>
                Không có đăng ký chờ phê duyệt.
              </div>
            ) : (
              <div className={styles.registrationList}>
                {allPendingRegs.map((reg, i) => (
                  <div key={i} className={styles.registrationItem}>
                    <div className={styles.regHeader}>
                      <div className={styles.regUser}>
                        <div className={styles.userAvatar}>
                          {reg.user?.username?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div className={styles.userInfo}>
                          <div className={styles.userName}>
                            {reg.user?.username || "N/A"}
                          </div>
                          <div className={styles.userEmail}>
                            {reg.user?.email || ""}
                          </div>
                        </div>
                      </div>
                      <div className={styles.regDate}>
                        {new Date(reg.registeredAt).toLocaleDateString("vi-VN")}
                      </div>
                    </div>
                    <div className={styles.regEvent}>
                      <strong>Sự kiện:</strong> {reg.eventTitle}
                    </div>
                    <div className={styles.regActions}>
                      <button
                        className={`${styles.btn} ${styles.btnSuccess} ${styles.btnSm}`}
                        onClick={() =>
                          handleApprove(reg.eventId, reg.user?._id)
                        }
                        disabled={!reg.user}
                      >
                        Phê duyệt
                      </button>
                      <button
                        className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                        onClick={() => handleReject(reg.eventId, reg.user?._id)}
                        disabled={!reg.user}
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
          <div className={styles.engagementContent}>
            {eventsWithEngagement.length === 0 ? (
              <div className={styles.empty}>Chưa có dữ liệu engagement.</div>
            ) : (
              <div className={styles.engagementList}>
                {eventsWithEngagement.map((e, i) => (
                  <div key={e._id || i} className={styles.engagementItem}>
                    <div className={styles.engagementRank}>{i + 1}</div>
                    <div className={styles.engagementEvent}>
                      <h4>{e.title}</h4>
                      <div className={styles.engagementStats}>
                        <span>Đăng ký: {e.registered || 0}</span>
                        <span>Engagement: {e.engagement}</span>
                      </div>
                    </div>
                    <div className={styles.engagementScore}>
                      {e.engagement} điểm
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case PANEL.HOT:
        return (
          <div className={styles.hotContent}>
            {hotEvents.length === 0 ? (
              <div className={styles.empty}>Không có sự kiện hot.</div>
            ) : (
              <div className={styles.eventList}>
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
          <div className={styles.alertsContent}>
            <div className={styles.alertSection}>
              <h3>⏰ Sự kiện sắp diễn ra (3 ngày tới)</h3>
              {upcomingSoonEvents.length === 0 ? (
                <div className={styles.empty}>
                  Không có sự kiện nào sắp diễn ra.
                </div>
              ) : (
                <div className={styles.alertList}>
                  {upcomingSoonEvents.map((e, i) => (
                    <div
                      key={e._id || i}
                      className={`${styles.alertItem} ${styles.alertWarning}`}
                    >
                      <div className={styles.alertIcon}>⚠️</div>
                      <div className={styles.alertInfo}>
                        <div className={styles.alertTitle}>{e.title}</div>
                        <div className={styles.alertMeta}>
                          {new Date(e.date).toLocaleDateString("vi-VN")} -{" "}
                          {e.registered || 0}/{e.maxParticipants} người
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.alertSection}>
              <h3>📋 Đăng ký cần phê duyệt</h3>
              {eventsNeedApproval === 0 ? (
                <div className={styles.empty}>
                  Không có đăng ký nào cần phê duyệt.
                </div>
              ) : (
                <div className={`${styles.alertItem} ${styles.alertInfo}`}>
                  <div className={styles.alertIcon}>📋</div>
                  <div className={styles.alertInfo}>
                    <div className={styles.alertTitle}>
                      {eventsNeedApproval} đăng ký đang chờ phê duyệt
                    </div>
                    <button
                      className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}
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
    <div className={styles.managerDashboardRoot}>
      <Helmet>
        <title>Manager Dashboard - VolunteerHub</title>
      </Helmet>

      <main
        className={`${styles.managerDashboardContainer} ${styles.withSidebar}`}
      >
        <header className={styles.dashboardHero}>
          <div>
            <h1>Bảng điều khiển Quản lý sự kiện</h1>
            <p>
              Xin chào, {user?.fullName || user?.username || "Bạn"} — quản lý sự
              kiện của bạn.
            </p>
          </div>

          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <div className={styles.num}>{totalEvents}</div>
              <div className={styles.label}>Sự kiện</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.num}>{totalParticipants}</div>
              <div className={styles.label}>Tham gia</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.num}>{eventsNeedApproval}</div>
              <div className={styles.label}>Chờ duyệt</div>
            </div>
          </div>
        </header>

        {/* Time Filter Section */}
        <div className={styles.timeFilterSection}>
          <label className={styles.filterLabel}>📅 Lọc theo thời gian:</label>
          <div className={styles.timeFilterButtons}>
            <button
              className={`${styles.filterBtnSm} ${
                timeFilter === "all" ? styles.active : ""
              }`}
              onClick={() => setTimeFilter("all")}
            >
              Tất cả
            </button>
            <button
              className={`${styles.filterBtnSm} ${
                timeFilter === "today" ? styles.active : ""
              }`}
              onClick={() => setTimeFilter("today")}
            >
              Hôm nay
            </button>
            <button
              className={`${styles.filterBtnSm} ${
                timeFilter === "week" ? styles.active : ""
              }`}
              onClick={() => setTimeFilter("week")}
            >
              Tuần này
            </button>
            <button
              className={`${styles.filterBtnSm} ${
                timeFilter === "month" ? styles.active : ""
              }`}
              onClick={() => setTimeFilter("month")}
            >
              Tháng này
            </button>
            <button
              className={`${styles.filterBtnSm} ${
                timeFilter === "upcoming" ? styles.active : ""
              }`}
              onClick={() => setTimeFilter("upcoming")}
            >
              Sắp diễn ra
            </button>
            <button
              className={`${styles.filterBtnSm} ${
                timeFilter === "past" ? styles.active : ""
              }`}
              onClick={() => setTimeFilter("past")}
            >
              Đã qua
            </button>
            <button
              className={`${styles.filterBtnSm} ${
                timeFilter === "custom" ? styles.active : ""
              }`}
              onClick={() => setTimeFilter("custom")}
            >
              Tùy chỉnh
            </button>
          </div>
          {timeFilter === "custom" && (
            <div className={styles.customDateRangeInline}>
              <div className={styles.dateInputGroupInline}>
                <label>Từ:</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                />
              </div>
              <div className={styles.dateInputGroupInline}>
                <label>Đến:</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <section className={styles.dashboardGridWithSidebar}>
          <nav
            className={styles.dashboardSidebar}
            aria-label="Dashboard panels"
          >
            <ul>
              <li>
                <button
                  className={
                    selectedPanel === PANEL.OVERVIEW ? styles.active : ""
                  }
                  onClick={() => setSelectedPanel(PANEL.OVERVIEW)}
                >
                  Tổng quan sự kiện
                </button>
              </li>
              <li>
                <button
                  className={
                    selectedPanel === PANEL.PENDING ? styles.active : ""
                  }
                  onClick={() => setSelectedPanel(PANEL.PENDING)}
                >
                  Đăng ký chờ duyệt
                  {eventsNeedApproval > 0 && (
                    <span className={styles.badge}>{eventsNeedApproval}</span>
                  )}
                </button>
              </li>
              <li>
                <button
                  className={
                    selectedPanel === PANEL.ENGAGEMENT ? styles.active : ""
                  }
                  onClick={() => setSelectedPanel(PANEL.ENGAGEMENT)}
                >
                  Engagement metrics
                </button>
              </li>
              <li>
                <button
                  className={selectedPanel === PANEL.HOT ? styles.active : ""}
                  onClick={() => setSelectedPanel(PANEL.HOT)}
                >
                  Sự kiện hot nhất
                </button>
              </li>
              <li>
                <button
                  className={
                    selectedPanel === PANEL.ALERTS ? styles.active : ""
                  }
                  onClick={() => setSelectedPanel(PANEL.ALERTS)}
                >
                  Alerts & Nhắc nhở
                </button>
              </li>
            </ul>
          </nav>

          <section className={`${styles.dashboardMainPanel} ${styles.panel}`}>
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
          <div className={styles.dashboardError}>
            Có lỗi xảy ra: {error.message || String(error)}
          </div>
        )}
      </main>
    </div>
  );
};

export default ManagerDashboard;
