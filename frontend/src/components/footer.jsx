import React from 'react'

import Script from 'dangerous-html/react'

import './footer.css'

const Footer = (props) => {
  return (
    <div className="footer-container1">
      <div className="footer-container2">
        <div className="footer-container3">
          <Script
            html={`<style>
        @keyframes footerGradientShift {0%,100% {background-position: 0% 50%;}
50% {background-position: 100% 50%;}}
        </style> `}
          ></Script>
        </div>
      </div>
      <div className="footer-container4">
        <div className="footer-container5">
          <Script
            html={`<style>
@media (prefers-reduced-motion: reduce) {
.footer-top-accent {
  animation: none;
}
.footer-logo-icon, .footer-social-link, .footer-nav-link, .footer-contact-icon, .footer-newsletter-button, .footer-back-to-top {
  transition: none;
}
}
</style>`}
          ></Script>
        </div>
      </div>
      <div className="footer-container6">
        <div className="footer-container7">
          <Script
            html={`<script defer data-name="footer">
(function(){
  // Back to Top Button Functionality
  const backToTopButton = document.getElementById("footer-back-to-top")

  function toggleBackToTop() {
    const scrollPosition = window.scrollY
    const windowHeight = window.innerHeight

    if (scrollPosition > windowHeight * 0.5) {
      backToTopButton.classList.add("footer-back-to-top-visible")
    } else {
      backToTopButton.classList.remove("footer-back-to-top-visible")
    }
  }

  // Smooth scroll to top
  backToTopButton.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })

  // Listen to scroll events
  window.addEventListener("scroll", toggleBackToTop, { passive: true })

  // Initial check
  toggleBackToTop()

  // Newsletter form submission
  const newsletterInput = document.getElementById("footer-newsletter-input")
  const newsletterButton = document.querySelector(".footer-newsletter-button")

  if (newsletterButton) {
    newsletterButton.addEventListener("click", function (e) {
      e.preventDefault()
      const email = newsletterInput.value.trim()

      if (email && email.includes("@")) {
        // Success feedback
        newsletterInput.value = ""
        newsletterInput.placeholder = "Cảm ơn bạn đã đăng ký!"

        // Visual feedback
        newsletterButton.style.transform = "scale(0.95)"
        setTimeout(() => {
          newsletterButton.style.transform = ""
        }, 150)

        // Reset placeholder after 3 seconds
        setTimeout(() => {
          newsletterInput.placeholder = "Email của bạn"
        }, 3000)
      } else {
        // Error feedback
        newsletterInput.style.borderColor = "var(--color-primary)"
        newsletterInput.focus()

        setTimeout(() => {
          newsletterInput.style.borderColor = ""
        }, 2000)
      }
    })
  }

  // Add enter key support for newsletter
  if (newsletterInput) {
    newsletterInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        newsletterButton.click()
      }
    })
  }
})()
</script>`}
          ></Script>
        </div>
      </div>
      <footer id="footer-volunteerhub" className="footer-main">
        <div className="footer-container">
          <div aria-hidden="true" className="footer-top-accent"></div>
          <div className="footer-content-wrapper">
            <div className="footer-brand-section">
              <div className="footer-logo-wrapper">
                <div aria-hidden="true" className="footer-logo-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
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
                <h2 className="footer-brand-name">VolunteerHub</h2>
              </div>
              <p className="footer-mission-text">
                {' '}
                Kết nối cộng đồng, lan tỏa yêu thương. Nền tảng hỗ trợ tổ chức
                và quản lý các hoạt động tình nguyện toàn diện.
                <span
                  dangerouslySetInnerHTML={{
                    __html: ' ',
                  }}
                />
              </p>
              <div className="footer-social-wrapper">
                <span className="footer-social-label">
                  Kết nối với chúng tôi
                </span>
                <div className="footer-social-links">
                  <a href="#">
                    <div aria-label="Facebook" className="footer-social-link">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
                        ></path>
                      </svg>
                    </div>
                  </a>
                  <a href="#">
                    <div aria-label="Twitter" className="footer-social-link">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6c2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4c-.9-4.2 4-6.6 7-3.8c1.1 0 3-1.2 3-1.2"
                        ></path>
                      </svg>
                    </div>
                  </a>
                  <a href="#">
                    <div aria-label="Instagram" className="footer-social-link">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <g
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        >
                          <rect
                            width="20"
                            height="20"
                            x="2"
                            y="2"
                            rx="5"
                            ry="5"
                          ></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8A4 4 0 0 1 16 11.37m1.5-4.87h.01"></path>
                        </g>
                      </svg>
                    </div>
                  </a>
                  <a href="#">
                    <div aria-label="LinkedIn" className="footer-social-link">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <g
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        >
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2a2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6M2 9h4v12H2z"></path>
                          <circle cx="4" cy="4" r="2"></circle>
                        </g>
                      </svg>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            <div className="footer-links-section">
              <h3 className="footer-section-title">Liên kết nhanh</h3>
              <nav aria-label="Footer Navigation" className="footer-nav">
                <ul className="footer-nav-list">
                  <li className="footer-nav-item">
                    <a href="/">
                      <div className="footer-nav-link">
                        <span>Trang chủ</span>
                      </div>
                    </a>
                  </li>
                  <li className="footer-nav-item">
                    <a href="#events">
                      <div className="footer-nav-link">
                        <span>Sự kiện tình nguyện</span>
                      </div>
                    </a>
                  </li>
                  <li className="footer-nav-item">
                    <a href="#about">
                      <div className="footer-nav-link">
                        <span>Về chúng tôi</span>
                      </div>
                    </a>
                  </li>
                  <li className="footer-nav-item">
                    <a href="#volunteer">
                      <div className="footer-nav-link">
                        <span>
                          {' '}
                          Trở thành tình nguyện viên
                          <span
                            dangerouslySetInnerHTML={{
                              __html: ' ',
                            }}
                          />
                        </span>
                      </div>
                    </a>
                  </li>
                  <li className="footer-nav-item">
                    <a href="#organizer">
                      <div className="footer-nav-link">
                        <span>Dành cho tổ chức</span>
                      </div>
                    </a>
                  </li>
                  <li className="footer-nav-item">
                    <a href="#impact">
                      <div className="footer-nav-link">
                        <span>Tác động cộng đồng</span>
                      </div>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="footer-links-section">
              <h3 className="footer-section-title">Hoạt động</h3>
              <nav aria-label="Activities Navigation" className="footer-nav">
                <ul className="footer-nav-list">
                  <li className="footer-nav-item">
                    <a href="#tree-planting">
                      <div className="footer-nav-link">
                        <span>
                          {' '}
                          Trồng cây xanh
                          <span
                            dangerouslySetInnerHTML={{
                              __html: ' ',
                            }}
                          />
                        </span>
                      </div>
                    </a>
                  </li>
                  <li className="footer-nav-item">
                    <a href="#cleanup">
                      <div className="footer-nav-link">
                        <span>Dọn dẹp môi trường</span>
                      </div>
                    </a>
                  </li>
                  <li className="footer-nav-item">
                    <a href="#charity">
                      <div className="footer-nav-link">
                        <span>Hoạt động từ thiện</span>
                      </div>
                    </a>
                  </li>
                  <li className="footer-nav-item">
                    <a href="#education">
                      <div className="footer-nav-link">
                        <span>
                          {' '}
                          Bình dân học vụ số
                          <span
                            dangerouslySetInnerHTML={{
                              __html: ' ',
                            }}
                          />
                        </span>
                      </div>
                    </a>
                  </li>
                  <li className="footer-nav-item">
                    <a href="#community">
                      <div className="footer-nav-link">
                        <span>
                          {' '}
                          Xây dựng cộng đồng
                          <span
                            dangerouslySetInnerHTML={{
                              __html: ' ',
                            }}
                          />
                        </span>
                      </div>
                    </a>
                  </li>
                  <li className="footer-nav-item">
                    <a href="#disaster">
                      <div className="footer-nav-link">
                        <span>Cứu trợ thiên tai</span>
                      </div>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="footer-contact-section">
              <h3 className="footer-section-title">Liên hệ</h3>
              <div className="footer-contact-list">
                <div className="footer-contact-item">
                  <div aria-hidden="true" className="footer-contact-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <g
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      >
                        <path d="m22 7l-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                      </g>
                    </svg>
                  </div>
                  <div className="footer-contact-content">
                    <span className="footer-contact-label">Email</span>
                    <a href="mailto:info@volunteerhub.vn?subject=">
                      <div className="footer-contact-link">
                        <span>
                          {' '}
                          info@volunteerhub.vn
                          <span
                            dangerouslySetInnerHTML={{
                              __html: ' ',
                            }}
                          />
                        </span>
                      </div>
                    </a>
                  </div>
                </div>
                <div className="footer-contact-item">
                  <div aria-hidden="true" className="footer-contact-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233a14 14 0 0 0 6.392 6.384"
                      ></path>
                    </svg>
                  </div>
                  <div className="footer-contact-content">
                    <span className="footer-contact-label">Hotline</span>
                    <a href="tel:+84123456789">
                      <div className="footer-contact-link">
                        <span>
                          {' '}
                          +84 123 456 789
                          <span
                            dangerouslySetInnerHTML={{
                              __html: ' ',
                            }}
                          />
                        </span>
                      </div>
                    </a>
                  </div>
                </div>
                <div className="footer-contact-item">
                  <div aria-hidden="true" className="footer-contact-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
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
                  </div>
                  <div className="footer-contact-content">
                    <span className="footer-contact-label">Địa chỉ</span>
                    <p className="footer-contact-text">
                      {' '}
                      123 Đường Tình Nguyện, Quận 1, TP. Hồ Chí Minh, Việt Nam
                      <span
                        dangerouslySetInnerHTML={{
                          __html: ' ',
                        }}
                      />
                    </p>
                  </div>
                </div>
              </div>
              <div className="footer-newsletter">
                <label
                  htmlFor="footer-newsletter-input"
                  className="footer-newsletter-label"
                >
                  {' '}
                  Đăng ký nhận tin
                  <span
                    dangerouslySetInnerHTML={{
                      __html: ' ',
                    }}
                  />
                </label>
                <div className="footer-newsletter-form">
                  <input
                    type="email"
                    id="footer-newsletter-input"
                    placeholder="Email của bạn"
                    aria-label="Email address"
                    className="footer-newsletter-input"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="footer-newsletter-button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m5 12l7-7l7 7m-7 7V5"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p className="footer-copyright">
                {' '}
                © 2025 VolunteerHub. Mọi quyền được bảo lưu.
                <span
                  dangerouslySetInnerHTML={{
                    __html: ' ',
                  }}
                />
              </p>
              <div className="footer-legal-links">
                <a href="#privacy">
                  <div className="footer-legal-link">
                    <span>Chính sách bảo mật</span>
                  </div>
                </a>
                <span aria-hidden="true" className="footer-legal-separator">
                  |
                </span>
                <a href="#terms">
                  <div className="footer-legal-link">
                    <span>Điều khoản sử dụng</span>
                  </div>
                </a>
                <span aria-hidden="true" className="footer-legal-separator">
                  |
                </span>
                <a href="#cookies">
                  <div className="footer-legal-link">
                    <span>Chính sách Cookie</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
          <button
            id="footer-back-to-top"
            aria-label="Back to top"
            className="footer-back-to-top"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m5 12l7-7l7 7m-7 7V5"
              ></path>
            </svg>
          </button>
        </div>
      </footer>
    </div>
  )
}

export default Footer
