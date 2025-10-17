import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import Navigation from "../components/navigation.jsx";
import Footer from "../components/footer.jsx";
import { authAPI } from "../services/api";
import { eventsService } from "../services/eventsService";
import * as Yup from "yup";
import "./event-management.css";

// Validation Schema với Yup
const eventSchema = Yup.object().shape({
  title: Yup.string()
    .required("Tên sự kiện là bắt buộc")
    .min(10, "Tên sự kiện phải có ít nhất 10 ký tự")
    .max(200, "Tên sự kiện không được quá 200 ký tự"),
  date: Yup.date()
    .required("Ngày tổ chức là bắt buộc")
    .min(new Date(), "Ngày tổ chức phải là ngày trong tương lai"),
  location: Yup.string()
    .required("Địa điểm là bắt buộc")
    .min(5, "Địa điểm phải có ít nhất 5 ký tự")
    .max(200, "Địa điểm không được quá 200 ký tự"),
  description: Yup.string()
    .required("Mô tả sự kiện là bắt buộc")
    .min(50, "Mô tả phải có ít nhất 50 ký tự")
    .max(2000, "Mô tả không được quá 2000 ký tự"),
  maxParticipants: Yup.number()
    .required("Số lượng người tham gia là bắt buộc")
    .min(5, "Số lượng tối thiểu là 5 người")
    .max(1000, "Số lượng tối đa là 1000 người"),
  hours: Yup.number()
    .required("Số giờ tình nguyện là bắt buộc")
    .min(1, "Số giờ tối thiểu là 1 giờ")
    .max(100, "Số giờ tối đa là 100 giờ"),
  category: Yup.string().required("Lĩnh vực là bắt buộc"),
});

