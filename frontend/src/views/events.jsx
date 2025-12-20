import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet";
import Notification from "../components/Notification.jsx";
import Toast from "../components/Toast.jsx";
import { authAPI } from "../services/api";
import { eventsService } from "../services/eventsService";
import "./events.css";
import { useParams, useHistory, Link } from "react-router-dom";

const Events = () => {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
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
  const { id, slug } = useParams();

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

  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Load events khi search query hoặc category hoặc timeRange thay đổi
  useEffect(() => {
    loadEvents();
  }, [
    debouncedSearchQuery,
    selectedCategory,
    selectedTimeRange,
    customStartDate,
    customEndDate,
  ]);

  useEffect(() => {
    if (id && events.length > 0) {
      const foundEvent = events.find((e) => (e._id === id) || (e.id === id));
      if (foundEvent) {
        setSelectedEvent(foundEvent);
        setShowDetailModal(true);
        document.body.style.overflow = "hidden";

        // Nếu slug không đúng → redirect URL đẹp
        const correctSlug = foundEvent.slug || "";
        if (slug !== correctSlug) {
            const eventId = foundEvent._id || foundEvent.id;
            history.replace(`/events/${correctSlug}`);
        }
      }
    }
  }, [id, slug, events, history]);

  const loadEvents = async () => {
    try {
      setSearchLoading(true);
      const filters = {
        category: selectedCategory,
        search: debouncedSearchQuery,
        timeRange: selectedTimeRange,
      };

      // Nếu chọn custom date range
      if (selectedTimeRange === "custom") {
        if (customStartDate) filters.startDate = customStartDate;
        if (customEndDate) filters.endDate = customEndDate;
      }

      const eventsData = await eventsService.getAllEvents(filters);
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

  const handleViewDetail = (event) => {
    if (!event) return;
    const eventId = event._id || event.id;
    setSelectedEvent(event);
    setShowDetailModal(true);
    document.body.style.overflow = "hidden";

    // Thay đổi URL thành dạng đẹp (không reload trang)
    history.replace(`/events/${event.slug || ""}`);
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

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedEvent(null);
    document.body.style.overflow = "auto";
    history.replace("/events", { replace: true });
  };

  // Reset scroll khi mở modal
  useEffect(() => {
    if (showDetailModal) {
      document.body.style.overflow = "hidden";
      // Force scroll về top ngay lập tức nhiều lần
      const scrollToTop = () => {
        const modalBody = document.querySelector(".modal-body");
        if (modalBody) {
          modalBody.scrollTop = 0;
        }
      };

      scrollToTop();
      requestAnimationFrame(scrollToTop);
      setTimeout(scrollToTop, 10);
      setTimeout(scrollToTop, 50);
      setTimeout(scrollToTop, 100);
      setTimeout(scrollToTop, 200);
      setTimeout(scrollToTop, 300);
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showDetailModal]);

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
      handleCloseModal();
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

  // Hiển thị events từ backend (đã được filter)
  const filteredEvents = events;

  if (loading) {
    return (
      <div className="events-container">
        <div className="events-loading">
          <div className="spinner"></div>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="events-container">
      {/* SỬA: Dùng Helmet nhưng nội dung Động (Dynamic) */}
      <Helmet>
        <title>
          {selectedEvent
            ? `${selectedEvent.title} | VolunteerHub`
            : "Sự Kiện Tình Nguyện - VolunteerHub"}
        </title>
        <meta
          name="description"
          content={
            selectedEvent
              ? selectedEvent.description?.substring(0, 160)
              : "Tham gia các hoạt động ý nghĩa, góp phần xây dựng cộng đồng tốt đẹp hơn"
          }
        />
        <meta
          property="og:title"
          content={selectedEvent?.title || "Sự Kiện Tình Nguyện - VolunteerHub"}
        />
        {selectedEvent?.images?.[0] && (
          <meta property="og:image" content={selectedEvent.images[0]} />
        )}
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      {/* Notifications */}
      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

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
              {["all", "environment", "education", "youth", "elderly", "healthcare"].map(
                (cat) => (
                  <button
                    key={cat}
                    className={`filter-btn ${selectedCategory === cat ? "active" : ""}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat === "all" ? "Tất cả" : getCategoryName(cat)}
                  </button>
                )
              )}
            </div>

            {/* Time Filter */}
            <div className="time-filter">
              <label className="filter-label">📅 Lọc theo thời gian:</label>
              <div className="time-filter-buttons">
                {["all", "today", "week", "month", "quarter", "upcoming", "custom"].map(
                  (range) => (
                    <button
                      key={range}
                      className={`filter-btn ${
                        selectedTimeRange === range ? "active" : ""
                      }`}
                      onClick={() => {
                        setSelectedTimeRange(range);
                        if (range !== "custom") {
                          setCustomStartDate("");
                          setCustomEndDate("");
                        }
                      }}
                    >
                      {range === "all"
                        ? "Tất cả"
                        : range === "today"
                        ? "Hôm nay"
                        : range === "week"
                        ? "Tuần này"
                        : range === "month"
                        ? "Tháng này"
                        : range === "quarter"
                        ? "Quý này"
                        : range === "upcoming"
                        ? "Sắp tới"
                        : "Tùy chỉnh"}
                    </button>
                  )
                )}
              </div>

              {/* Custom Date Range */}
              {selectedTimeRange === "custom" && (
                <div className="custom-date-range">
                  <div className="date-input-group">
                    <label>Từ ngày:</label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                    />
                  </div>
                  <div className="date-input-group">
                    <label>Đến ngày:</label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                    />
                  </div>
                </div>
              )}
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
                        <span>📅 {formatDate(event.date)}</span>
                      </div>
                      <div className="info-row">
                        <span>📍 {event.location}</span>
                      </div>
                      <div className="info-row">
                        <span>⏰ {event.hours} giờ</span>
                      </div>
                      <div className="info-row">
                        <span>
                          👥 {event.registered}/{event.maxParticipants} người
                        </span>
                      </div>
                    </div>

                    <p
                      className="event-description"
                      title={event.description}
                    >
                      {event.description}
                    </p>

                    <div className="event-actions">
                      <button
                        className="btn btn-outline"
                        onClick={() => handleViewDetail(event)}
                      >
                        Chi tiết
                      </button>

                      {event.userRegistrationStatus === "pending" ? (
                        <button className="btn btn-warning" disabled>
                          Chờ phê duyệt
                        </button>
                      ) : event.userRegistrationStatus === "approved" ? (
                        <button className="btn btn-success" disabled>
                          Đã phê duyệt
                        </button>
                      ) : event.userRegistrationStatus === "rejected" ? (
                        <button className="btn btn-secondary" disabled>
                          Đã từ chối
                        </button>
                      ) : (
                        <>
                          {event.status === "completed" ||
                          new Date(event.date) < new Date() ? (
                            <button className="btn btn-completed" disabled>
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
          onClick={handleCloseModal}
          key={selectedEvent.id}
        >
          <div
            className="modal-content modal-large"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                margin: "0",
                padding: "24px 24px 16px 24px",
                fontSize: "22px",
                fontWeight: "700",
                borderBottom: "2px solid #e0e0e0",
                background: "white",
                borderRadius: "16px 16px 0 0",
              }}
            >
              {selectedEvent.title}
            </h2>

            <div className="modal-body">
              <div className="detail-section">
                <div className="detail-info-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                   <div className="detail-info-item"><strong>🏢 Tổ chức:</strong> {selectedEvent.organization}</div>
                   <div className="detail-info-item"><strong>📅 Ngày:</strong> {formatDate(selectedEvent.date)}</div>
                   <div className="detail-info-item"><strong>📍 Địa điểm:</strong> {selectedEvent.location}</div>
                   <div className="detail-info-item"><strong>🎯 Lĩnh vực:</strong> {getCategoryName(selectedEvent.category)}</div>
                </div>
              </div>
              <div className="detail-section">
                <h3>Mô tả</h3>
                <p>{selectedEvent.description}</p>
              </div>
              {selectedEvent.requirements && (
                  <div className="detail-section">
                      <h3>Yêu cầu</h3>
                      <ul>{selectedEvent.requirements.map((r, i) => <li key={i}>{r}</li>)}</ul>
                  </div>
              )}
               {selectedEvent.benefits && (
                  <div className="detail-section">
                      <h3>Quyền lợi</h3>
                      <ul>{selectedEvent.benefits.map((b, i) => <li key={i}>{b}</li>)}</ul>
                  </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={handleCloseModal}>
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
              <p>Bạn có chắc muốn đăng ký sự kiện <strong>"{pendingRegistration.title}"</strong>?</p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={handleCancelRegistration}>Hủy</button>
              <button className="btn-primary" onClick={handleConfirmRegistration}>Xác nhận</button>
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
    </div>
  );
};

export default Events;