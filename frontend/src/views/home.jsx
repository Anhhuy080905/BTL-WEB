import React, { useState, useEffect } from "react";

import Script from "dangerous-html/react";
import { Helmet } from "react-helmet";

import Navigation from "../components/navigation.jsx";
import Footer from "../components/footer.jsx";
import { authAPI } from "../services/api";
import "./home.css";

const Home = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const authenticated = authAPI.isAuthenticated();
      setIsLoggedIn(authenticated);

      if (authenticated) {
        const userData = authAPI.getUserData();
        setUserRole(userData?.role);
        setUserName(userData?.username || userData?.email);
      }
    };

    checkAuth();

    // Listen for storage changes (login/logout in another tab)
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const getRoleName = (role) => {
    const roleNames = {
      volunteer: "Tình nguyện viên",
      event_manager: "Quản lý sự kiện",
      admin: "Admin",
    };
    return roleNames[role] || role;
  };

  return (
    <div className="home-container1">
      <Helmet>
        <title>VolunteerHub</title>
        <meta property="og:title" content="Mixed Attached Deer" />
      </Helmet>
      <Navigation></Navigation>
      <div className="home-container2">
        <div className="home-container3">
          <Script
            html={`<style>
        @keyframes slideUp {from {opacity: 0;
transform: translateY(8px);}
to {opacity: 1;
transform: translateY(0);}}@keyframes revealCard {from {opacity: 0;
transform: translateY(8px);}
to {opacity: 1;
transform: translateY(0);}}@keyframes revealStep {from {opacity: 0;
transform: translateY(8px);}
to {opacity: 1;
transform: translateY(0);}}
        </style> `}
          ></Script>
        </div>
      </div>
      <div className="home-container4">
        <div className="home-container5">
          <Script
            html={`<style>
@media (prefers-reduced-motion: reduce) {
*, *::before, *::after {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
}
}
</style>`}
          ></Script>
        </div>
      </div>
      <div className="home-container6">
        <div className="home-container7">
          <Script
            html={`<script defer data-name="homepage-interactions">
(function(){
  // Carousel functionality
  const carouselTrack = document.getElementById("carousel-track")
  const prevBtn = document.getElementById("carousel-prev")
  const nextBtn = document.getElementById("carousel-next")
  
  if (carouselTrack && prevBtn && nextBtn) {
    const carouselCards = carouselTrack.querySelectorAll(".carousel-card")
    let currentIndex = 0

    function updateCarousel() {
      carouselCards.forEach((card, index) => {
        if (index === currentIndex) {
          card.classList.add("carousel-card--active")
        } else {
          card.classList.remove("carousel-card--active")
        }
      })
    }

    prevBtn.addEventListener("click", () => {
      currentIndex =
        (currentIndex - 1 + carouselCards.length) % carouselCards.length
      updateCarousel()
    })

    nextBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % carouselCards.length
      updateCarousel()
    })

    // Auto-rotate carousel
    setInterval(() => {
      currentIndex = (currentIndex + 1) % carouselCards.length
      updateCarousel()
    }, 5000)
  }

  // Role selection functionality
  const roleTiles = document.querySelectorAll(".role-tile")
  let selectedRole = null

  roleTiles.forEach((tile) => {
    tile.addEventListener("click", () => {
      roleTiles.forEach((t) => t.setAttribute("aria-pressed", "false"))
      tile.setAttribute("aria-pressed", "true")
      selectedRole = tile.id
    })
  })

  // Start button handler
  const startBtn = document.getElementById("start-btn")
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      if (selectedRole) {
        console.log("Starting with role:", selectedRole)
      } else {
        alert("Vui lòng chọn vai trò của bạn trước khi bắt đầu.")
      }
    })
  }

  // Login link handler
  const loginLink = document.getElementById("login-link")
  if (loginLink) {
    loginLink.addEventListener("click", () => {
      console.log("Redirecting to login page")
    })
  }

  // Hero CTA handlers (these don't exist anymore, so skip them)
  const heroLoginBtn = document.getElementById("hero-login-btn")
  const heroRegisterBtn = document.getElementById("hero-register-btn")

  if (heroLoginBtn) {
    heroLoginBtn.addEventListener("click", () => {
      console.log("Hero login clicked")
    })
  }

  if (heroRegisterBtn) {
    heroRegisterBtn.addEventListener("click", () => {
      console.log("Hero register clicked")
    })
  }
})()
</script>`}
          ></Script>
        </div>
      </div>
      <section id="hero-section" role="banner" className="hero">
        <div className="hero__container">
          <div className="hero__content">
            <h1 className="hero-title">
              {" "}
              VolunteerHub — Kết nối chuyên nghiệp cho hành động cộng đồng
              <span
                dangerouslySetInnerHTML={{
                  __html: " ",
                }}
              />
            </h1>
            <p className="hero-subtitle">
              {" "}
              Xây dựng và quản lý chương trình tình nguyện một cách minh bạch,
              hiệu quả và có thể đo lường. Tham gia để doanh nghiệp và cá nhân
              cùng tạo tác động xã hội rõ ràng: trồng cây, dọn rác, từ thiện và
              giáo dục cộng đồng.
              <span
                dangerouslySetInnerHTML={{
                  __html: " ",
                }}
              />
            </p>
            {/* Search Bar */}
            <div className="hero-search-container">
              <input
                type="text"
                placeholder="Tìm kiếm hoạt động tình nguyện..."
                className="hero-search-input"
                aria-label="Tìm kiếm hoạt động tình nguyện"
              />
              <button className="hero-search-button" aria-label="Tìm kiếm">
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
              </button>
            </div>
            {/* Action Buttons */}
            <nav aria-label="Main actions" className="hero__ctas">
              <button
                aria-label="Khám phá các hoạt động tình nguyện"
                className="cta-primary btn btn-primary btn-lg"
              >
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
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                Khám phá hoạt động
              </button>
              <button
                aria-label="Tìm hiểu cách thức hoạt động"
                className="cta-secondary btn btn-lg btn-outline"
              >
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
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                Cách thức hoạt động
              </button>
            </nav>
          </div>
          <aside aria-labelledby="events-heading" className="events">
            <h2 id="events-heading" className="events__title">
              Sự kiện sắp tới
            </h2>
            <p className="events__intro">
              {" "}
              Lọc nhanh, tham gia chỉ trong vài bước — dành cho nhà tài trợ,
              quản lý dự án và tình nguyện viên chuyên nghiệp.
              <span
                dangerouslySetInnerHTML={{
                  __html: " ",
                }}
              />
            </p>
            <ul role="list" className="events__list">
              <li role="listitem" className="home-event1 event">
                <time dateTime="2025-11-29" className="event__date">
                  29/11/2025
                </time>
                <span className="event__name">Trồng cây ven sông Hồng</span>
              </li>
              <li role="listitem" className="home-event2 event">
                <time dateTime="2025-12-06" className="event__date">
                  06/12/2025
                </time>
                <span className="event__name">Dọn dẹp bãi biển Cửa Lò</span>
              </li>
              <li role="listitem" className="home-event3 event">
                <time dateTime="2025-12-12" className="event__date">
                  12/12/2025
                </time>
                <span className="event__name">Chương trình học chữ</span>
              </li>
            </ul>
          </aside>
        </div>
        {/* Statistics Section */}
        <div className="hero-statistics">
          <div className="hero-stat-item">
            <h3 className="hero-stat-number">1,250+</h3>
            <p className="hero-stat-label">Tình nguyện viên</p>
          </div>
          <div className="hero-stat-item">
            <h3 className="hero-stat-number">340+</h3>
            <p className="hero-stat-label">Dự án đã hoàn thành</p>
          </div>
          <div className="hero-stat-item">
            <h3 className="hero-stat-number">50+</h3>
            <p className="hero-stat-label">Đối tác doanh nghiệp</p>
          </div>
          <div className="hero-stat-item">
            <h3 className="hero-stat-number">15,000+</h3>
            <p className="hero-stat-label">Giờ tình nguyện</p>
          </div>
        </div>
      </section>
      <section id="get-started-section" className="get-started">
        <div className="get-started__container">
          <div className="get-started__panel">
            <div className="get-started__editorial">
              <h2 className="get-started__heading">
                {" "}
                Tham gia ngay — bước đầu đáng tin để tạo tác động xã hội
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </h2>
              <p className="get-started__lead">
                {" "}
                Đăng nhập hoặc đăng ký vai trò phù hợp để bắt đầu: Tình nguyện
                viên, Quản lý sự kiện, Admin. Giao diện chuyên nghiệp, quy trình
                onboarding rõ ràng giúp bạn tham gia nhanh chóng và an tâm về
                trách nhiệm.
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </p>
              <div className="get-started__benefits">
                <h3 className="get-started__benefits-title">
                  Lợi ích nhanh chóng:
                </h3>
                <ul className="benefits-list">
                  <li className="benefits-list__item">
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
                        d="M20 6L9 17l-5-5"
                      ></path>
                    </svg>
                    <span>
                      <span className="home-text41">Tình nguyện viên:</span>
                      <span>
                        {" "}
                        Tìm và đăng ký sự kiện phù hợp, theo dõi giờ công và
                        chứng nhận đóng góp.
                        <span
                          dangerouslySetInnerHTML={{
                            __html: " ",
                          }}
                        />
                      </span>
                    </span>
                  </li>
                  <li className="benefits-list__item">
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
                        d="M20 6L9 17l-5-5"
                      ></path>
                    </svg>
                    <span>
                      <span className="home-text44">Quản lý sự kiện:</span>
                      <span>
                        {" "}
                        Tạo chương trình, quản lý danh sách, báo cáo kết quả và
                        minh bạch ngân sách hoạt động.
                        <span
                          dangerouslySetInnerHTML={{
                            __html: " ",
                          }}
                        />
                      </span>
                    </span>
                  </li>
                  <li className="benefits-list__item">
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
                        d="M20 6L9 17l-5-5"
                      ></path>
                    </svg>
                    <span>
                      <span className="home-text47">Admin:</span>
                      <span>
                        {" "}
                        Giám sát toàn hệ thống, phân quyền và đảm bảo tuân thủ
                        quy trình vận hành.
                        <span
                          dangerouslySetInnerHTML={{
                            __html: " ",
                          }}
                        />
                      </span>
                    </span>
                  </li>
                </ul>
              </div>
              <div className="get-started__tips">
                <h3 className="get-started__tips-title">
                  Mẹo onboarding nhanh:
                </h3>
                <ol className="tips-list">
                  <li className="tips-list__item">
                    <span>
                      {" "}
                      Hoàn thiện hồ sơ cá nhân và xác thực danh tính để tăng độ
                      tin cậy.
                      <span
                        dangerouslySetInnerHTML={{
                          __html: " ",
                        }}
                      />
                    </span>
                  </li>
                  <li className="tips-list__item">
                    <span>
                      {" "}
                      Chọn vai trò và hoàn tất huấn luyện ngắn (5–10 phút) để
                      nhận quyền truy cập chức năng chuyên môn.
                      <span
                        dangerouslySetInnerHTML={{
                          __html: " ",
                        }}
                      />
                    </span>
                  </li>
                  <li className="tips-list__item">
                    <span>
                      {" "}
                      Kết nối tài khoản tổ chức hoặc thẻ thanh toán để quản lý
                      quyên góp an toàn và minh bạch.
                      <span
                        dangerouslySetInnerHTML={{
                          __html: " ",
                        }}
                      />
                    </span>
                  </li>
                </ol>
              </div>
            </div>
            <aside className="get-started__role-selection">
              {isLoggedIn ? (
                <>
                  <h3 className="role-selection__title">Vai trò của bạn</h3>
                  <p className="role-selection__subtitle">
                    Tài khoản đã được xác thực và sẵn sàng.
                  </p>
                  <div className="current-role-display">
                    <div className="current-role-card">
                      {userRole === "volunteer" && (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676a.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"
                            ></path>
                          </svg>
                          <span className="current-role-text">
                            Tình nguyện viên
                          </span>
                        </>
                      )}
                      {userRole === "event_manager" && (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
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
                              <rect
                                width="8"
                                height="4"
                                x="8"
                                y="2"
                                rx="1"
                                ry="1"
                              ></rect>
                              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                            </g>
                          </svg>
                          <span className="current-role-text">
                            Quản lý sự kiện
                          </span>
                        </>
                      )}
                      {userRole === "admin" && (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
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
                              <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0a2.34 2.34 0 0 0 3.319 1.915a2.34 2.34 0 0 1 2.33 4.033a2.34 2.34 0 0 0 0 3.831a2.34 2.34 0 0 1-2.33 4.033a2.34 2.34 0 0 0-3.319 1.915a2.34 2.34 0 0 1-4.659 0a2.34 2.34 0 0 0-3.32-1.915a2.34 2.34 0 0 1-2.33-4.033a2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </g>
                          </svg>
                          <span className="current-role-text">Admin</span>
                        </>
                      )}
                      <div className="current-role-badge">✓ Đã xác thực</div>
                    </div>
                    <p className="current-role-welcome">
                      Xin chào, <strong>{userName}</strong>!<br />
                      Bạn đã sẵn sàng để bắt đầu.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="role-selection__title">
                    Chọn vai trò của bạn
                  </h3>
                  <p className="role-selection__subtitle">
                    {" "}
                    Bắt đầu ngay — an toàn, minh bạch, chuyên nghiệp.
                    <span
                      dangerouslySetInnerHTML={{
                        __html: " ",
                      }}
                    />
                  </p>
                  <div
                    role="group"
                    aria-label="Select your role"
                    className="role-tiles"
                  >
                    <button
                      id="role-volunteer"
                      type="button"
                      aria-label="Select Volunteer role"
                      aria-pressed="false"
                      className="role-tile"
                    >
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
                          d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676a.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"
                        ></path>
                      </svg>
                      <span className="role-tile__text">Tình nguyện viên</span>
                    </button>
                    <button
                      id="role-manager"
                      type="button"
                      aria-label="Select Event Manager role"
                      aria-pressed="false"
                      className="role-tile"
                    >
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
                          <rect
                            width="8"
                            height="4"
                            x="8"
                            y="2"
                            rx="1"
                            ry="1"
                          ></rect>
                          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                        </g>
                      </svg>
                      <span className="role-tile__text">Quản lý sự kiện</span>
                    </button>
                    <button
                      id="role-admin"
                      type="button"
                      aria-label="Select Admin role"
                      aria-pressed="false"
                      className="role-tile"
                    >
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
                          <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0a2.34 2.34 0 0 0 3.319 1.915a2.34 2.34 0 0 1 2.33 4.033a2.34 2.34 0 0 0 0 3.831a2.34 2.34 0 0 1-2.33 4.033a2.34 2.34 0 0 0-3.319 1.915a2.34 2.34 0 0 1-4.659 0a2.34 2.34 0 0 0-3.32-1.915a2.34 2.34 0 0 1-2.33-4.033a2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </g>
                      </svg>
                      <span className="role-tile__text">Admin</span>
                    </button>
                  </div>
                  <div className="role-selection__actions">
                    <button
                      id="start-btn"
                      type="button"
                      aria-label="Start volunteering journey"
                      className="btn btn-primary btn-lg"
                    >
                      {" "}
                      Bắt đầu ngay
                      <span
                        dangerouslySetInnerHTML={{
                          __html: " ",
                        }}
                      />
                    </button>
                    <button
                      id="login-link"
                      type="button"
                      aria-label="Log in to existing account"
                      className="btn btn-link"
                    >
                      {" "}
                      Đã có tài khoản? Đăng nhập
                      <span
                        dangerouslySetInnerHTML={{
                          __html: " ",
                        }}
                      />
                    </button>
                  </div>
                </>
              )}
            </aside>
          </div>
        </div>
      </section>
      <section id="upcoming-events-section" className="upcoming-events">
        <div className="upcoming-events__container">
          <header className="upcoming-events__header">
            <h2 className="section-title">Sự kiện sắp tới</h2>
            <p className="section-subtitle">
              {" "}
              Tham gia những hoạt động có tác động cụ thể — xem nhanh, đăng ký
              tức thì, hoặc lọc theo địa điểm và thời gian.
              <span
                dangerouslySetInnerHTML={{
                  __html: " ",
                }}
              />
            </p>
          </header>
          <div className="upcoming-events__content">
            <div className="upcoming-events__left">
              <form
                role="search"
                aria-label="Search upcoming events"
                className="search-toolbar"
              >
                <div className="search-toolbar__input-group">
                  <label htmlFor="event-search" className="visually-hidden">
                    {" "}
                    Tìm sự kiện
                    <span
                      dangerouslySetInnerHTML={{
                        __html: " ",
                      }}
                    />
                  </label>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="search-icon"
                  >
                    <g
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    >
                      <path d="m21 21l-4.34-4.34"></path>
                      <circle cx="11" cy="11" r="8"></circle>
                    </g>
                  </svg>
                  <input
                    type="search"
                    id="event-search"
                    placeholder="Tìm sự kiện"
                    className="search-toolbar__input"
                  />
                </div>
                <div className="search-toolbar__filters">
                  <button
                    type="button"
                    aria-label="Filter by city"
                    className="filter-btn"
                  >
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
                        d="M2 5h20M6 12h12m-9 7h6"
                      ></path>
                    </svg>
                    <span>
                      {" "}
                      Thành phố
                      <span
                        dangerouslySetInnerHTML={{
                          __html: " ",
                        }}
                      />
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label="Filter by date"
                    className="filter-btn"
                  >
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
                        <path d="M8 2v4m8-4v4"></path>
                        <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                        <path d="M3 10h18"></path>
                      </g>
                    </svg>
                    <span>
                      {" "}
                      Ngày
                      <span
                        dangerouslySetInnerHTML={{
                          __html: " ",
                        }}
                      />
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label="Filter by activity type"
                    className="filter-btn"
                  >
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
                        <path d="M8 5h13m-8 7h8m-8 7h8M3 10a2 2 0 0 0 2 2h3"></path>
                        <path d="M3 5v12a2 2 0 0 0 2 2h3"></path>
                      </g>
                    </svg>
                    <span>
                      {" "}
                      Loại hoạt động
                      <span
                        dangerouslySetInnerHTML={{
                          __html: " ",
                        }}
                      />
                    </span>
                  </button>
                </div>
              </form>
              <article
                aria-labelledby="featured-event-title"
                className="featured-event"
              >
                <img
                  src="https://images.pexels.com/photos/7656732/pexels-photo-7656732.jpeg?auto=compress&amp;cs=tinysrgb&amp;h=650&amp;w=940"
                  alt="Two volunteers planting trees by a lakeside"
                  loading="lazy"
                  className="featured-event__image"
                />
                <div className="featured-event__content">
                  <time dateTime="2025-11-29" className="featured-event__date">
                    {" "}
                    29/11/2025
                    <span
                      dangerouslySetInnerHTML={{
                        __html: " ",
                      }}
                    />
                  </time>
                  <h3
                    id="featured-event-title"
                    className="featured-event__title"
                  >
                    {" "}
                    Trồng cây ven sông Hồng
                    <span
                      dangerouslySetInnerHTML={{
                        __html: " ",
                      }}
                    />
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
                      <span>
                        {" "}
                        Long Biên, Hà Nội
                        <span
                          dangerouslySetInnerHTML={{
                            __html: " ",
                          }}
                        />
                      </span>
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
                      <span>
                        {" "}
                        08:00–12:00
                        <span
                          dangerouslySetInnerHTML={{
                            __html: " ",
                          }}
                        />
                      </span>
                    </span>
                  </div>
                  <p className="featured-event__description">
                    {" "}
                    Mục tiêu: trồng 1.000 cây xanh, cải thiện hành lang sinh
                    thái dọc bờ sông. Nhóm quản lý: GreenBridge. Yêu cầu: mang
                    găng tay, giày bệt.
                    <span
                      dangerouslySetInnerHTML={{
                        __html: " ",
                      }}
                    />
                  </p>
                  <div className="featured-event__stats">
                    <span className="stat">
                      <span>
                        {" "}
                        Vị trí còn trống:
                        <span
                          dangerouslySetInnerHTML={{
                            __html: " ",
                          }}
                        />
                      </span>
                      <span className="home-text16">24</span>
                    </span>
                  </div>
                  <button
                    aria-label="RSVP for tree planting event on November 29"
                    className="btn btn-primary"
                  >
                    {" "}
                    RSVP nhanh
                    <span
                      dangerouslySetInnerHTML={{
                        __html: " ",
                      }}
                    />
                  </button>
                </div>
              </article>
            </div>
            <div className="upcoming-events__right">
              <article aria-labelledby="event-1-title" className="event-card">
                <div className="event-card__image-wrapper">
                  <img
                    src="https://images.pexels.com/photos/9037229/pexels-photo-9037229.jpeg?auto=compress&amp;cs=tinysrgb&amp;h=650&amp;w=940"
                    alt="Beach cleanup volunteer activity"
                    loading="lazy"
                    className="event-card__image"
                  />
                </div>
                <div className="event-card__content">
                  <time dateTime="2025-12-06" className="event-card__date">
                    {" "}
                    06/12/2025
                    <span
                      dangerouslySetInnerHTML={{
                        __html: " ",
                      }}
                    />
                  </time>
                  <h3 id="event-1-title" className="event-card__title">
                    {" "}
                    Dọn dẹp bãi biển Cửa Lò
                    <span
                      dangerouslySetInnerHTML={{
                        __html: " ",
                      }}
                    />
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
                      <span>
                        {" "}
                        Cửa Lò, Nghệ An
                        <span
                          dangerouslySetInnerHTML={{
                            __html: " ",
                          }}
                        />
                      </span>
                    </span>
                    <span className="meta-item">07:30–11:30</span>
                  </div>
                  <p className="event-card__description">
                    {" "}
                    Thu gom rác nhựa, phân loại tái chế. Vị trí còn: 40
                    <span
                      dangerouslySetInnerHTML={{
                        __html: " ",
                      }}
                    />
                  </p>
                  <button
                    aria-label="RSVP for beach cleanup on December 6"
                    className="btn btn-secondary btn-sm"
                  >
                    {" "}
                    RSVP nhanh
                    <span
                      dangerouslySetInnerHTML={{
                        __html: " ",
                      }}
                    />
                  </button>
                </div>
              </article>
              <article aria-labelledby="event-2-title" className="event-card">
                <div className="event-card__image-wrapper">
                  <img
                    src="https://images.pexels.com/photos/7265143/pexels-photo-7265143.jpeg?auto=compress&amp;cs=tinysrgb&amp;h=650&amp;w=940"
                    alt="Literacy education program"
                    loading="lazy"
                    className="event-card__image"
                  />
                </div>
                <div className="event-card__content">
                  <time dateTime="2025-12-12" className="event-card__date">
                    {" "}
                    12/12/2025
                    <span
                      dangerouslySetInnerHTML={{
                        __html: " ",
                      }}
                    />
                  </time>
                  <h3 id="event-2-title" className="event-card__title">
                    {" "}
                    Chương trình học chữ cho người lớn
                    <span
                      dangerouslySetInnerHTML={{
                        __html: " ",
                      }}
                    />
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
                      <span>
                        {" "}
                        Thanh Xuân, Hà Nội
                        <span
                          dangerouslySetInnerHTML={{
                            __html: " ",
                          }}
                        />
                      </span>
                    </span>
                    <span className="meta-item">18:00–20:00</span>
                  </div>
                  <p className="event-card__description">
                    {" "}
                    Nâng trình độ đọc-viết. Vị trí còn: 12
                    <span
                      dangerouslySetInnerHTML={{
                        __html: " ",
                      }}
                    />
                  </p>
                  <button
                    aria-label="RSVP for literacy program on December 12"
                    className="btn btn-secondary btn-sm"
                  >
                    {" "}
                    RSVP nhanh
                    <span
                      dangerouslySetInnerHTML={{
                        __html: " ",
                      }}
                    />
                  </button>
                </div>
              </article>
              <article aria-labelledby="event-3-title" className="event-card">
                <div className="event-card__image-wrapper">
                  <img
                    src="https://images.pexels.com/photos/6995221/pexels-photo-6995221.jpeg?auto=compress&amp;cs=tinysrgb&amp;h=650&amp;w=940"
                    alt="Charity food distribution"
                    loading="lazy"
                    className="event-card__image"
                  />
                </div>
                <div className="event-card__content">
                  <time dateTime="2025-12-15" className="event-card__date">
                    {" "}
                    15/12/2025
                    <span
                      dangerouslySetInnerHTML={{
                        __html: " ",
                      }}
                    />
                  </time>
                  <h3 id="event-3-title" className="event-card__title">
                    {" "}
                    Phân phát nhu yếu phẩm cộng đồng
                    <span
                      dangerouslySetInnerHTML={{
                        __html: " ",
                      }}
                    />
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
                      <span>
                        {" "}
                        Hoàn Kiếm, Hà Nội
                        <span
                          dangerouslySetInnerHTML={{
                            __html: " ",
                          }}
                        />
                      </span>
                    </span>
                    <span className="meta-item">14:00–17:00</span>
                  </div>
                  <p className="event-card__description">
                    {" "}
                    Hỗ trợ gói cứu trợ. Vị trí còn: 18
                    <span
                      dangerouslySetInnerHTML={{
                        __html: " ",
                      }}
                    />
                  </p>
                  <button
                    aria-label="RSVP for charity distribution on December 15"
                    className="btn btn-secondary btn-sm"
                  >
                    {" "}
                    RSVP nhanh
                    <span
                      dangerouslySetInnerHTML={{
                        __html: " ",
                      }}
                    />
                  </button>
                </div>
              </article>
              <article aria-labelledby="event-4-title" className="event-card">
                <div className="event-card__image-wrapper">
                  <img
                    src="https://images.pexels.com/photos/7656729/pexels-photo-7656729.jpeg?auto=compress&amp;cs=tinysrgb&amp;h=650&amp;w=940"
                    alt="Urban tree planting"
                    loading="lazy"
                    className="event-card__image"
                  />
                </div>
                <div className="event-card__content">
                  <time dateTime="2025-12-18" className="event-card__date">
                    {" "}
                    18/12/2025
                    <span
                      dangerouslySetInnerHTML={{
                        __html: " ",
                      }}
                    />
                  </time>
                  <h3 id="event-4-title" className="event-card__title">
                    {" "}
                    Trồng cây công viên Thống Nhất
                    <span
                      dangerouslySetInnerHTML={{
                        __html: " ",
                      }}
                    />
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
                      <span>
                        {" "}
                        Hai Bà Trưng, HN
                        <span
                          dangerouslySetInnerHTML={{
                            __html: " ",
                          }}
                        />
                      </span>
                    </span>
                    <span className="meta-item">09:00–12:00</span>
                  </div>
                  <p className="event-card__description">
                    {" "}
                    Mở rộng diện tích xanh. Vị trí còn: 32
                    <span
                      dangerouslySetInnerHTML={{
                        __html: " ",
                      }}
                    />
                  </p>
                  <button
                    aria-label="RSVP for park tree planting on December 18"
                    className="btn btn-secondary btn-sm"
                  >
                    {" "}
                    RSVP nhanh
                    <span
                      dangerouslySetInnerHTML={{
                        __html: " ",
                      }}
                    />
                  </button>
                </div>
              </article>
            </div>
          </div>
          <footer className="upcoming-events__footer">
            <button className="btn btn-outline">Xem thêm sự kiện</button>
            {isLoggedIn ? (
              <p className="upcoming-events__user-info">
                <span className="user-role-badge">{getRoleName(userRole)}</span>
                <span className="user-welcome">
                  Xin chào, <strong>{userName}</strong>! Bạn có thể quản lý
                  RSVP, xem lịch sử tham gia và in giấy xác nhận tình nguyện.
                </span>
              </p>
            ) : (
              <p className="upcoming-events__auth-prompt">
                {" "}
                Đăng nhập / Đăng ký để quản lý RSVP, xem lịch sử tham gia và in
                giấy xác nhận tình nguyện.
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </p>
            )}
          </footer>
        </div>
      </section>
      <section
        id="volunteering-programs-section"
        className="volunteering-programs"
      >
        <div className="volunteering-programs__container">
          <header className="volunteering-programs__header">
            <h2 className="section-title">
              {" "}
              Chương trình tình nguyện — Tác động có kế hoạch
              <span
                dangerouslySetInnerHTML={{
                  __html: " ",
                }}
              />
            </h2>
          </header>
          <div className="programs-grid">
            <article
              role="group"
              aria-labelledby="program-1-title"
              className="program-card"
            >
              <div className="program-card__image-wrapper">
                <img
                  src="https://images.pexels.com/photos/7656732/pexels-photo-7656732.jpeg?auto=compress&amp;cs=tinysrgb&amp;h=650&amp;w=940"
                  alt="Volunteers planting trees by lakeside"
                  loading="lazy"
                  className="program-card__image"
                />
              </div>
              <div className="program-card__icon">
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
                    <path d="M8 5h13m-8 7h8m-8 7h8M3 10a2 2 0 0 0 2 2h3"></path>
                    <path d="M3 5v12a2 2 0 0 0 2 2h3"></path>
                  </g>
                </svg>
              </div>
              <h3 id="program-1-title" className="program-card__title">
                {" "}
                Trồng cây đô thị
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </h3>
              <p className="program-card__lead">
                {" "}
                Thúc đẩy không gian xanh, giảm nhiệt đô thị và tạo bền vững cộng
                đồng.
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </p>
              <p className="program-card__impact">
                {" "}
                Tham gia như tình nguyện viên hoặc đóng góp cho dự án trồng rừng
                ven đô.
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </p>
              <div className="program-card__metadata">
                <span className="metadata-badge">
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
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3.128a4 4 0 0 1 0 7.744M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                    </g>
                  </svg>
                  <span>
                    {" "}
                    1,240 tình nguyện viên
                    <span
                      dangerouslySetInnerHTML={{
                        __html: " ",
                      }}
                    />
                  </span>
                </span>
              </div>
              <button
                aria-label="Tham gia Tree Planting program"
                className="btn btn-primary"
              >
                {" "}
                Tham gia
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </button>
            </article>
            <article
              role="group"
              aria-labelledby="program-2-title"
              className="program-card"
            >
              <div className="program-card__image-wrapper">
                <img
                  src="https://images.pexels.com/photos/9034669/pexels-photo-9034669.jpeg?auto=compress&amp;cs=tinysrgb&amp;h=650&amp;w=940"
                  alt="Beach cleanup volunteers"
                  loading="lazy"
                  className="program-card__image"
                />
              </div>
              <div className="program-card__icon">
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
                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                  ></path>
                </svg>
              </div>
              <h3 id="program-2-title" className="program-card__title">
                {" "}
                Dọn dẹp môi trường
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </h3>
              <p className="program-card__lead">
                {" "}
                Chiến dịch dọn rác theo tuyến, khu dân cư và bờ sông với nhân sự
                chuyên trách.
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </p>
              <p className="program-card__impact">
                {" "}
                Đăng ký ca làm việc ngắn hạn hoặc dẫn nhóm doanh nghiệp tham gia
                teambuilding ý nghĩa.
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </p>
              <div className="program-card__metadata">
                <span className="metadata-badge">
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
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3.128a4 4 0 0 1 0 7.744M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                    </g>
                  </svg>
                  <span>
                    {" "}
                    980 tình nguyện viên
                    <span
                      dangerouslySetInnerHTML={{
                        __html: " ",
                      }}
                    />
                  </span>
                </span>
              </div>
              <button
                aria-label="Tham gia Cleanup program"
                className="btn btn-primary"
              >
                {" "}
                Tham gia
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </button>
            </article>
            <article
              role="group"
              aria-labelledby="program-3-title"
              className="program-card"
            >
              <div className="program-card__image-wrapper">
                <img
                  src="https://images.pexels.com/photos/6646882/pexels-photo-6646882.jpeg?auto=compress&amp;cs=tinysrgb&amp;h=650&amp;w=940"
                  alt="Charity food distribution volunteers"
                  loading="lazy"
                  className="program-card__image"
                />
              </div>
              <div className="program-card__icon">
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
                    d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676a.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"
                  ></path>
                </svg>
              </div>
              <h3 id="program-3-title" className="program-card__title">
                {" "}
                Hoạt động từ thiện cộng đồng
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </h3>
              <p className="program-card__lead">
                {" "}
                Hỗ trợ gói cứu trợ, tiếp tế nhu yếu phẩm và chương trình tài trợ
                cho hộ nghèo.
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </p>
              <p className="program-card__impact">
                {" "}
                Chọn quy trình đóng góp minh bạch và theo dõi kết quả phân phối.
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </p>
              <div className="program-card__metadata">
                <span className="metadata-badge">
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
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3.128a4 4 0 0 1 0 7.744M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                    </g>
                  </svg>
                  <span>
                    {" "}
                    1,560 tình nguyện viên
                    <span
                      dangerouslySetInnerHTML={{
                        __html: " ",
                      }}
                    />
                  </span>
                </span>
              </div>
              <button
                aria-label="Tham gia Charity program"
                className="btn btn-primary"
              >
                {" "}
                Tham gia
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </button>
            </article>
            <article
              role="group"
              aria-labelledby="program-4-title"
              className="program-card"
            >
              <div className="program-card__image-wrapper">
                <img
                  src="https://images.pexels.com/photos/7265143/pexels-photo-7265143.jpeg?auto=compress&amp;cs=tinysrgb&amp;h=650&amp;w=940"
                  alt="Education and literacy tutoring"
                  loading="lazy"
                  className="program-card__image"
                />
              </div>
              <div className="program-card__icon">
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
                    d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"
                  ></path>
                </svg>
              </div>
              <h3 id="program-4-title" className="program-card__title">
                {" "}
                Giáo dục &amp; Bình dân học vụ số
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </h3>
              <p className="program-card__lead">
                {" "}
                Lớp học kỹ năng số, gia sư trực tuyến và chương trình nâng cao
                năng lực cho học sinh, thanh niên.
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </p>
              <p className="program-card__impact">
                {" "}
                Đăng ký làm gia sư hoặc tài trợ thiết bị học tập.
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </p>
              <div className="program-card__metadata">
                <span className="metadata-badge">
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
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3.128a4 4 0 0 1 0 7.744M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                    </g>
                  </svg>
                  <span>
                    {" "}
                    720 tình nguyện viên
                    <span
                      dangerouslySetInnerHTML={{
                        __html: " ",
                      }}
                    />
                  </span>
                </span>
              </div>
              <button
                aria-label="Tham gia Education program"
                className="btn btn-primary"
              >
                {" "}
                Tham gia
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </button>
            </article>
          </div>
          <footer className="volunteering-programs__footer">
            <p className="section-content">
              {" "}
              Mỗi chương trình có lịch, mô tả nhiệm vụ và yêu cầu rõ ràng. Chọn
              &quot;Tham gia&quot; để xem ca trực, cam kết thời gian và hướng
              dẫn an toàn.
              <span
                dangerouslySetInnerHTML={{
                  __html: " ",
                }}
              />
            </p>
          </footer>
        </div>
      </section>
      <section
        id="how-it-works-section"
        role="region"
        aria-label="How it works"
        className="how-it-works"
      >
        <div className="how-it-works__container">
          <div className="how-it-works__feature">
            <div className="how-it-works__feature-overlay"></div>
            <img
              src="https://images.pexels.com/photos/7213609/pexels-photo-7213609.jpeg?auto=compress&amp;cs=tinysrgb&amp;h=650&amp;w=940"
              alt="Diverse team collaboration"
              loading="lazy"
              className="how-it-works__feature-bg"
            />
            <div className="how-it-works__feature-content">
              <h2 className="how-it-works__headline">
                {" "}
                Cách thức hoạt động — Nhanh gọn, minh bạch, chuyên nghiệp
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </h2>
              <p className="how-it-works__mission">
                {" "}
                Quá trình rõ ràng, dữ liệu đáng tin cậy và trải nghiệm chuyên
                nghiệp giúp tổ chức mở rộng ảnh hưởng xã hội một cách bền vững.
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </p>
            </div>
          </div>
          <div className="how-it-works__steps">
            <ol className="steps-list">
              <li
                aria-label="Step 1: Registration and authentication"
                className="step-card"
              >
                <div className="step-card__number">
                  <span>1</span>
                </div>
                <div className="step-card__content">
                  <h3 className="step-card__title">Đăng ký &amp; xác thực</h3>
                  <p className="step-card__description">
                    {" "}
                    Tình nguyện viên, quản lý sự kiện và admin đăng ký bằng
                    thông tin cơ bản. Quy trình xác thực nhanh chóng, bảo mật dữ
                    liệu và phù hợp với tiêu chuẩn tổ chức chuyên nghiệp.
                    <span
                      dangerouslySetInnerHTML={{
                        __html: " ",
                      }}
                    />
                  </p>
                </div>
              </li>
              <li
                aria-label="Step 2: Find and join activities"
                className="step-card"
              >
                <div className="step-card__number">
                  <span>2</span>
                </div>
                <div className="step-card__content">
                  <h3 className="step-card__title">
                    Tìm &amp; tham gia hoạt động
                  </h3>
                  <p className="step-card__description">
                    {" "}
                    Duyệt chương trình theo mục tiêu (môi trường, giáo dục, cứu
                    trợ...), địa điểm và thời gian. Chi tiết chương trình trình
                    bày rõ vai trò, yêu cầu và quyền lợi.
                    <span
                      dangerouslySetInnerHTML={{
                        __html: " ",
                      }}
                    />
                  </p>
                </div>
              </li>
              <li aria-label="Step 3: Event management" className="step-card">
                <div className="step-card__number">
                  <span>3</span>
                </div>
                <div className="step-card__content">
                  <h3 className="step-card__title">Quản lý sự kiện hiệu quả</h3>
                  <p className="step-card__description">
                    {" "}
                    Người quản lý tạo lịch, phân công nhiệm vụ, theo dõi số
                    lượng tình nguyện viên và nguồn lực. Hệ thống cung cấp báo
                    cáo tiến độ tự động.
                    <span
                      dangerouslySetInnerHTML={{
                        __html: " ",
                      }}
                    />
                  </p>
                </div>
              </li>
              <li aria-label="Step 4: Field operations" className="step-card">
                <div className="step-card__number">
                  <span>4</span>
                </div>
                <div className="step-card__content">
                  <h3 className="step-card__title">
                    Vận hành &amp; phối hợp trên thực địa
                  </h3>
                  <p className="step-card__description">
                    {" "}
                    Công cụ check-in, giao tiếp nhóm và cập nhật thời gian thực
                    giúp tổ chức điều phối nhanh, giảm rủi ro và tăng hiệu suất
                    công tác cộng đồng.
                    <span
                      dangerouslySetInnerHTML={{
                        __html: " ",
                      }}
                    />
                  </p>
                </div>
              </li>
              <li aria-label="Step 5: Impact reporting" className="step-card">
                <div className="step-card__number">
                  <span>5</span>
                </div>
                <div className="step-card__content">
                  <h3 className="step-card__title">
                    Ghi nhận &amp; báo cáo tác động
                  </h3>
                  <p className="step-card__description">
                    {" "}
                    Sau sự kiện, hệ thống tổng hợp dữ liệu — giờ công, hiện vật
                    huy động, ảnh/video và kết quả đo lường. Báo cáo minh bạch
                    sẵn sàng cho nhà tài trợ.
                    <span
                      dangerouslySetInnerHTML={{
                        __html: " ",
                      }}
                    />
                  </p>
                </div>
              </li>
              <li aria-label="Step 6: Admin oversight" className="step-card">
                <div className="step-card__number">
                  <span>6</span>
                </div>
                <div className="step-card__content">
                  <h3 className="step-card__title">
                    Quản trị &amp; tuân thủ cho admin
                  </h3>
                  <p className="step-card__description">
                    {" "}
                    Admin quản lý quyền truy cập, kiểm soát ngân sách quyên góp,
                    duyệt báo cáo và đảm bảo tuân thủ chính sách an toàn. Mọi
                    thay đổi đều được ghi nhật ký.
                    <span
                      dangerouslySetInnerHTML={{
                        __html: " ",
                      }}
                    />
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>
      <section
        id="impact-section"
        aria-labelledby="impact-heading"
        className="impact-section"
      >
        <div className="impact-section__container">
          <header className="impact-section__header">
            <h2 id="impact-heading" className="impact-title">
              {" "}
              Thành quả thực — Tiếng nói cộng đồng
              <span
                dangerouslySetInnerHTML={{
                  __html: " ",
                }}
              />
            </h2>
            <p className="impact-sub">
              {" "}
              Mỗi chiến dịch VolunteerHub đều gắn kết chuyên nghiệp và đo được
              kết quả. Dưới đây là lời kể từ những người trực tiếp tạo nên thay
              đổi:
              <span
                dangerouslySetInnerHTML={{
                  __html: " ",
                }}
              />
            </p>
          </header>
          <div className="impact-grid">
            <div
              role="region"
              aria-roledescription="carousel"
              aria-live="polite"
              className="impact-carousel"
            >
              <div id="carousel-track" className="carousel-track">
                <article className="carousel-card carousel-card--active">
                  <div className="carousel-card__portrait">
                    <img
                      src="https://images.pexels.com/photos/7475166/pexels-photo-7475166.jpeg?auto=compress&amp;cs=tinysrgb&amp;h=650&amp;w=940"
                      alt="Volunteer holding plant"
                      loading="lazy"
                    />
                  </div>
                  <div className="carousel-card__content">
                    <blockquote className="quote">
                      {" "}
                      &quot;Chương trình trồng cây giúp tôi hiểu rõ trách nhiệm
                      với môi trường. Quy trình tổ chức chuyên nghiệp, minh bạch
                      từ đăng ký đến báo cáo kết quả.&quot;
                      <span
                        dangerouslySetInnerHTML={{
                          __html: " ",
                        }}
                      />
                    </blockquote>
                    <footer className="meta">
                      <cite>— Nguyễn Minh Anh, Tình nguyện viên</cite>
                    </footer>
                  </div>
                </article>
                <article className="carousel-card">
                  <div className="carousel-card__portrait">
                    <img
                      src="https://images.pexels.com/photos/6347743/pexels-photo-6347743.jpeg?auto=compress&amp;cs=tinysrgb&amp;h=650&amp;w=940"
                      alt="Confident female volunteer"
                      loading="lazy"
                    />
                  </div>
                  <div className="carousel-card__content">
                    <blockquote className="quote">
                      {" "}
                      &quot;Là quản lý sự kiện, tôi đánh giá cao công cụ báo cáo
                      tự động và khả năng theo dõi tiến độ. Hệ thống giúp chúng
                      tôi tiết kiệm thời gian và tăng hiệu quả điều phối.&quot;
                      <span
                        dangerouslySetInnerHTML={{
                          __html: " ",
                        }}
                      />
                    </blockquote>
                    <footer className="meta">
                      <cite>— Trần Hải Yến, Quản lý sự kiện</cite>
                    </footer>
                  </div>
                </article>
                <article className="carousel-card">
                  <div className="carousel-card__portrait">
                    <img
                      src="https://images.pexels.com/photos/7475128/pexels-photo-7475128.jpeg?auto=compress&amp;cs=tinysrgb&amp;h=650&amp;w=940"
                      alt="Two volunteers in blue shirts"
                      loading="lazy"
                    />
                  </div>
                  <div className="carousel-card__content">
                    <blockquote className="quote">
                      {" "}
                      &quot;VolunteerHub không chỉ là công cụ quản lý mà còn là
                      nền tảng xây dựng cộng đồng. Dữ liệu minh bạch giúp chúng
                      tôi thu hút thêm nhà tài trợ và đối tác.&quot;
                      <span
                        dangerouslySetInnerHTML={{
                          __html: " ",
                        }}
                      />
                    </blockquote>
                    <footer className="meta">
                      <cite>— Phạm Quốc Tuấn, Admin tổ chức</cite>
                    </footer>
                  </div>
                </article>
              </div>
              <div className="carousel-controls">
                <button
                  id="carousel-prev"
                  aria-label="Previous testimonial"
                  aria-controls="carousel-track"
                  className="carousel-btn"
                >
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
                      d="m18 15l-6-6l-6 6"
                    ></path>
                  </svg>
                </button>
                <button
                  id="carousel-next"
                  aria-label="Next testimonial"
                  aria-controls="carousel-track"
                  className="carousel-btn"
                >
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
                      d="m18 15l-6-6l-6 6"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="micro-grid">
              <article className="micro-card">
                <blockquote className="micro-card__quote">
                  {" "}
                  &quot;Dễ dàng tìm và tham gia sự kiện phù hợp với lịch trình
                  của tôi.&quot;
                  <span
                    dangerouslySetInnerHTML={{
                      __html: " ",
                    }}
                  />
                </blockquote>
                <footer className="micro-card__meta">
                  <span>— Lê Văn Hùng</span>
                </footer>
              </article>
              <article className="micro-card">
                <blockquote className="micro-card__quote">
                  {" "}
                  &quot;Hệ thống giúp chúng tôi quản lý quyên góp minh bạch và
                  chính xác.&quot;
                  <span
                    dangerouslySetInnerHTML={{
                      __html: " ",
                    }}
                  />
                </blockquote>
                <footer className="micro-card__meta">
                  <span>— Đỗ Thu Hà</span>
                </footer>
              </article>
              <article className="micro-card">
                <blockquote className="micro-card__quote">
                  {" "}
                  &quot;Báo cáo tác động chi tiết thuyết phục được nhiều nhà tài
                  trợ.&quot;
                  <span
                    dangerouslySetInnerHTML={{
                      __html: " ",
                    }}
                  />
                </blockquote>
                <footer className="micro-card__meta">
                  <span>— Vũ Minh Đức</span>
                </footer>
              </article>
              <article className="micro-card">
                <blockquote className="micro-card__quote">
                  {" "}
                  &quot;Check-in nhanh, giao tiếp nhóm hiệu quả trên thực
                  địa.&quot;
                  <span
                    dangerouslySetInnerHTML={{
                      __html: " ",
                    }}
                  />
                </blockquote>
                <footer className="micro-card__meta">
                  <span>— Hoàng Mai Linh</span>
                </footer>
              </article>
              <article className="micro-card">
                <blockquote className="micro-card__quote">
                  {" "}
                  &quot;Tôi có thể theo dõi giờ công và in chứng nhận dễ
                  dàng.&quot;
                  <span
                    dangerouslySetInnerHTML={{
                      __html: " ",
                    }}
                  />
                </blockquote>
                <footer className="micro-card__meta">
                  <span>— Ngô Thành Nam</span>
                </footer>
              </article>
              <article className="micro-card">
                <blockquote className="micro-card__quote">
                  {" "}
                  &quot;Giao diện chuyên nghiệp, dễ sử dụng cho mọi lứa
                  tuổi.&quot;
                  <span
                    dangerouslySetInnerHTML={{
                      __html: " ",
                    }}
                  />
                </blockquote>
                <footer className="micro-card__meta">
                  <span>— Bùi Lan Anh</span>
                </footer>
              </article>
            </div>
          </div>
        </div>
      </section>
      <Footer></Footer>
      {/* ...existing code... */}
    </div>
  );
};

export default Home;
