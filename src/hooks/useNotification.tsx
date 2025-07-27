import React, { createContext, useContext, useState, useCallback } from 'react';
import { NotificationContainer, NotificationProps } from '@/components/ui/notification';

interface NotificationContextType {
  addNotification: (notification: Omit<NotificationProps, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: React.ReactNode;
  maxNotifications?: number;
  defaultDuration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  maxNotifications = 5,
  defaultDuration = 5000,
  position = 'top-right',
}) => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const addNotification = useCallback(
    (notification: Omit<NotificationProps, 'id'>): string => {
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const newNotification: NotificationProps = {
        ...notification,
        id,
        autoHide: notification.autoHide ?? true,
        duration: notification.duration ?? defaultDuration,
      };

      setNotifications((prev) => {
        const updated = [newNotification, ...prev].slice(0, maxNotifications);
        return updated;
      });

      // Auto-hide notification
      if (newNotification.autoHide) {
        setTimeout(() => {
          removeNotification(id);
        }, newNotification.duration);
      }

      return id;
    },
    [maxNotifications, defaultDuration]
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        addNotification,
        removeNotification,
        clearAll,
      }}
    >
      {children}
      <NotificationContainer
        notifications={notifications}
        onDismiss={removeNotification}
        position={position}
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Convenience hooks for different notification types
export const useNotificationActions = () => {
  const { addNotification } = useNotification();

  const showSuccess = useCallback(
    (title: string, message: string, action?: NotificationProps['action']) => {
      return addNotification({ type: 'success', title, message, action });
    },
    [addNotification]
  );

  const showError = useCallback(
    (title: string, message: string, action?: NotificationProps['action']) => {
      return addNotification({ type: 'error', title, message, action, autoHide: false });
    },
    [addNotification]
  );

  const showWarning = useCallback(
    (title: string, message: string, action?: NotificationProps['action']) => {
      return addNotification({ type: 'warning', title, message, action });
    },
    [addNotification]
  );

  const showInfo = useCallback(
    (title: string, message: string, action?: NotificationProps['action']) => {
      return addNotification({ type: 'info', title, message, action });
    },
    [addNotification]
  );

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};