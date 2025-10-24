import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import Navigation from "../components/navigation.jsx";
import Footer from "../components/footer.jsx";
import Notification from "../components/Notification.jsx";
import Toast from "../components/Toast.jsx";
import { authAPI } from "../services/api";
import { eventsService } from "../services/eventsService";
import "./events.css";

const Events = () => {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [notification, setNotification] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [events, setEvents] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingRegistration, setPendingRegistration] = useState(null);

  // Toast helper functions
  const showToast = (message, type = "info", duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // Đợi 500ms sau khi user ngừng gõ

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    checkAuth();
    loadEvents();
  }, []);

  // Load events khi search query hoặc category thay đổi
  useEffect(() => {
    if (debouncedSearchQuery !== "" || selectedCategory !== "all") {
      loadEvents();
    }
  }, [debouncedSearchQuery, selectedCategory]);

  const loadEvents = async () => {
    try {
      setSearchLoading(true);
      const eventsData = await eventsService.getAllEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await authAPI.getMe();
      if (response.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Không redirect, vì trang events có thể xem công khai
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (category) => {
    const categories = {
      environment: "🌱 Môi trường",
      education: "📚 Giáo dục",
      youth: "❤️ Y tế",
      elderly: "👴 Người cao tuổi",
      disabled: "♿ Người khuyết tật",
      healthcare: "👶 Trẻ em",
    };
    return categories[category] || category;
  };

  const getStatusBadge = (status, registered, max) => {
    if (status === "completed") {
      return { text: "Đã kết thúc", class: "status-completed" };
    }
    if (registered >= max) {
      return { text: "Đã đủ người", class: "status-full" };
    }
    return { text: "Đang mở", class: "status-open" };
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

  const handleViewDetail = (event) => {
    setSelectedEvent(event);
    setShowDetailModal(true);
  };

  const handleRegister = async (eventId) => {
    if (!user) {
      showToast("Vui lòng đăng nhập để đăng ký sự kiện!", "warning");
      setTimeout(() => {
        history.push("/login");
      }, 1500);
      return;
    }

    const event = events.find((e) => e._id === eventId || e.id === eventId);
    if (!event) return;

    if (event.status === "completed") {
      showToast("Sự kiện đã kết thúc!", "error");
      return;
    }

    if (event.registered >= event.maxParticipants) {
      showToast("Sự kiện đã đủ số lượng người tham gia!", "error");
      return;
    }

    // Hiện modal xác nhận thay vì window.confirm
    setPendingRegistration(event);
    setShowConfirmModal(true);
  };

  const handleConfirmRegistration = async () => {
    if (!pendingRegistration) return;

    setShowConfirmModal(false);

    try {
      await eventsService.registerForEvent(
        pendingRegistration._id || pendingRegistration.id
      );
      showToast("Đăng ký thành công! Đang chờ quản lý phê duyệt.", "success");
      setShowDetailModal(false);
      await loadEvents(); // Reload để cập nhật số lượng đã đăng ký
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi đăng ký";
      showToast(errorMessage, "error");
    } finally {
      setPendingRegistration(null);
    }
  };

  const handleCancelRegistration = () => {
    setShowConfirmModal(false);
    setPendingRegistration(null);
  };

  // Filter events
  const filteredEvents = events.filter((event) => {
    const matchCategory =
      selectedCategory === "all" || event.category === selectedCategory;
    const matchSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (loading) {
    return (
      <div className="events-container">
        <Navigation />
        <div className="events-loading">
          <div className="spinner"></div>
          <p>Đang tải sự kiện...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="events-container">
      <Helmet>
        <title>Sự Kiện Tình Nguyện - VolunteerHub</title>
        <meta
          property="og:title"
          content="Sự Kiện Tình Nguyện - VolunteerHub"
        />
      </Helmet>

      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <Navigation />

      <div className="events-wrapper">
        {/* Hero Section */}
        <div className="events-hero">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1 className="hero-title">Khám phá sự kiện tình nguyện</h1>
            <p className="hero-description">
              Tham gia các hoạt động ý nghĩa, góp phần xây dựng cộng đồng tốt
              đẹp hơn
            </p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="events-content">
          <div className="search-filter-section">
            <div className="search-box">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Tìm kiếm sự kiện..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="category-filter">
              <button
                className={`filter-btn ${
                  selectedCategory === "all" ? "active" : ""
                }`}
                onClick={() => setSelectedCategory("all")}
              >
                Tất cả
              </button>
              <button
                className={`filter-btn ${
                  selectedCategory === "environment" ? "active" : ""
                }`}
                onClick={() => setSelectedCategory("environment")}
              >
                🌱 Môi trường
              </button>
              <button
                className={`filter-btn ${
                  selectedCategory === "education" ? "active" : ""
                }`}
                onClick={() => setSelectedCategory("education")}
              >
                📚 Giáo dục
              </button>
              <button
                className={`filter-btn ${
                  selectedCategory === "youth" ? "active" : ""
                }`}
                onClick={() => setSelectedCategory("youth")}
              >
                ❤️ Y tế
              </button>
              <button
                className={`filter-btn ${
                  selectedCategory === "elderly" ? "active" : ""
                }`}
                onClick={() => setSelectedCategory("elderly")}
              >
                👴 Người cao tuổi
              </button>
              <button
                className={`filter-btn ${
                  selectedCategory === "healthcare" ? "active" : ""
                }`}
                onClick={() => setSelectedCategory("healthcare")}
              >
                👶 Trẻ em
              </button>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )}

          {/* Events List */}
          <div className="events-list">
            {filteredEvents.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>Không tìm thấy sự kiện nào</h3>
                <p>Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
              </div>
            ) : (
              filteredEvents.map((event) => (
                <div key={event._id || event.id} className="event-card">
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
                          {event.registered}/{event.maxParticipants} người
                        </span>
                      </div>
                    </div>

                    <p className="event-description">{event.description}</p>

                    <div className="event-actions">
                      <button
                        className="btn btn-outline"
                        onClick={() => handleViewDetail(event)}
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
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        Chi tiết
                      </button>
                      {event.userRegistrationStatus === "pending" ? (
                        <button className="btn btn-warning" disabled>
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
                          Chờ phê duyệt
                        </button>
                      ) : event.userRegistrationStatus === "approved" ? (
                        <button className="btn btn-success" disabled>
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
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                          </svg>
                          Đã phê duyệt
                        </button>
                      ) : event.userRegistrationStatus === "rejected" ? (
                        <button className="btn btn-secondary" disabled>
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
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                          </svg>
                          Đã từ chối
                        </button>
                      ) : (
                        <>
                          {event.status === "completed" ||
                          new Date(event.date) < new Date() ? (
                            <button className="btn btn-completed" disabled>
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
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                              </svg>
                              Đã hoàn thành
                            </button>
                          ) : (
                            <button
                              className="btn btn-primary"
                              onClick={() =>
                                handleRegister(event._id || event.id)
                              }
                              disabled={
                                event.registered >= event.maxParticipants
                              }
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
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <line x1="19" y1="8" x2="19" y2="14" />
                                <line x1="22" y1="11" x2="16" y2="11" />
                              </svg>
                              Đăng ký
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedEvent && (
        <div
          className="modal-overlay"
          onClick={() => setShowDetailModal(false)}
        >
          <div
            className="modal-content modal-large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>{selectedEvent.title}</h2>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>Thông tin chung</h3>
                <div className="detail-info-grid">
                  <div className="detail-info-item">
                    <strong>Tổ chức:</strong>
                    <span>{selectedEvent.organization}</span>
                  </div>
                  <div className="detail-info-item">
                    <strong>Ngày:</strong>
                    <span>{formatDate(selectedEvent.date)}</span>
                  </div>
                  <div className="detail-info-item">
                    <strong>Địa điểm:</strong>
                    <span>{selectedEvent.location}</span>
                  </div>
                  <div className="detail-info-item">
                    <strong>Lĩnh vực:</strong>
                    <span>{getCategoryName(selectedEvent.category)}</span>
                  </div>
                  <div className="detail-info-item">
                    <strong>Số giờ:</strong>
                    <span>{selectedEvent.hours} giờ tình nguyện</span>
                  </div>
                  <div className="detail-info-item">
                    <strong>Số người:</strong>
                    <span>
                      {selectedEvent.registered}/{selectedEvent.maxParticipants}{" "}
                      người
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Mô tả</h3>
                <p>{selectedEvent.description}</p>
              </div>

              <div className="detail-section">
                <h3>Yêu cầu</h3>
                <ul className="detail-list">
                  {selectedEvent.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              <div className="detail-section">
                <h3>Quyền lợi</h3>
                <ul className="detail-list">
                  {selectedEvent.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-outline"
                onClick={() => setShowDetailModal(false)}
              >
                Đóng
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleRegister(selectedEvent.id)}
                disabled={
                  selectedEvent.status === "completed" ||
                  selectedEvent.registered >= selectedEvent.maxParticipants
                }
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
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
                Đăng ký ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && pendingRegistration && (
        <div className="modal-overlay" onClick={handleCancelRegistration}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Xác nhận đăng ký</h3>
            </div>
            <div className="modal-body">
              <p>
                Bạn có chắc muốn đăng ký tham gia sự kiện{" "}
                <strong>"{pendingRegistration.title}"</strong>?
              </p>
              <p className="modal-body-subtitle">
                Đăng ký của bạn sẽ được chuyển đến quản lý sự kiện để phê duyệt.
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={handleCancelRegistration}
              >
                Hủy
              </button>
              <button
                className="btn-primary"
                onClick={handleConfirmRegistration}
              >
                Xác nhận đăng ký
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default Events;
