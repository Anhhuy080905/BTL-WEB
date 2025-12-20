import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import { authAPI } from "../services/api";
import { eventsService } from "../services/eventsService";
import EventCard from "../components/EventCard.jsx";
import styles from "./volunteer-dashboard.module.css";

const PANEL = {
  NEW: "new",
  TRENDING: "trending",
  SUGGESTED: "suggested",
  STATS: "stats",
};

const VolunteerDashboard = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [allEvents, setAllEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // which panel is selected
  const [selectedPanel, setSelectedPanel] = useState(PANEL.NEW);

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
      if (me.success) setUser(me.data.user);

      const events = await eventsService.getAllEvents();
      const registered = await eventsService.getMyRegisteredEvents();

      setAllEvents(events || []);
      setMyEvents(registered || []);
    } catch (err) {
      console.error("Error loading dashboard:", err);
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
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const newEvents = allEvents.filter((e) => {
    const created = e.createdAt ? new Date(e.createdAt) : null;
    return created && created >= sevenDaysAgo;
  });

  const trendingEvents = [...allEvents]
    .sort(
      (a, b) =>
        (b.registered || b.participants?.length || 0) -
        (a.registered || a.participants?.length || 0)
    )
    .slice(0, 8);

  const interestCategories = user?.interests
    ? Object.keys(user.interests).filter((k) => user.interests[k])
    : [];

  const suggestedEvents = allEvents.filter((e) => {
    if (!interestCategories.length) return false;
    return interestCategories.includes(e.category);
  });

  // Personal stats
  const totalRegistered = myEvents.length;
  const completedEvents = myEvents.filter(
    (e) =>
      e.completed ||
      (e.registrationStatus === "approved" && e.status === "completed")
  );
  const attendedCount = myEvents.filter((e) => e.completed).length;
  const totalHours = completedEvents.reduce(
    (sum, e) => sum + (e.hours || 0),
    0
  );

  const handleRSVP = async (eventId) => {
    try {
      await eventsService.registerForEvent(eventId);
      alert("Đăng ký thành công. Vui lòng chờ phê duyệt nếu có.");
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Không thể đăng ký vào lúc này.");
    }
  };

  if (loading) {
    return (
      <div className={styles["volunteer-dashboard-root"]}>
        <main className={styles["dashboard-loading"]}>
          <div className={styles.spinner} />
          <p>Đang tải thông tin Dashboard...</p>
        </main>
      </div>
    );
  }

  // Render content for the selected panel
  const renderPanelContent = () => {
    switch (selectedPanel) {
      case PANEL.NEW:
        return newEvents.length === 0 ? (
          <div className={styles.empty}>
            Không có sự kiện mới trong tuần này.
          </div>
        ) : (
          <div className={styles["event-list"]}>
            {newEvents.map((e, i) => (
              <EventCard
                key={e._id || e.id || i}
                event={e}
                index={i}
                onRSVP={handleRSVP}
              />
            ))}
          </div>
        );

      case PANEL.TRENDING:
        return trendingEvents.length === 0 ? (
          <div className={styles.empty}>Không có sự kiện trending.</div>
        ) : (
          <div className={styles["event-list"]}>
            {trendingEvents.map((e, i) => (
              <EventCard
                key={e._id || e.id || i}
                event={e}
                index={i}
                onRSVP={handleRSVP}
              />
            ))}
          </div>
        );

      case PANEL.SUGGESTED:
        return suggestedEvents.length === 0 ? (
          <div className={styles.empty}>
            Cập nhật interests của bạn để nhận gợi ý tốt hơn.
          </div>
        ) : (
          <div className={styles["event-list"]}>
            {suggestedEvents.map((e, i) => (
              <EventCard
                key={e._id || e.id || i}
                event={e}
                index={i}
                onRSVP={handleRSVP}
              />
            ))}
          </div>
        );

      case PANEL.STATS:
        return (
          <div className={styles["stats-panel-content"]}>
            <div className={styles["stat-item"]}>
              <div className={styles.label}>Tổng sự kiện đã đăng ký</div>
              <div className={styles.value}>{totalRegistered}</div>
            </div>
            <div className={styles["stat-item"]}>
              <div className={styles.label}>Sự kiện đã hoàn thành</div>
              <div className={styles.value}>{attendedCount}</div>
            </div>
            <div className={styles["stat-item"]}>
              <div className={styles.label}>Tổng giờ tình nguyện</div>
              <div className={styles.value}>{totalHours}</div>
            </div>
            <div className={styles["stat-item"]}>
              <div className={styles.label}>Sở thích</div>
              <div className={styles.value}>
                {interestCategories.join(", ") || "Chưa có"}
              </div>
            </div>

            <div className={styles["personal-actions"]}>
              <button
                className={`${styles.btn} ${styles["btn-primary"]}`}
                onClick={() => history.push("/my-events")}
              >
                Quản lý sự kiện của tôi
              </button>
              <button
                className={`${styles.btn} ${styles["btn-outline"]}`}
                onClick={() => history.push("/events")}
              >
                Khám phá sự kiện
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles["volunteer-dashboard-root"]}>
      <Helmet>
        <title>Volunteer Dashboard - VolunteerHub</title>
      </Helmet>

      <main
        className={`${styles["volunteer-dashboard-container"]} ${styles["with-sidebar"]}`}
      >
        <header className={styles["dashboard-hero"]}>
          <div>
            <h1>Trang quản lý tình nguyện viên</h1>
            <p>
              Xin chào, {user?.fullName || user?.username || "Bạn"} — đây là
              tổng quan hoạt động của bạn.
            </p>
          </div>

          <div className={styles["hero-stats"]}>
            <div className={styles.stat}>
              <div className={styles.num}>{totalRegistered}</div>
              <div className={styles.label}>Đã đăng ký</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.num}>{attendedCount}</div>
              <div className={styles.label}>Đã tham gia</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.num}>{totalHours}</div>
              <div className={styles.label}>Tổng giờ</div>
            </div>
          </div>
        </header>

        <section className={styles["dashboard-grid-with-sidebar"]}>
          <nav
            className={styles["dashboard-sidebar"]}
            aria-label="Dashboard panels"
          >
            <ul>
              <li>
                <button
                  className={selectedPanel === PANEL.NEW ? styles.active : ""}
                  onClick={() => setSelectedPanel(PANEL.NEW)}
                >
                  Sự kiện mới công bố (7 ngày)
                </button>
              </li>
              <li>
                <button
                  className={
                    selectedPanel === PANEL.TRENDING ? styles.active : ""
                  }
                  onClick={() => setSelectedPanel(PANEL.TRENDING)}
                >
                  Sự kiện trending
                </button>
              </li>
              <li>
                <button
                  className={
                    selectedPanel === PANEL.SUGGESTED ? styles.active : ""
                  }
                  onClick={() => setSelectedPanel(PANEL.SUGGESTED)}
                >
                  Gợi ý theo interests
                </button>
              </li>
              <li>
                <button
                  className={selectedPanel === PANEL.STATS ? styles.active : ""}
                  onClick={() => setSelectedPanel(PANEL.STATS)}
                >
                  Thống kê cá nhân
                </button>
              </li>
            </ul>
          </nav>

          <section
            className={`${styles["dashboard-main-panel"]} ${styles.panel}`}
          >
            <h2>
              {selectedPanel === PANEL.NEW && "Sự kiện mới công bố (7 ngày)"}
              {selectedPanel === PANEL.TRENDING && "Sự kiện trending"}
              {selectedPanel === PANEL.SUGGESTED && "Gợi ý theo interests"}
              {selectedPanel === PANEL.STATS && "Thống kê cá nhân"}
            </h2>

            {renderPanelContent()}
          </section>
        </section>

        {error && (
          <div className={styles["dashboard-error"]}>
            Có lỗi xảy ra: {error.message || String(error)}
          </div>
        )}
      </main>
    </div>
  );
};

export default VolunteerDashboard;
