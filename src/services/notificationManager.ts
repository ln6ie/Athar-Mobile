import messaging from '@react-native-firebase/messaging';
import { api } from './api';

let fcmToken: string | null = null;

export async function requestNotificationPermission(): Promise<boolean> {
  try {
    console.log('[NotificationManager] Requesting permission...');
    const authStatus = await messaging().requestPermission({
      alert: true,
      badge: true,
      sound: true,
    });

    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    console.log('[NotificationManager] Permission status response:', authStatus, 'Enabled:', enabled);
    return enabled;
  } catch (error) {
    console.error('[NotificationManager] Permission request failed with error:', error);
    return false;
  }
}

export async function getFcmToken(): Promise<string | null> {
  try {
    console.log('[NotificationManager] Checking if device is registered for remote messages...');
    const isRegistered = messaging().isDeviceRegisteredForRemoteMessages();
    console.log('[NotificationManager] Device registration status:', isRegistered);
    
    if (!isRegistered) {
      console.log('[NotificationManager] Registering device for remote messages...');
      await messaging().registerDeviceForRemoteMessages();
      console.log('[NotificationManager] Device registered successfully');
    }
    
    console.log('[NotificationManager] Fetching FCM token from Firebase...');
    const token = await messaging().getToken();
    if (token) {
      fcmToken = token;
      console.log('[NotificationManager] FCM token obtained successfully:', token.slice(0, 15) + '...');
    } else {
      console.warn('[NotificationManager] Firebase returned null token');
    }
    return token;
  } catch (error) {
    console.error('[NotificationManager] Failed to get FCM token with error:', error);
    return null;
  }
}

export async function registerFcmTokenWithBackend(): Promise<boolean> {
  console.log('[NotificationManager] registerFcmTokenWithBackend called. Current local fcmToken:', fcmToken ? (fcmToken.slice(0, 15) + '...') : 'null');
  if (!fcmToken) {
    console.log('[NotificationManager] No local token found, attempting to fetch one...');
    await getFcmToken();
  }

  if (!fcmToken) {
    console.error('[NotificationManager] Cannot register with backend: FCM Token is still null');
    return false;
  }

  try {
    console.log('[NotificationManager] Sending token to backend /notifications/register-token...');
    const response = await api.post('/notifications/register-token', { token: fcmToken });
    console.log('[NotificationManager] FCM token registered on server. Server response:', response.data);
    return true;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      console.warn('[NotificationManager] Backend returned 401 Unauthorized. Skipping registration (User not logged in or token expired)');
    } else {
      console.error('[NotificationManager] Failed to register FCM token on backend with error:', error?.message, error?.response?.data);
    }
    return false;
  }
}

export async function unregisterFcmToken(): Promise<boolean> {
  if (!fcmToken) return false;

  try {
    await api.post('/notifications/unregister-token', { token: fcmToken });
    console.log('[NotificationManager] FCM token unregistered from server');
    return true;
  } catch (error) {
    console.error('[NotificationManager] Failed to unregister FCM token', error);
    return false;
  }
}

export function getCurrentFcmToken(): string | null {
  return fcmToken;
}

export async function refreshFcmToken(): Promise<string | null> {
  try {
    const token = await messaging().getToken();
    if (token && token !== fcmToken) {
      fcmToken = token;
      console.log('[NotificationManager] FCM token refreshed');
      await registerFcmTokenWithBackend();
    }
    return token;
  } catch (error) {
    console.error('[NotificationManager] Failed to refresh FCM token', error);
    return null;
  }
}

export function onTokenRefresh(callback: (token: string) => void) {
  return messaging().onTokenRefresh(async (newToken) => {
    console.log('[NotificationManager] Token refreshed');
    fcmToken = newToken;
    await registerFcmTokenWithBackend();
    callback(newToken);
  });
}

export async function initializeNotifications(): Promise<string | null> {
  const permitted = await requestNotificationPermission();
  if (!permitted) return null;

  const token = await getFcmToken();
  return token;
}

export function handleNotificationOpenedApp() {
  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log('[NotificationManager] App opened from notification', remoteMessage.data);
  });

  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log('[NotificationManager] App opened from quit state notification', remoteMessage.data);
      }
    });
}

export function setupForegroundMessageHandler() {
  return messaging().onMessage(async (remoteMessage) => {
    console.log('[NotificationManager] Foreground message received', remoteMessage.notification?.title);
  });
}

// Android notification channels must be created in native code (android/app/src/main/res/values/)
// or via a library like @notifee/react-native. The Firebase default channel will be used
// for messages without a custom channelId until native channel creation is configured.
