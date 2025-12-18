import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import { eventsService } from "../services/eventsService";
import { authAPI } from "../services/api";
import "./events-manager.css";

const EventsManager = () => {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const hasFetchedRef = React.useRef(false);

  // Time filter
  const [timeFilter, setTimeFilter] = useState("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const categories = [
    { value: "all", label: "Tất cả", icon: "🌐" },
    { value: "environment", label: "Môi trường", icon: "🌱" },
    { value: "education", label: "Giáo dục", icon: "📚" },
    { value: "youth", label: "Y tế", icon: "❤️" },
    { value: "elderly", label: "Người cao tuổi", icon: "👴" },
    { value: "disabled", label: "Người khuyết tật", icon: "♿" },
    { value: "healthcare", label: "Trẻ em", icon: "👶" },
  ];

  useEffect(() => {
    // Chỉ fetch một lần khi component mount để tránh duplicate requests
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchUser();
      loadEvents();
    }
  }, []);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    filterEvents();
  }, [
    events,
    searchTerm,
    selectedCategory,
    timeFilter,
    customStartDate,
    customEndDate,
  ]);

  const fetchUser = async () => {
    try {
      // Check if user is authenticated first
      if (!authAPI.isAuthenticated()) {
        console.log("User not authenticated, redirecting to login");
        history.push("/login");
        return;
      }

      const response = await authAPI.getMe();
      if (response.success) {
        setUser(response.data.user);
        console.log("User role:", response.data.user.role);
        // Kiểm tra role
        if (
          response.data.user.role !== "event_manager" &&
          response.data.user.role !== "admin"
        ) {
          console.log("User is not manager/admin, redirecting to /events");
          history.push("/events"); // Redirect về trang events cho volunteer
        }
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      if (error.response?.status === 401) {
        history.push("/login");
      }
    }
  };

  const loadEvents = async () => {
    try {
      const eventsData = await eventsService.getAllEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = [...events];

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (event) => event.category === selectedCategory
      );
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(search) ||
          event.location.toLowerCase().includes(search) ||
          event.organization.toLowerCase().includes(search)
      );
    }

    // Filter by time
    if (timeFilter !== "all") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.date);

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
            const startOfMonth = new Date(
              today.getFullYear(),
              today.getMonth(),
              1
            );
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
            const start = customStartDate
              ? new Date(customStartDate)
              : new Date(0);
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
    }

    setFilteredEvents(filtered);
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setShowDetailModal(true);
    document.body.style.overflow = "hidden";
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedEvent(null);
    document.body.style.overflow = "auto";
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      upcoming: { text: "Sắp diễn ra", class: "status-upcoming" },
      ongoing: { text: "Đang diễn ra", class: "status-ongoing" },
      completed: { text: "Đã kết thúc", class: "status-completed" },
      cancelled: { text: "Đã hủy", class: "status-cancelled" },
    };
    return statusMap[status] || statusMap.upcoming;
  };

  const getCategoryLabel = (categoryValue) => {
    const category = categories.find((cat) => cat.value === categoryValue);
    return category ? `${category.icon} ${category.label}` : categoryValue;
  };

  if (loading) {
    return (
      <div className="events-manager-container">
        <div className="events-loading">
          <div className="spinner"></div>
          <p>Đang tải sự kiện...</p>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== "event_manager" && user.role !== "admin")) {
    return null;
  }

  return (
    <div className="events-manager-container">
      <Helmet>
        <title>Danh Sách Sự Kiện - Quản Lý - VolunteerHub</title>
      </Helmet>

      <div className="events-manager-wrapper">
        {/* Hero Section */}
        <div className="events-hero">
          <div className="hero-content">
            <h1>📋 Tất Cả Sự Kiện</h1>
            <p>Xem tổng quan tất cả sự kiện trên hệ thống</p>
          </div>
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">{events.length}</div>
              <div className="stat-label">Tổng sự kiện</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {events.filter((e) => e.status === "upcoming").length}
              </div>
              <div className="stat-label">Sắp diễn ra</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {events.filter((e) => e.status === "ongoing").length}
              </div>
              <div className="stat-label">Đang diễn ra</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {events.reduce((sum, e) => sum + (e.registered || 0), 0)}
              </div>
              <div className="stat-label">Lượt đăng ký</div>
            </div>
          </div>
        </div>

        {/* Time Filter Section */}
        <div className="time-filter-section">
          <label className="filter-label">📅 Lọc theo thời gian:</label>
          <div className="time-filter-buttons">
            <button
              className={`filter-btn-sm ${
                timeFilter === "all" ? "active" : ""
              }`}
              onClick={() => setTimeFilter("all")}
            >
              Tất cả
            </button>
            <button
              className={`filter-btn-sm ${
                timeFilter === "today" ? "active" : ""
              }`}
              onClick={() => setTimeFilter("today")}
            >
              Hôm nay
            </button>
            <button
              className={`filter-btn-sm ${
                timeFilter === "week" ? "active" : ""
              }`}
              onClick={() => setTimeFilter("week")}
            >
              Tuần này
            </button>
            <button
              className={`filter-btn-sm ${
                timeFilter === "month" ? "active" : ""
              }`}
              onClick={() => setTimeFilter("month")}
            >
              Tháng này
            </button>
            <button
              className={`filter-btn-sm ${
                timeFilter === "upcoming" ? "active" : ""
              }`}
              onClick={() => setTimeFilter("upcoming")}
            >
              Sắp diễn ra
            </button>
            <button
              className={`filter-btn-sm ${
                timeFilter === "past" ? "active" : ""
              }`}
              onClick={() => setTimeFilter("past")}
            >
              Đã qua
            </button>
            <button
              className={`filter-btn-sm ${
                timeFilter === "custom" ? "active" : ""
              }`}
              onClick={() => setTimeFilter("custom")}
            >
              Tùy chỉnh
            </button>
          </div>
          {timeFilter === "custom" && (
            <div className="custom-date-range-inline">
              <div className="date-input-group-inline">
                <label>Từ:</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                />
              </div>
              <div className="date-input-group-inline">
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

        {/* Search and Filter */}
        <div className="events-controls">
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
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm sự kiện..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category.value}
                className={`category-btn ${
                  selectedCategory === category.value ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category.value)}
              >
                <span className="category-icon">{category.icon}</span>
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="events-content">
          {filteredEvents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>Không tìm thấy sự kiện</h3>
              <p>Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
            </div>
          ) : (
            <div className="events-grid">
              {filteredEvents.map((event) => (
                <div key={event._id || event.id} className="event-card-manager">
                  <div className="event-content">
                    <div className="event-category">
                      {getCategoryLabel(event.category)}
                    </div>

                    <h3 className="event-title">{event.title}</h3>

                    <div className="event-meta">
                      <div className="meta-item">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
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
                        <span>
                          {new Date(event.date).toLocaleDateString("vi-VN")}
                        </span>
                      </div>

                      <div className="meta-item">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <div className="event-organization">
                      Tổ chức:{" "}
                      {event.organization || event.createdBy?.username || "N/A"}
                    </div>

                    <div className="event-stats">
                      <div className="stat-item">
                        <strong>{event.registered || 0}</strong>/
                        {event.maxParticipants}
                        <span className="stat-label">Đã đăng ký</span>
                      </div>
                      <div className="stat-item">
                        <strong>{event.hours || 0}</strong>
                        <span className="stat-label">Giờ</span>
                      </div>
                    </div>

                    <button
                      className="btn-view-details"
                      onClick={() => handleViewDetails(event)}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedEvent && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div
            className="modal-content modal-large"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                margin: "0",
                padding: "24px 24px 10px 24px",
                fontSize: "22px",
                fontWeight: "700",
                color: "#1a1a1a",
                borderBottom: "2px solid #e0e0e0",
                background: "white",
                borderRadius: "16px 16px 0 0",
              }}
            >
              {selectedEvent.title}
            </h2>

            <div
              className="modal-body"
              ref={(el) => {
                if (el) {
                  el.scrollTop = 0;
                }
              }}
            >
              <div
                className="detail-section"
                style={{ display: "block", width: "100%", paddingTop: "8px" }}
              >
                <div
                  className="detail-info-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "16px",
                    width: "100%",
                    marginTop: "30px",
                  }}
                >
                  <div className="detail-info-item">
                    <strong>Tổ chức:</strong>
                    <span>
                      {selectedEvent.organization ||
                        selectedEvent.createdBy?.username ||
                        "N/A"}
                    </span>
                  </div>
                  <div className="detail-info-item">
                    <strong>Ngày:</strong>
                    <span>
                      {new Date(selectedEvent.date).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div className="detail-info-item">
                    <strong>Địa điểm:</strong>
                    <span>{selectedEvent.location}</span>
                  </div>
                  <div className="detail-info-item">
                    <strong>Lĩnh vực:</strong>
                    <span>{getCategoryLabel(selectedEvent.category)}</span>
                  </div>
                  <div className="detail-info-item">
                    <strong>Số giờ:</strong>
                    <span>{selectedEvent.hours} giờ tình nguyện</span>
                  </div>
                  <div className="detail-info-item">
                    <strong>Số người:</strong>
                    <span>
                      {selectedEvent.registered || 0}/
                      {selectedEvent.maxParticipants} người
                    </span>
                  </div>
                  <div className="detail-info-item">
                    <strong>Trạng thái:</strong>
                    <span
                      className={`status-badge ${
                        getStatusBadge(selectedEvent.status).class
                      }`}
                    >
                      {getStatusBadge(selectedEvent.status).text}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Mô tả</h3>
                <p>{selectedEvent.description}</p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={handleCloseModal}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsManager;
