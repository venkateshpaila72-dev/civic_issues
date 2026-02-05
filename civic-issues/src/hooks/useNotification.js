import { useNotification as useNotificationContext } from '../context/NotificationContext';

/**
 * Convenience re-export of the notification context hook.
 */
const useNotification = () => useNotificationContext();

export default useNotification;