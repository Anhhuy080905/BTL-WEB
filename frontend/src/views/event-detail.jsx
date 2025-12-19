import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { eventsService } from "../services/eventsService.js";
import Navigation from "../components/navigation.jsx";
import Footer from "../components/footer.jsx";
import "./event-detail.css"; // Tạo file CSS riêng nếu cần

const EventDetail = () => {
  const { slug } = useParams(); // Lấy slug từ URL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await eventsService.getEventBySlug(slug); // Gọi API mới
        setEvent(response.data);
      } catch (err) {
        setError("Không tìm thấy sự kiện");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [slug]);

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!event) return <div className="not-found">Sự kiện không tồn tại</div>;

  return (
    <div className="event-detail-container">
      <Navigation />
      <div className="event-detail-content">
        <h1 className="event-title">{event.title}</h1>
        <div className="event-meta">
          <span>Ngày: {new Date(event.date).toLocaleDateString("vi-VN")}</span>
          <span>Địa điểm: {event.location}</span>
          <span>Thể loại: {event.category}</span>
        </div>
        <img src={event.image} alt={event.title} className="event-image" />
        <div className="event-description">
          <h3>Mô tả sự kiện</h3>
          <p>{event.description}</p>
        </div>
        {/* Các thông tin khác: maxParticipants, hours, benefits, requirements... */}
        <Link to="/events" className="btn btn-primary">Quay lại danh sách sự kiện</Link>
      </div>
      <Footer />
    </div>
  );
};

export default EventDetail;