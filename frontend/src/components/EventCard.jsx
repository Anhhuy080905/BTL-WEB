import React from "react";
import { Link } from "react-router-dom";

// Danh sách ảnh placeholder đa dạng cho events
const placeholderImages = [
  "https://images.pexels.com/photos/7656732/pexels-photo-7656732.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/9037229/pexels-photo-9037229.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/6646871/pexels-photo-6646871.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  "https://images.pexels.com/photos/6647026/pexels-photo-6647026.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
];

const EventCard = ({ event, featured = false, onRSVP, index = 0 }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Chưa có thời gian";
    return timeString;
  };

  const getRemainingSpots = () => {
    const registered = event.participants?.length || 0;
    const max = event.maxParticipants || 0;
    return Math.max(0, max - registered);
  };

  const getEventImage = () => {
    if (event.images && event.images.length > 0) {
      return event.images[0];
    }
    // Sử dụng index để chọn ảnh placeholder khác nhau
    return placeholderImages[index % placeholderImages.length];
  };

  const eventDetailUrl = event.slug ? `/events/${event.slug}` : `/events/${event._id}`;

  if (featured) {
    return (
      <article
        aria-labelledby="featured-event-title"
        className="featured-event"
      >
        <Link to={eventDetailUrl} className="featured-event__link">
          <img
            alt={event.title}
            className="featured-event__image"
            loading="lazy"
          />
        </Link>
        <div className="featured-event__content">
          <time dateTime={event.date} className="featured-event__date">
            {formatDate(event.date)}
          </time>
          <h3 id="featured-event-title" className="featured-event__title">
            <Link to={eventDetailUrl}>{event.title}</Link>
          </h3>
          <div className="featured-event__meta">
            <span className="meta-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0zm.894.211v15M9 3.236v15"
                ></path>
              </svg>
              <span>{event.location}</span>
            </span>
            <span className="meta-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <path d="M12 6v6l4 2"></path>
                  <circle cx="12" cy="12" r="10"></circle>
                </g>
              </svg>
              <span>{formatTime(event.time)}</span>
            </span>
          </div>
          <p className="featured-event__description">{event.description}</p>
          <div className="featured-event__stats">
            <span className="stat">
              <span>Vị trí còn trống: </span>
              <span className="home-text16">{getRemainingSpots()}</span>
            </span>
          </div>
          <button
            aria-label={`RSVP for ${event.title}`}
            className="btn btn-primary"
            onClick={() => onRSVP(event._id)}
          >
            RSVP nhanh
          </button>
        </div>
      </article>
    );
  }

  return (
    <article
      aria-labelledby={`event-${event._id}-title`}
      className="event-card"
    >
      <div className="event-card__content">
        <h3 id={`event-${event._id}-title`} className="event-card__title">
          {event.title}
        </h3>
        <div className="event-card__meta">
          <span className="meta-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0zm.894.211v15M9 3.236v15"
              ></path>
            </svg>
            <span>{event.location}</span>
          </span>
          <span className="meta-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              >
                <path d="M12 6v6l4 2"></path>
                <circle cx="12" cy="12" r="10"></circle>
              </g>
            </svg>
            <span>{formatTime(event.time)}</span>
          </span>
        </div>
        <p className="event-card__description">
          {event.description?.substring(0, 100)}
          {event.description?.length > 100 ? "..." : ""}
        </p>
        <button
          aria-label={`RSVP for ${event.title}`}
          className="btn btn-secondary btn-sm"
          onClick={() => onRSVP(event._id)}
        >
          RSVP nhanh
        </button>
      </div>
    </article>
  );
};

export default EventCard;
