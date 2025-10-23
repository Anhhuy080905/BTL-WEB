import { useState, useCallback } from "react";

/**
 * Hook quản lý toast notifications
 * @returns {Object} - { toasts, showToast, removeToast }
 */
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };

    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Helper methods
  const showSuccess = useCallback(
    (message, duration) => {
      return showToast(message, "success", duration);
    },
    [showToast]
  );

  const showError = useCallback(
    (message, duration) => {
      return showToast(message, "error", duration);
    },
    [showToast]
  );

  const showWarning = useCallback(
    (message, duration) => {
      return showToast(message, "warning", duration);
    },
    [showToast]
  );

  const showInfo = useCallback(
    (message, duration) => {
      return showToast(message, "info", duration);
    },
    [showToast]
  );

  return {
    toasts,
    showToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
