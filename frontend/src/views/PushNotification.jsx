import React, { useState, useEffect } from 'react';
import './PushNotification.css';
import { subscribePush, unsubscribePush } from '../utils/pushNotification';

const PushNotificationSettings = ({ userId }) => {
  const [pushEnabled, setPushEnabled] = useState(false);
  const [permission, setPermission] = useState(Notification.permission);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Kiểm tra trạng thái hiện tại khi component mount
    if (Notification.permission === 'granted') {
      // Có thể thêm API call để check subscription tồn tại trong DB
      setPushEnabled(true);
    }
  }, []);

  const handleTogglePush = async () => {
    setLoading(true);
    if (!pushEnabled) {
      // Bật push
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm === 'granted') {
        try {
          // Import động để tránh lỗi SSR nếu dùng Next.js (ở đây CRA nên OK)
          await subscribePush(userId);
          setPushEnabled(true);
        } catch (err) {
          alert('Không thể đăng ký push notification. Xem console để biết lỗi.');
          console.error(err);
        }
      } else {
        alert('Bạn cần cho phép thông báo để sử dụng tính năng này.');
      }
    } else {
      // Tắt push
      try {
        await unsubscribePush(userId);
        setPushEnabled(false);
      } catch (err) {
        console.error(err);
      }
    }
    setLoading(false);
  };

  const sendTestNotification = async () => {
    if (!pushEnabled) {
      alert('Vui lòng bật push notification trước!');
      return;
    }
    setLoading(true);
    try {
      await fetch('/api/notifications/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      alert('Đã gửi thông báo test! Kiểm tra tab hoặc thiết bị của bạn.');
    } catch (err) {
      alert('Gửi test thất bại. Xem console.');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="push-settings">
      <h3>🔔 Thông báo Push</h3>

      <div className={`push-settings__status ${pushEnabled ? 'enabled' : ''}`}>
        <div className="status-indicator"></div>
        <span>
          Trạng thái: <strong>{pushEnabled ? 'Đã bật' : 'Đã tắt'}</strong> 
          {' '} (Quyền trình duyệt: {permission})
        </span>
      </div>

      <div className="push-settings__actions">
        <button
          className={pushEnabled ? 'danger' : 'primary'}
          onClick={handleTogglePush}
          disabled={loading}
        >
          {loading ? 'Đang xử lý...' : pushEnabled ? 'Tắt thông báo Push' : 'Bật thông báo Push'}
        </button>

        <button
          className="secondary"
          onClick={sendTestNotification}
          disabled={!pushEnabled || loading}
        >
          Gửi thông báo test
        </button>
      </div>

      <p className="note">
        💡 Push notification giúp bạn nhận thông báo ngay cả khi không mở trang web: duyệt đăng ký, 
        bình luận mới, nhắc nhở sự kiện sắp diễn ra...<br />
        Chỉ hoạt động trên trình duyệt hỗ trợ (Chrome, Edge, Firefox) và yêu cầu HTTPS (trừ localhost).
      </p>
    </div>
  );
};

export default PushNotificationSettings;