const EventManagement = () => {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    maxParticipants: "",
    hours: "",
    category: "",
    image: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [events, setEvents] = useState([]);
  const [showRegistrationsModal, setShowRegistrationsModal] = useState(false);
  const [selectedEventForReview, setSelectedEventForReview] = useState(null);
  const [registrations, setRegistrations] = useState({
    pending: [],
    approved: [],
    rejected: [],
  });
  const [registrationsStats, setRegistrationsStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    checkedIn: 0,
    completed: 0,
  });

  useEffect(() => {
    checkUserRole();
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await eventsService.getAllEvents();
      console.log("Loaded events:", eventsData);
      setEvents(eventsData);
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkUserRole = async () => {
    try {
      const response = await authAPI.getMe();
      if (response.success) {
        const userData = response.data.user;
        setUser(userData);

        // Redirect nếu không phải event_manager hoặc admin
        if (userData.role !== "event_manager" && userData.role !== "admin") {
          alert("Bạn không có quyền truy cập trang này!");
          history.push("/");
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error.response?.status === 401) {
        history.push("/login");
      }
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

  const openCreateModal = () => {
    setEditingEvent(null);
    setFormData({
      title: "",
      date: "",
      location: "",
      description: "",
      maxParticipants: "",
      hours: "",
      category: "",
    });
    setErrors({});
    setShowModal(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      location: event.location,
      description: event.description,
      maxParticipants: event.maxParticipants,
      hours: event.hours,
      category: event.category,
    });
    setErrors({});
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error khi user bắt đầu sửa
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    try {
      // Validate với Yup
      await eventSchema.validate(formData, { abortEarly: false });

      // Sử dụng eventsService API
      if (editingEvent) {
        // Update event
        await eventsService.updateEvent(editingEvent._id, {
          ...formData,
          maxParticipants: parseInt(formData.maxParticipants),
          hours: parseInt(formData.hours),
        });
        setSuccessMessage("Cập nhật sự kiện thành công!");
      } else {
        // Create new event
        await eventsService.createEvent({
          ...formData,
          maxParticipants: parseInt(formData.maxParticipants),
          hours: parseInt(formData.hours),
          requirements: [
            "Độ tuổi từ 16 trở lên",
            "Sức khỏe tốt",
            "Cam kết tham gia đầy đủ",
          ],
          benefits: [
            "Giấy chứng nhận tham gia",
            `${formData.hours} giờ tình nguyện`,
            "Kinh nghiệm thực tế",
          ],
        });
        setSuccessMessage("Tạo sự kiện mới thành công!");
      }

      // Reload events sau khi tạo/sửa
      await loadEvents();
      setShowModal(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (validationError) {
      if (validationError.inner) {
        // Yup validation errors
        const validationErrors = {};
        validationError.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      } else {
        // API errors
        const errorMessage =
          validationError.response?.data?.message ||
          "Có lỗi xảy ra. Vui lòng thử lại!";
        setErrors({ general: errorMessage });
      }
    }
  };

  const handleDelete = async (eventId) => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa sự kiện này? Hành động này không thể hoàn tác!"
      )
    ) {
      try {
        await eventsService.deleteEvent(eventId);
        setSuccessMessage("Đã xóa sự kiện thành công!");
        await loadEvents();
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Có lỗi khi xóa sự kiện";
        setErrors({ general: errorMessage });
      }
    }
  };

  const handleViewRegistrations = async (event) => {
    try {
      setSelectedEventForReview(event);
      const response = await eventsService.getEventRegistrations(
        event._id || event.id
      );
      setRegistrations(response.data);
      setRegistrationsStats(response.statistics);
      setShowRegistrationsModal(true);
    } catch (error) {
      alert(
        "Có lỗi khi tải danh sách đăng ký: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleApproveRegistration = async (userId) => {
    try {
      await eventsService.approveRegistration(
        selectedEventForReview._id || selectedEventForReview.id,
        userId
      );
      setSuccessMessage("Đã phê duyệt đăng ký thành công!");
      // Reload registrations
      await handleViewRegistrations(selectedEventForReview);
      await loadEvents();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      alert(
        "Có lỗi khi phê duyệt: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleRejectRegistration = async (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn từ chối đăng ký này?")) {
      try {
        await eventsService.rejectRegistration(
          selectedEventForReview._id || selectedEventForReview.id,
          userId
        );
        setSuccessMessage("Đã từ chối đăng ký!");
        // Reload registrations
        await handleViewRegistrations(selectedEventForReview);
        await loadEvents();
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        alert(
          "Có lỗi khi từ chối: " +
            (error.response?.data?.message || error.message)
        );
      }
    }
  };

  const handleCheckIn = async (userId) => {
    try {
      await eventsService.checkInParticipant(
        selectedEventForReview._id || selectedEventForReview.id,
        userId
      );
      setSuccessMessage("Đã check-in thành công!");
      await handleViewRegistrations(selectedEventForReview);
      await loadEvents();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      alert(
        "Có lỗi khi check-in: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleUndoCheckIn = async (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy check-in?")) {
      try {
        await eventsService.undoCheckIn(
          selectedEventForReview._id || selectedEventForReview.id,
          userId
        );
        setSuccessMessage("Đã hủy check-in!");
        await handleViewRegistrations(selectedEventForReview);
        await loadEvents();
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        alert(
          "Có lỗi khi hủy check-in: " +
            (error.response?.data?.message || error.message)
        );
      }
    }
  };

  const handleMarkCompleted = async (userId) => {
    try {
      await eventsService.markAsCompleted(
        selectedEventForReview._id || selectedEventForReview.id,
        userId
      );
      setSuccessMessage("Đã đánh dấu hoàn thành!");
      await handleViewRegistrations(selectedEventForReview);
      await loadEvents();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      alert(
        "Có lỗi khi đánh dấu hoàn thành: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleUndoCompleted = async (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy trạng thái hoàn thành?")) {
      try {
        await eventsService.undoCompleted(
          selectedEventForReview._id || selectedEventForReview.id,
          userId
        );
        setSuccessMessage("Đã hủy hoàn thành!");
        await handleViewRegistrations(selectedEventForReview);
        await loadEvents();
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        alert(
          "Có lỗi khi hủy hoàn thành: " +
            (error.response?.data?.message || error.message)
        );
      }
    }
  };

  const handleCompleteEvent = async (eventId) => {
    if (
      window.confirm(
        "Bạn có chắc muốn đánh dấu hoàn thành cho TẤT CẢ người đã check-in của sự kiện này?"
      )
    ) {
      try {
        const event = events.find((e) => e._id === eventId || e.id === eventId);

        // Lọc những người đã check-in nhưng chưa completed
        const checkedInParticipants =
          event.participants?.filter((p) => p.checkedIn && !p.completed) || [];

        if (checkedInParticipants.length === 0) {
          alert("Không có người tham gia đã check-in để đánh dấu hoàn thành!");
          return;
        }

        // Đánh dấu hoàn thành cho từng người
        for (const participant of checkedInParticipants) {
          await eventsService.markAsCompleted(
            eventId,
            participant.user?._id || participant.user
          );
        }

        setSuccessMessage(
          `Đã đánh dấu hoàn thành cho ${checkedInParticipants.length} người tham gia!`
        );
        await loadEvents();
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        alert(
          "Có lỗi khi hoàn thành sự kiện: " +
            (error.response?.data?.message || error.message)
        );
      }
    }
  };

  const handlePrintParticipants = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="event-management-container">
        <Navigation />
        <div className="event-loading">
          <div className="spinner"></div>
          <p>Đang tải...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user || (user.role !== "event_manager" && user.role !== "admin")) {
    return null;
  }

  return (
    <div className="event-management-container">
      <Helmet>
        <title>Quản Lý Sự Kiện - VolunteerHub</title>
        <meta property="og:title" content="Quản Lý Sự Kiện - VolunteerHub" />
      </Helmet>

      <Navigation />

      <div className="event-management-wrapper">
        {/* Header */}
        <div className="event-management-header">
          <div className="header-content">
            <h1 className="header-title">Quản lý sự kiện</h1>
            <p className="header-description">
              Tạo, chỉnh sửa và quản lý các sự kiện tình nguyện
            </p>
          </div>
          <button className="btn btn-primary" onClick={openCreateModal}>
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
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Tạo sự kiện mới
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}

        {/* Events List */}
        <div className="events-grid">
          {console.log("Events array:", events, "Length:", events.length)}
          {events.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <h3>Chưa có sự kiện nào</h3>
              <p>Bắt đầu tạo sự kiện tình nguyện đầu tiên của bạn!</p>
              <button className="btn btn-primary" onClick={openCreateModal}>
                Tạo sự kiện ngay
              </button>
            </div>
          ) : (
            events.map((event) => {
              console.log("Rendering event:", event.title);
              return (
                <div key={event._id || event.id} className="event-card">
                  <div className="event-image">
                    <img src={event.image} alt={event.title} />
                    <span className="event-category-badge">
                      {getCategoryName(event.category)}
                    </span>
                  </div>
                  <div className="event-content">
                    <h3 className="event-title">{event.title}</h3>

                    <div className="event-info-grid">
                      <div className="info-item">
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
                      <div className="info-item">
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
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span>{event.location}</span>
                      </div>
                      <div className="info-item">
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
                        <span>
                          {event.registered}/{event.maxParticipants} người
                        </span>
                      </div>
                      <div className="info-item">
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
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>{event.hours} giờ</span>
                      </div>
                    </div>

                    <p className="event-description">{event.description}</p>

                    <div className="event-actions">
                      <button
                        className="btn btn-info"
                        onClick={() => handleViewRegistrations(event)}
                        title="Xem danh sách đăng ký"
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
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        Quản lý đăng ký
                        {event.participants?.filter(
                          (p) => p.status === "pending"
                        ).length > 0 && (
                          <span className="badge-notification">
                            {
                              event.participants.filter(
                                (p) => p.status === "pending"
                              ).length
                            }
                          </span>
                        )}
                      </button>
                      <button
                        className="btn btn-outline"
                        onClick={() => openEditModal(event)}
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
                        Sửa
                      </button>
                      {new Date(event.date) < new Date() && (
                        <button
                          className="btn btn-success"
                          onClick={() =>
                            handleCompleteEvent(event._id || event.id)
                          }
                          title="Đánh dấu hoàn thành cho tất cả người tham gia"
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
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Hoàn thành
                        </button>
                      )}
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(event._id || event.id)}
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
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal Create/Edit Event */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingEvent ? "Chỉnh sửa sự kiện" : "Tạo sự kiện mới"}</h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Tên sự kiện <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className={`form-input ${errors.title ? "error" : ""}`}
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="VD: Chiến dịch trồng cây xanh tại Hà Nội"
                />
                {errors.title && (
                  <span className="error-text">{errors.title}</span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date" className="form-label">
                    Ngày tổ chức <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    className={`form-input ${errors.date ? "error" : ""}`}
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                  {errors.date && (
                    <span className="error-text">{errors.date}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="category" className="form-label">
                    Lĩnh vực <span className="required">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    className={`form-input ${errors.category ? "error" : ""}`}
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="">-- Chọn lĩnh vực --</option>
                    <option value="environment">🌱 Môi trường</option>
                    <option value="education">📚 Giáo dục</option>
                    <option value="youth">❤️ Y tế</option>
                    <option value="elderly">👴 Người cao tuổi</option>
                    <option value="disabled">♿ Người khuyết tật</option>
                    <option value="healthcare">👶 Trẻ em</option>
                  </select>
                  {errors.category && (
                    <span className="error-text">{errors.category}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="location" className="form-label">
                  Địa điểm <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className={`form-input ${errors.location ? "error" : ""}`}
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="VD: Công viên Thống Nhất, Hà Nội"
                />
                {errors.location && (
                  <span className="error-text">{errors.location}</span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="maxParticipants" className="form-label">
                    Số lượng người tham gia <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="maxParticipants"
                    name="maxParticipants"
                    className={`form-input ${
                      errors.maxParticipants ? "error" : ""
                    }`}
                    value={formData.maxParticipants}
                    onChange={handleInputChange}
                    placeholder="VD: 100"
                    min="5"
                    max="1000"
                  />
                  {errors.maxParticipants && (
                    <span className="error-text">{errors.maxParticipants}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="hours" className="form-label">
                    Số giờ tình nguyện <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="hours"
                    name="hours"
                    className={`form-input ${errors.hours ? "error" : ""}`}
                    value={formData.hours}
                    onChange={handleInputChange}
                    placeholder="VD: 4"
                    min="1"
                    max="100"
                  />
                  {errors.hours && (
                    <span className="error-text">{errors.hours}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Mô tả sự kiện <span className="required">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  className={`form-textarea ${
                    errors.description ? "error" : ""
                  }`}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Mô tả chi tiết về sự kiện, mục đích, yêu cầu đối với tình nguyện viên..."
                  rows="5"
                />
                {errors.description && (
                  <span className="error-text">{errors.description}</span>
                )}
                <small className="form-hint">
                  {formData.description.length}/2000 ký tự (tối thiểu 50 ký tự)
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="image" className="form-label">
                  Ảnh sự kiện
                </label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  className={`form-input ${errors.image ? "error" : ""}`}
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="VD: https://example.com/image.jpg"
                />
                {errors.image && (
                  <span className="error-text">{errors.image}</span>
                )}
                <small className="form-hint">
                  Link ảnh minh họa cho sự kiện (có thể để trống, sẽ dùng ảnh
                  mặc định)
                </small>
              </div>

              {errors.general && (
                <div className="alert alert-error">{errors.general}</div>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingEvent ? "Cập nhật" : "Tạo sự kiện"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Quản lý đăng ký */}
      {showRegistrationsModal && selectedEventForReview && (
        <div
          className="modal-overlay"
          onClick={() => setShowRegistrationsModal(false)}
        >
          <div
            className="modal-content modal-large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Quản lý đăng ký - {selectedEventForReview.title}</h2>
              <button
                className="modal-close"
                onClick={() => setShowRegistrationsModal(false)}
              >
                ×
              </button>
            </div>

            <div className="registrations-stats">
              <div className="stat-card">
                <div className="stat-number">{registrationsStats.total}</div>
                <div className="stat-label">Tổng đăng ký</div>
              </div>
              <div className="stat-card stat-pending">
                <div className="stat-number">{registrationsStats.pending}</div>
                <div className="stat-label">Chờ duyệt</div>
              </div>
              <div className="stat-card stat-approved">
                <div className="stat-number">{registrationsStats.approved}</div>
                <div className="stat-label">Đã duyệt</div>
              </div>
              <div className="stat-card stat-rejected">
                <div className="stat-number">{registrationsStats.rejected}</div>
                <div className="stat-label">Đã từ chối</div>
              </div>
              <div className="stat-card stat-checkedin">
                <div className="stat-number">
                  {registrationsStats.checkedIn}
                </div>
                <div className="stat-label">Đã check-in</div>
              </div>
              <div className="stat-card stat-completed">
                <div className="stat-number">
                  {registrationsStats.completed}
                </div>
                <div className="stat-label">Đã hoàn thành</div>
              </div>
            </div>

            <div className="registration-actions-header">
              <button
                className="btn btn-primary"
                onClick={handlePrintParticipants}
              >
                🖨️ In danh sách
              </button>
            </div>

            <div className="registrations-tabs">
              <div className="tab-content">
                {/* Danh sách chờ duyệt */}
                {registrations.pending.length > 0 && (
                  <div className="registration-section">
                    <h3 className="section-title">
                      ⏳ Chờ phê duyệt ({registrations.pending.length})
                    </h3>
                    <div className="registrations-list">
                      {registrations.pending.map((reg) => (
                        <div
                          key={reg._id}
                          className="registration-item pending"
                        >
                          <div className="registration-info">
                            <div className="user-avatar">
                              {reg.user?.username?.charAt(0).toUpperCase() ||
                                "U"}
                            </div>
                            <div className="user-details">
                              <div className="user-name">
                                {reg.user?.username || "N/A"}
                              </div>
                              <div className="user-email">
                                {reg.user?.email || "N/A"}
                              </div>
                              <div className="registration-date">
                                Đăng ký:{" "}
                                {new Date(reg.registeredAt).toLocaleString(
                                  "vi-VN"
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="registration-actions">
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() =>
                                handleApproveRegistration(reg.user._id)
                              }
                            >
                              ✓ Phê duyệt
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() =>
                                handleRejectRegistration(reg.user._id)
                              }
                            >
                              ✕ Từ chối
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Danh sách đã duyệt */}
                {registrations.approved.length > 0 && (
                  <div className="registration-section">
                    <h3 className="section-title">
                      ✓ Đã phê duyệt ({registrations.approved.length})
                    </h3>
                    <div className="registrations-list">
                      {registrations.approved.map((reg) => (
                        <div
                          key={reg._id}
                          className="registration-item approved"
                        >
                          <div className="registration-info">
                            <div className="user-avatar">
                              {reg.user?.username?.charAt(0).toUpperCase() ||
                                "U"}
                            </div>
                            <div className="user-details">
                              <div className="user-name">
                                {reg.user?.username || "N/A"}
                              </div>
                              <div className="user-email">
                                {reg.user?.email || "N/A"}
                              </div>
                              <div className="registration-date">
                                Phê duyệt:{" "}
                                {reg.reviewedAt
                                  ? new Date(reg.reviewedAt).toLocaleString(
                                      "vi-VN"
                                    )
                                  : "N/A"}
                              </div>
                              {reg.checkedIn && (
                                <div className="registration-date">
                                  ✓ Check-in:{" "}
                                  {reg.checkInTime
                                    ? new Date(reg.checkInTime).toLocaleString(
                                        "vi-VN"
                                      )
                                    : "N/A"}
                                </div>
                              )}
                              {reg.completed && (
                                <div className="registration-date">
                                  ★ Hoàn thành:{" "}
                                  {reg.completedAt
                                    ? new Date(reg.completedAt).toLocaleString(
                                        "vi-VN"
                                      )
                                    : "N/A"}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="registration-actions">
                            {!reg.checkedIn && (
                              <button
                                className="btn btn-info btn-sm"
                                onClick={() => handleCheckIn(reg.user._id)}
                              >
                                ✓ Check-in
                              </button>
                            )}
                            {reg.checkedIn && !reg.completed && (
                              <>
                                <button
                                  className="btn btn-warning btn-sm"
                                  onClick={() =>
                                    handleUndoCheckIn(reg.user._id)
                                  }
                                >
                                  ↶ Hủy check-in
                                </button>
                                <button
                                  className="btn btn-success btn-sm"
                                  onClick={() =>
                                    handleMarkCompleted(reg.user._id)
                                  }
                                >
                                  ★ Hoàn thành
                                </button>
                              </>
                            )}
                            {reg.completed && (
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() =>
                                  handleUndoCompleted(reg.user._id)
                                }
                              >
                                ↶ Hủy hoàn thành
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Danh sách đã từ chối */}
                {registrations.rejected.length > 0 && (
                  <div className="registration-section">
                    <h3 className="section-title">
                      ✕ Đã từ chối ({registrations.rejected.length})
                    </h3>
                    <div className="registrations-list">
                      {registrations.rejected.map((reg) => (
                        <div
                          key={reg._id}
                          className="registration-item rejected"
                        >
                          <div className="registration-info">
                            <div className="user-avatar">
                              {reg.user?.username?.charAt(0).toUpperCase() ||
                                "U"}
                            </div>
                            <div className="user-details">
                              <div className="user-name">
                                {reg.user?.username || "N/A"}
                              </div>
                              <div className="user-email">
                                {reg.user?.email || "N/A"}
                              </div>
                              <div className="registration-date">
                                Từ chối:{" "}
                                {reg.reviewedAt
                                  ? new Date(reg.reviewedAt).toLocaleString(
                                      "vi-VN"
                                    )
                                  : "N/A"}
                              </div>
                            </div>
                          </div>
                          <div className="status-badge status-rejected">
                            Đã từ chối
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {registrations.pending.length === 0 &&
                  registrations.approved.length === 0 &&
                  registrations.rejected.length === 0 && (
                    <div className="empty-state">
                      <p>Chưa có đăng ký nào cho sự kiện này</p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default EventManagement;
