import React from "react";
import { Helmet } from "react-helmet";
import Navigation from "../components/navigation.jsx";
import Footer from "../components/footer.jsx";
import "./about.css";

const About = (props) => {
  return (
    <div className="about-container">
      <Helmet>
        <title>Về Chúng Tôi - VolunteerHub</title>
        <meta property="og:title" content="Về Chúng Tôi - VolunteerHub" />
      </Helmet>
      <Navigation></Navigation>

      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1 className="about-hero-title">
            VolunteerHub - Nơi kết nối đam mê công nghệ và sáng tạo, xây dựng
            những giải pháp sáng tạo cho tương lai
          </h1>
          <p className="about-hero-subtitle">
            VolunteerHub - Nơi kết nối đam mê công nghệ và sáng tạo, đây dựng
            công đồng học tập và phát triển bền vững
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-mission">
        <div className="about-mission-container">
          <div className="mission-card">
            <div className="mission-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <h3 className="mission-title">Sứ Mệnh</h3>
            <p className="mission-text">
              Tạo ra một cộng đồng học tập và phát triển, nơi mọi người có thể
              chia sẻ kiến thức, tài nguyên và cộng tác để xây dựng những giải
              pháp sáng tạo cho các vấn đề xã hội.
            </p>
          </div>

          <div className="mission-card">
            <div className="mission-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </div>
            <h3 className="mission-title">Tầm Nhìn</h3>
            <p className="mission-text">
              Trở thành cộng đồng công nghệ hàng đầu tại Việt Nam, nơi các nhân
              tài công nghệ có thể tương tác, học hỏi và đóng góp vào xã hội
              thông qua các dự án có ý nghĩa.
            </p>
          </div>

          <div className="mission-card">
            <div className="mission-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </div>
            <h3 className="mission-title">Giá Trị Cốt Lõi</h3>
            <p className="mission-text">
              Chia sẻ, hợp tác, đổi mới, sáng tạo, hỗ trợ lẫn nhau và luôn hướng
              đến việc tạo ra các sản phẩm và giải pháp có giá trị cho cộng
              đồng.
            </p>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="about-journey">
        <div className="about-journey-container">
          <h2 className="journey-title">Hành Trình Của Chúng Tôi</h2>
          <div className="journey-content">
            <div className="journey-text">
              <p>
                VolunteerHub được thành lập vào năm 2020 với mong muốn tạo ra
                một nền tảng giúp kết nối các tình nguyện viên và các dự án xã
                hội có ý nghĩa. Chúng tôi tin rằng mọi người đều có thể làm ra
                những điều tốt đẹp cho cộng đồng khi được tạo điều kiện phù hợp.
              </p>
              <p>
                Qua các năm, chúng tôi đã tổ chức hàng trăm workshop, meetup và
                hackathon, giúp hàng nghìn người học hỏi kỹ năng mới, kết bác
                với các chuyên gia đầu ngành, và làm ra những sản phẩm có giá
                trị. Chúng tôi tự hào về cộng đồng của chúng tôi đã góp phần tạo
                ra nhiều sản phẩm phục vụ nhu cầu phát triển của chất lượng.
              </p>
              <p>
                Ngày nay, VolunteerHub không chỉ là một cộng đồng học tập mà còn
                là một gia đình lớn, nơi mọi người có thể tìm thấy sự trợ động
                lực và cả hạn phát triển bản thân. Chúng tôi là báo cái nổi giả
                nhưng các vai trò cá nhân thông qua sự sáng tạo và sự tận tâm.
              </p>
            </div>
            <div className="journey-image">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
                alt="Team collaboration"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-team">
        <div className="about-team-container">
          <h2 className="team-section-title">Đội Ngũ Lãnh Đạo</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"
                  alt="Nguyễn Văn An"
                />
              </div>
              <h3 className="member-name">Nguyễn Văn An</h3>
              <p className="member-role">Founder & CEO</p>
              <p className="member-bio">
                Với hơn 8 năm kinh nghiệm trong lĩnh vực công nghệ và tư duy đổi
                mới, Văn An đang xây dựng VolunteerHub.
              </p>
              <div className="member-links">
                <a href="#" className="member-link">
                  LinkedIn
                </a>
                <a href="#" className="member-link">
                  GitHub
                </a>
              </div>
            </div>

            <div className="team-member">
              <div className="member-avatar">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
                  alt="Trần Thị Minh"
                />
              </div>
              <h3 className="member-name">Trần Thị Minh</h3>
              <p className="member-role">Head of Community</p>
              <p className="member-bio">
                Minh sáng kích nhiệm vụ điều hành cộng đồng với tầm nhìn tạo ra
                một nơi mọi người có thể học hỏi và phát triển cùng nhau.
              </p>
              <div className="member-links">
                <a href="#" className="member-link">
                  LinkedIn
                </a>
                <a href="#" className="member-link">
                  Twitter
                </a>
              </div>
            </div>

            <div className="team-member">
              <div className="member-avatar">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop"
                  alt="Lê Hoàng Đức"
                />
              </div>
              <h3 className="member-name">Lê Hoàng Đức</h3>
              <p className="member-role">Lead Developer</p>
              <p className="member-bio">
                Đức là chuyên gia về kỹ thuật JavaScript và Web. Anh ấy phụ
                trách phát triển và xây dựng các sản phẩm công nghệ.
              </p>
              <div className="member-links">
                <a href="#" className="member-link">
                  GitHub
                </a>
                <a href="#" className="member-link">
                  Portfolio
                </a>
              </div>
            </div>

            <div className="team-member">
              <div className="member-avatar">
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop"
                  alt="Phạm Thị Lan"
                />
              </div>
              <h3 className="member-name">Phạm Thị Lan</h3>
              <p className="member-role">Head of Design</p>
              <p className="member-bio">
                Lan là chuyên gia UX/UI Design với đam mê xây dựng trải nghiệm
                tốt. Cô ấy dẫn đầu team design và xây dựng các sản phẩm.
              </p>
              <div className="member-links">
                <a href="#" className="member-link">
                  Behance
                </a>
                <a href="#" className="member-link">
                  Dribbble
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="about-achievements">
        <div className="about-achievements-container">
          <h2 className="achievements-title">Thành Tựu Đạt Được</h2>
          <div className="achievements-grid">
            <div className="achievement-item">
              <h3 className="achievement-number">2020</h3>
              <p className="achievement-label">Thành Lập</p>
              <p className="achievement-desc">
                VolunteerHub chính thức được thành lập vào đầu năm 2020 với đội
                ngũ sáng lập ban đầu.
              </p>
            </div>

            <div className="achievement-item">
              <h3 className="achievement-number">500+</h3>
              <p className="achievement-label">Thành Viên</p>
              <p className="achievement-desc">
                Cộng đồng hơn 500 thành viên tích cực tham gia, học tập và không
                ngừng đóng góp cho cộng đồng.
              </p>
            </div>

            <div className="achievement-item">
              <h3 className="achievement-number">50+</h3>
              <p className="achievement-label">Sự Kiện</p>
              <p className="achievement-desc">
                Tổ chức thành công hơn 50 workshop, meetup và hackathon trong
                suốt hành trình.
              </p>
            </div>

            <div className="achievement-item">
              <h3 className="achievement-number">100+</h3>
              <p className="achievement-label">Dự Án</p>
              <p className="achievement-desc">
                Công đồng đã hoàn thành hơn 100 dự án có ý nghĩa kĩ thuật và
                sáng tạo đến cộng đồng.
              </p>
            </div>

            <div className="achievement-item">
              <h3 className="achievement-number">1200+</h3>
              <p className="achievement-label">Cộng Đồng</p>
              <p className="achievement-desc">
                Hiện nay có hơn 1200 thành viên liên kết với hàm lượng đa dạng
                từ khắp nơi.
              </p>
            </div>

            <div className="achievement-item">
              <h3 className="achievement-number">5+</h3>
              <p className="achievement-label">Giải Thưởng</p>
              <p className="achievement-desc">
                Nhận được 5 giải thưởng danh trong về đổi mới sáng tạo của cộng
                đồng công nghệ.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="about-cta-container">
          <h2 className="cta-title">Sẵn Sàng Tham Gia Cùng Chúng Tôi?</h2>
          <p className="cta-subtitle">
            Hãy kết nối với chúng tôi để cùng xây dựng tương lai công nghệ Việt
            Nam
          </p>
          <div className="cta-buttons">
            <button className="cta-btn cta-btn-primary">Tham Gia Ngay</button>
            <button className="cta-btn cta-btn-secondary">
              Liên Hệ Với Chúng Tôi
            </button>
          </div>
        </div>
      </section>

      <Footer></Footer>
    </div>
  );
};

export default About;
