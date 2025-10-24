import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import Navigation from "../components/navigation.jsx";
import Footer from "../components/footer.jsx";
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
    fetchUser();
    loadEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, selectedCategory]);

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

    setFilteredEvents(filtered);
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setShowDetailModal(true);
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
        <Navigation />
        <div className="events-loading">
          <div className="spinner"></div>
          <p>Đang tải sự kiện...</p>
        </div>
        <Footer />
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

      <Navigation />

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
              <button
                className="modal-close"
                onClick={() => setShowDetailModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="event-info-grid">
                <div className="info-item">
                  <strong>Trạng thái:</strong>
                  <span
                    className={`status-badge ${
                      getStatusBadge(selectedEvent.status).class
                    }`}
                  >
                    {getStatusBadge(selectedEvent.status).text}
                  </span>
                </div>
                <div className="info-item">
                  <strong>Lĩnh vực:</strong>
                  <span>{getCategoryLabel(selectedEvent.category)}</span>
                </div>
                <div className="info-item">
                  <strong>Ngày:</strong>
                  <span>
                    {new Date(selectedEvent.date).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <div className="info-item">
                  <strong>Địa điểm:</strong>
                  <span>{selectedEvent.location}</span>
                </div>
                <div className="info-item">
                  <strong>Số giờ:</strong>
                  <span>{selectedEvent.hours} giờ</span>
                </div>
                <div className="info-item">
                  <strong>Đăng ký:</strong>
                  <span>
                    {selectedEvent.registered || 0}/
                    {selectedEvent.maxParticipants}
                  </span>
                </div>
              </div>

              <div className="event-description">
                <h3>Mô tả sự kiện</h3>
                <p>{selectedEvent.description}</p>
              </div>

              <div className="event-organization-info">
                <strong>Tổ chức bởi:</strong>{" "}
                {selectedEvent.organization ||
                  selectedEvent.createdBy?.username ||
                  "N/A"}
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
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

export default EventsManager;
