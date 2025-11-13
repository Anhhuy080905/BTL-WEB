import React, { useState, useEffect } from 'react';
import {
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  getPushSubscriptionStatus,
  sendTestNotification,
  isPushNotificationSupported
} from '../utils/pushNotification';
import './PushNotificationSettings.css';

const PushNotificationSettings = () => {
  const [status, setStatus] = useState({
    supported: false,
    subscribed: false,
    permission: 'default'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    const currentStatus = await getPushSubscriptionStatus();
    setStatus(currentStatus);
  };

  const handleSubscribe = async () => {
    setLoading(true);
    setMessage('');
    try {
      await subscribeToPushNotifications();
      setMessage('✅ Đã bật thông báo đẩy thành công!');
      await checkStatus();
    } catch (error) {
      if (error.message === 'Notification permission denied') {
        setMessage('❌ Bạn cần cấp quyền thông báo trong cài đặt trình duyệt');
      } else {
        setMessage('❌ Lỗi khi bật thông báo: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setLoading(true);
    setMessage('');
    try {
      await unsubscribeFromPushNotifications();
      setMessage('✅ Đã tắt thông báo đẩy');
      await checkStatus();
    } catch (error) {
      setMessage('❌ Lỗi khi tắt thông báo: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    setLoading(true);
    setMessage('');
    try {
      await sendTestNotification();
      setMessage('✅ Đã gửi thông báo test. Kiểm tra thông báo của bạn!');
    } catch (error) {
      setMessage('❌ Lỗi khi gửi test: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isPushNotificationSupported()) {
    return (
      <div className="push-settings">
        <div className="alert alert-warning">
          ⚠️ Trình duyệt của bạn không hỗ trợ thông báo đẩy
        </div>
      </div>
    );
  }

  return (
    <div className="push-settings">
      <h3>🔔 Cài đặt thông báo đẩy</h3>
      
      <div className="status-info">
        <div className="status-item">
          <span className="label">Trạng thái:</span>
          <span className={`badge ${status.subscribed ? 'badge-success' : 'badge-secondary'}`}>
            {status.subscribed ? 'Đã bật' : 'Chưa bật'}
          </span>
        </div>
        <div className="status-item">
          <span className="label">Quyền:</span>
          <span className={`badge ${
            status.permission === 'granted' ? 'badge-success' :
            status.permission === 'denied' ? 'badge-danger' :
            'badge-warning'
          }`}>
            {status.permission === 'granted' ? 'Đã cấp' :
             status.permission === 'denied' ? 'Bị từ chối' :
             'Chưa hỏi'}
          </span>
        </div>
      </div>

      {message && (
        <div className={`alert ${message.startsWith('✅') ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}

      <div className="actions">
        {!status.subscribed ? (
          <button
            className="btn btn-primary"
            onClick={handleSubscribe}
            disabled={loading || status.permission === 'denied'}
          >
            {loading ? '⏳ Đang xử lý...' : '🔔 Bật thông báo đẩy'}
          </button>
        ) : (
          <>
            <button
              className="btn btn-danger"
              onClick={handleUnsubscribe}
              disabled={loading}
            >
              {loading ? '⏳ Đang xử lý...' : '🔕 Tắt thông báo đẩy'}
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleTest}
              disabled={loading}
            >
              {loading ? '⏳ Đang gửi...' : '🧪 Gửi test'}
            </button>
          </>
        )}
      </div>

      {status.permission === 'denied' && (
        <div className="alert alert-info">
          💡 <strong>Hướng dẫn bật lại quyền thông báo:</strong>
          <ul>
            <li>Chrome: Cài đặt → Quyền riêng tư và bảo mật → Cài đặt trang web → Thông báo</li>
            <li>Firefox: Nhấp vào biểu tượng khóa → Quyền → Thông báo</li>
            <li>Edge: Cài đặt → Cookie và quyền trang web → Thông báo</li>
          </ul>
        </div>
      )}

      <div className="info-box">
        <h4>📝 Bạn sẽ nhận thông báo khi:</h4>
        <ul>
          <li>✅ Đăng ký sự kiện được duyệt/từ chối</li>
          <li>🎉 Hoàn thành sự kiện</li>
          <li>💬 Có comment/reply mới</li>
          <li>⏰ Sự kiện sắp diễn ra</li>
        </ul>
      </div>
    </div>
  );
};

export default PushNotificationSettings;