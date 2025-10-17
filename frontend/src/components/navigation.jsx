import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Script from "dangerous-html/react";
import UserDropdown from "./user-dropdown";
import NotificationBell from "./notification-bell";
import { authAPI } from "../services/api";

import "./navigation.css";

const Navigation = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Check if user is logged in and get role
    setIsLoggedIn(authAPI.isAuthenticated());

    if (authAPI.isAuthenticated()) {
      const userData = authAPI.getUserData();
      setUserRole(userData?.role);
    } else {
      setUserRole(null);
    }

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = () => {
      setIsLoggedIn(authAPI.isAuthenticated());

      if (authAPI.isAuthenticated()) {
        const userData = authAPI.getUserData();
        setUserRole(userData?.role);
      } else {
        setUserRole(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Get the events page URL based on user role
  const getEventsUrl = () => {
    if (userRole === "event_manager" || userRole === "admin") {
      return "/events-manager";
    }
    return "/events";
  };

  return (
    <div className="navigation-container1">
      <div className="navigation-container2">
        <div className="navigation-container3">
          <Script
            html={`<style>
@media (prefers-reduced-motion: no-preference) {
.navigation-wrapper {
  transition: box-shadow 0.3s ease, background 0.3s ease,
        transform 0.3s ease;
}
}
</style>`}
          ></Script>
        </div>
      </div>
      <div className="navigation-container4">
        <div className="navigation-container5">
          <Script
            html={`<script defer data-name="navigation">
(function(){
  const navigationToggle = document.getElementById("navigation-toggle")
  const navigationMobile = document.getElementById("navigation-mobile")
  const navigationWrapper = document.getElementById("navigation-main")

  // Toggle mobile menu
  navigationToggle.addEventListener("click", function () {
    const isExpanded = this.getAttribute("aria-expanded") === "true"

    this.setAttribute("aria-expanded", !isExpanded)
    this.setAttribute("aria-label", isExpanded ? "Mở menu" : "Đóng menu")

    navigationMobile.classList.toggle("navigation-mobile-active")

    // Prevent body scroll when menu is open
    document.body.style.overflow = isExpanded ? "" : "hidden"
  })

  // Close mobile menu when clicking on a link
  const mobileLinks = navigationMobile.querySelectorAll(
    ".navigation-mobile-link"
  )
  mobileLinks.forEach((link) => {
    link.addEventListener("click", function () {
      navigationToggle.setAttribute("aria-expanded", "false")
      navigationToggle.setAttribute("aria-label", "Mở menu")
      navigationMobile.classList.remove("navigation-mobile-active")
      document.body.style.overflow = ""
    })
  })

  // Close mobile menu on escape key
  document.addEventListener("keydown", function (e) {
    if (
      e.key === "Escape" &&
      navigationMobile.classList.contains("navigation-mobile-active")
    ) {
      navigationToggle.setAttribute("aria-expanded", "false")
      navigationToggle.setAttribute("aria-label", "Mở menu")
      navigationMobile.classList.remove("navigation-mobile-active")
      document.body.style.overflow = ""
      navigationToggle.focus()
    }
  })

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (e) {
    if (
      navigationMobile.classList.contains("navigation-mobile-active") &&
      !navigationWrapper.contains(e.target)
    ) {
      navigationToggle.setAttribute("aria-expanded", "false")
      navigationToggle.setAttribute("aria-label", "Mở menu")
      navigationMobile.classList.remove("navigation-mobile-active")
      document.body.style.overflow = ""
    }
  })

  // Add scroll effect to navigation
  let lastScrollY = window.scrollY

  window.addEventListener("scroll", function () {
    const currentScrollY = window.scrollY

    if (currentScrollY > 20) {
      navigationWrapper.classList.add("navigation-scrolled")
    } else {
      navigationWrapper.classList.remove("navigation-scrolled")
    }

    lastScrollY = currentScrollY
  })

  // Handle window resize - close mobile menu if resized to desktop
  window.addEventListener("resize", function () {
    if (
      window.innerWidth > 991 &&
      navigationMobile.classList.contains("navigation-mobile-active")
    ) {
      navigationToggle.setAttribute("aria-expanded", "false")
      navigationToggle.setAttribute("aria-label", "Mở menu")
      navigationMobile.classList.remove("navigation-mobile-active")
      document.body.style.overflow = ""
    }
  })
})()
</script>`}
          ></Script>
        </div>
      </div>
      <nav id="navigation-main" className="navigation-wrapper">
        <div className="navigation-container">
          <a href="#">
            <div
              aria-label="VolunteerHub - Trang chủ"
              className="navigation-logo"
            >
              <div className="navigation-logo-icon">
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
              <span className="navigation-logo-text">VolunteerHub</span>
            </div>
          </a>
          <div className="navigation-links">
            <a href="/">
              <div className="navigation-link">
                <span className="navigation-link-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
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
                </span>
                <span>Trang Chủ</span>
              </div>
            </a>
            <a href="/about">
              <div className="navigation-link">
                <span className="navigation-link-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    ></circle>
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 16v-4m0-4h.01"
                    ></path>
                  </svg>
                </span>
                <span>Về Chúng Tôi</span>
              </div>
            </a>
            <Link to={getEventsUrl()}>
              <div className="navigation-link">
                <span className="navigation-link-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
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
                </span>
                <span>Sự Kiện</span>
              </div>
            </Link>
            <Link to="/discussion-list">
              <div className="navigation-link">
                <span className="navigation-link-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                    ></path>
                  </svg>
                </span>
                <span>Kênh Trao Đổi</span>
              </div>
            </Link>
          </div>
          <div className="navigation-actions">
            {isLoggedIn ? (
              <>
                <NotificationBell />
                <UserDropdown />
              </>
            ) : (
              <>
                <a href="/login">
                  <button className="navigation-btn-secondary btn btn-outline">
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
                      style={{ marginRight: "6px" }}
                    >
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4m-5-4l5-5-5-5m5 5H3"></path>
                    </svg>
                    Đăng Nhập
                  </button>
                </a>
                <a href="/register">
                  <button className="navigation-btn-primary btn btn-primary">
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
                      style={{ marginRight: "6px" }}
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <line x1="19" y1="8" x2="19" y2="14"></line>
                      <line x1="22" y1="11" x2="16" y2="11"></line>
                    </svg>
                    Đăng Ký
                  </button>
                </a>
              </>
            )}
          </div>
          <button
            id="navigation-toggle"
            aria-label="Mở menu"
            aria-expanded="false"
            className="navigation-toggle"
          >
            <span className="navigation-navigation-toggle-icon1">
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
                  d="M4 5h16M4 12h16M4 19h16"
                ></path>
              </svg>
            </span>
            <span className="navigation-navigation-toggle-icon2">
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
                  d="M18 6L6 18M6 6l12 12"
                ></path>
              </svg>
            </span>
          </button>
        </div>
        <div id="navigation-mobile" className="navigation-mobile">
          <div className="navigation-mobile-content">
            <a href="#hoat-dong">
              <div className="navigation-mobile-link">
                <span className="navigation-mobile-link-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
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
                </span>
                <span>Hoạt Động</span>
              </div>
            </a>
            <Link to="/discussion-list">
              <div className="navigation-mobile-link">
                <span className="navigation-mobile-link-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                    ></path>
                  </svg>
                </span>
                <span>Kênh Trao Đổi</span>
              </div>
            </Link>
            <a href="#ve-chung-toi">
              <div className="navigation-mobile-link">
                <span className="navigation-mobile-link-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
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
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 16v-4m0-4h.01"></path>
                    </g>
                  </svg>
                </span>
                <span>Về Chúng Tôi</span>
              </div>
            </a>
            <div className="navigation-mobile-actions">
              {isLoggedIn ? (
                <div
                  style={{
                    padding: "16px 0",
                    display: "flex",
                    justifyContent: "center",
                    gap: "12px",
                  }}
                >
                  <NotificationBell />
                  <UserDropdown />
                </div>
              ) : (
                <>
                  <a href="/login">
                    <button className="navigation-mobile-btn btn btn-outline">
                      Đăng Nhập
                    </button>
                  </a>
                  <a href="/register">
                    <button className="navigation-mobile-btn btn btn-primary">
                      {" "}
                      Tham Gia Ngay
                      <span
                        dangerouslySetInnerHTML={{
                          __html: " ",
                        }}
                      />
                    </button>
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
