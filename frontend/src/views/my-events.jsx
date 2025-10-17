import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import Navigation from "../components/navigation.jsx";
import Footer from "../components/footer.jsx";
import { authAPI } from "../services/api";
import { eventsService } from "../services/eventsService";
import "./my-events.css";

const MyEvents = () => {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("joined"); // joined, created, pending
  const [events, setEvents] = useState({
    joined: [],
    created: [],
    pending: [],
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch user profile
      const userResponse = await authAPI.getMe();
      if (userResponse.success) {
        setUser(userResponse.data.user);
      }

      // Fetch registered events
      const registeredEvents = await eventsService.getMyRegisteredEvents();

      // Phân loại events theo status
      const joined = registeredEvents.filter(
        (e) => e.registrationStatus === "approved"
      );
      const pending = registeredEvents.filter(
        (e) => e.registrationStatus === "pending"
      );

      // Fetch created events (nếu là event_manager hoặc admin)
      let created = [];
      if (
        userResponse.data.user.role === "event_manager" ||
        userResponse.data.user.role === "admin"
      ) {
        created = await eventsService.getMyCreatedEvents();
      }

      setEvents({ joined, created, pending });
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.status === 401) {
        history.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      upcoming: { text: "Sắp diễn ra", class: "status-upcoming" },
      completed: { text: "Đã hoàn thành", class: "status-completed" },
      pending: { text: "Chờ phê duyệt", class: "status-pending" },
    };
    return statusMap[status] || statusMap.pending;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setShowDetailModal(true);
  };

  const handleCancelRegistration = async (eventId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy tham gia sự kiện này?")) {
      return;
    }

    try {
      await eventsService.unregisterFromEvent(eventId);
      alert("Đã hủy tham gia sự kiện thành công!");
      // Reload data
      fetchData();
    } catch (error) {
      console.error("Error canceling registration:", error);
      alert(error.response?.data?.message || "Không thể hủy tham gia sự kiện");
    }
  };

  if (loading) {
    return (
      <div className="my-events-container">
        <Navigation />
        <div className="events-loading">
          <div className="spinner"></div>
          <p>Đang tải sự kiện...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const currentEvents = events[activeTab] || [];

  return (
    <div className="my-events-container">
      <Helmet>
        <title>Hoạt Động & Sự Kiện - VolunteerHub</title>
        <meta
          property="og:title"
          content="Hoạt Động & Sự Kiện - VolunteerHub"
        />
      </Helmet>

      <Navigation />

      <div className="my-events-wrapper">
        {/* Hero Section */}
        <div className="events-hero">
          <div className="hero-content">
            <h1 className="hero-title">Hoạt động & Sự kiện của tôi</h1>
            <p className="hero-description">
              Quản lý các sự kiện tình nguyện bạn đã tham gia và tạo ra
            </p>
          </div>
          <div className="hero-stats">
            <div className="hero-stat-item">
              <div className="stat-number">{events.joined.length}</div>
              <div className="stat-label">Đã tham gia</div>
            </div>
            <div className="hero-stat-item">
              <div className="stat-number">
                {events.joined.reduce((sum, event) => sum + event.hours, 0)}
              </div>
              <div className="stat-label">Giờ tình nguyện</div>
            </div>
            <div className="hero-stat-item">
              <div className="stat-number">{events.created.length}</div>
              <div className="stat-label">Sự kiện tạo</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="events-content">
          <div className="events-tabs">
            <button
              className={`tab-button ${activeTab === "joined" ? "active" : ""}`}
              onClick={() => setActiveTab("joined")}
            >
              <span className="tab-icon">📅</span>
              <span>Đã tham gia</span>
              <span className="tab-count">{events.joined.length}</span>
            </button>
            {user?.role === "event_manager" || user?.role === "admin" ? (
              <button
                className={`tab-button ${
                  activeTab === "created" ? "active" : ""
                }`}
                onClick={() => setActiveTab("created")}
              >
                <span className="tab-icon">✨</span>
                <span>Đã tạo</span>
                <span className="tab-count">{events.created.length}</span>
              </button>
            ) : null}
            <button
              className={`tab-button ${
                activeTab === "pending" ? "active" : ""
              }`}
              onClick={() => setActiveTab("pending")}
            >
              <span className="tab-icon">⏳</span>
              <span>Chờ phê duyệt</span>
              <span className="tab-count">{events.pending.length}</span>
            </button>
          </div>

          {/* Events List */}
          <div className="events-list">
            {currentEvents.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>Chưa có sự kiện nào</h3>
                <p>
                  {activeTab === "joined"
                    ? "Bạn chưa tham gia sự kiện nào. Hãy khám phá và đăng ký ngay!"
                    : activeTab === "created"
                    ? "Bạn chưa tạo sự kiện nào. Bắt đầu tạo sự kiện đầu tiên!"
                    : "Không có đơn đăng ký nào đang chờ phê duyệt."}
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => history.push("/")}
                >
                  Khám phá sự kiện
                </button>
              </div>
            ) : (
              currentEvents.map((event) => (
                <div key={event.id} className="event-card">
                  <div className="event-image">
                    <img src={event.image} alt={event.title} />
                    <span
                      className={`event-status-badge ${
                        getStatusBadge(event.status).class
                      }`}
                    >
                      {getStatusBadge(event.status).text}
                    </span>
                  </div>
                  <div className="event-details">
                    <div className="event-header">
                      <h3 className="event-title">{event.title}</h3>
                      <div className="event-organization">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        {event.organization}
                      </div>
                    </div>

                    <div className="event-info">
                      <div className="info-row">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="3"
                            y="4"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                          />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span>{formatDate(event.date)}</span>
                      </div>

                      <div className="info-row">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span>{event.location}</span>
                      </div>

                      <div className="info-row">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>{event.hours} giờ</span>
                      </div>

                      <div className="info-row">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        <span>
                          {event.registered && event.maxParticipants
                            ? `${event.registered}/${event.maxParticipants} người`
                            : `${event.maxParticipants || 0} người`}
                        </span>
                      </div>
                    </div>

                    <div className="event-actions">
                      {event.status === "upcoming" && (
                        <>
                          <button
                            className="btn btn-outline"
                            onClick={() => handleViewDetails(event)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            Chi tiết
                          </button>
                          {activeTab === "joined" &&
                            event.registrationStatus === "approved" && (
                              <>
                                <button
                                  className="btn btn-danger-outline"
                                  onClick={() =>
                                    handleCancelRegistration(event._id)
                                  }
                                >
                                  Hủy tham gia
                                </button>
                              </>
                            )}
                          {activeTab === "joined" &&
                            event.registrationStatus !== "approved" && (
                              <button
                                className="btn btn-danger-outline"
                                onClick={() =>
                                  handleCancelRegistration(event._id)
                                }
                              >
                                Hủy tham gia
                              </button>
                            )}
                        </>
                      )}
                      {event.status === "completed" && (
                        <>
                          <button
                            className="btn btn-outline"
                            onClick={() => handleViewDetails(event)}
                          >
                            Xem lại
                          </button>
                          <button className="btn btn-primary">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                            Nhận chứng nhận
                          </button>
                        </>
                      )}
                      {event.status === "pending" && (
                        <button className="btn btn-outline" disabled>
                          Chờ phê duyệt...
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {showDetailModal && selectedEvent && (
        <div
          className="modal-overlay"
          onClick={() => setShowDetailModal(false)}
        >
          <div
            className="modal-content event-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>{selectedEvent.title}</h2>
              <button
                className="modal-close-btn"
                onClick={() => setShowDetailModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="event-detail-section">
                <h3>📋 Mô tả</h3>
                <p>{selectedEvent.description || "Chưa có mô tả"}</p>
              </div>

              <div className="event-detail-section">
                <h3>📍 Địa điểm</h3>
                <p>{selectedEvent.location || "Chưa xác định"}</p>
              </div>

              <div className="event-detail-grid">
                <div className="event-detail-item">
                  <h4>📅 Ngày bắt đầu</h4>
                  <p>{formatDate(selectedEvent.date)}</p>
                </div>
                <div className="event-detail-item">
                  <h4>📅 Ngày kết thúc</h4>
                  <p>
                    {selectedEvent.endDate
                      ? formatDate(selectedEvent.endDate)
                      : "Chưa xác định"}
                  </p>
                </div>
              </div>

              <div className="event-detail-grid">
                <div className="event-detail-item">
                  <h4>⏰ Giờ bắt đầu</h4>
                  <p>{selectedEvent.time || "Chưa xác định"}</p>
                </div>
                <div className="event-detail-item">
                  <h4>👥 Số người tham gia</h4>
                  <p>
                    {selectedEvent.registered || 0} /{" "}
                    {selectedEvent.maxParticipants || "Không giới hạn"}
                  </p>
                </div>
              </div>

              <div className="event-detail-section">
                <h3>👤 Người tạo</h3>
                <p>
                  {selectedEvent.creator?.fullName ||
                    selectedEvent.creator?.username ||
                    "Chưa có thông tin"}
                </p>
              </div>

              {selectedEvent.requirements && (
                <div className="event-detail-section">
                  <h3>✅ Yêu cầu</h3>
                  <p>{selectedEvent.requirements}</p>
                </div>
              )}

              <div className="event-detail-section">
                <h3>📊 Trạng thái</h3>
                <span
                  className={`status-badge ${
                    getStatusBadge(selectedEvent.status).class
                  }`}
                >
                  {getStatusBadge(selectedEvent.status).text}
                </span>
                {selectedEvent.registrationStatus && (
                  <span
                    className={`status-badge status-${selectedEvent.registrationStatus}`}
                    style={{ marginLeft: "8px" }}
                  >
                    {selectedEvent.registrationStatus === "approved"
                      ? "Đã duyệt"
                      : selectedEvent.registrationStatus === "pending"
                      ? "Chờ duyệt"
                      : selectedEvent.registrationStatus === "rejected"
                      ? "Bị từ chối"
                      : selectedEvent.registrationStatus}
                  </span>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-outline"
                onClick={() => setShowDetailModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default MyEvents;
