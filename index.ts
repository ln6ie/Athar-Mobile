import 'react-native-reanimated';
(globalThis as any).RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;
import { registerRootComponent } from 'expo';
import { enableScreens } from 'react-native-screens';
import messaging from '@react-native-firebase/messaging';
import App from './App';

// Enable native screens for NavigationContainer — required in native builds
enableScreens();

// Handle background and quit state push notifications
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('[BackgroundMessageHandler] Message received in background', remoteMessage.data);

  // The OS will display the notification automatically on iOS and Android
  // This handler is for data-only messages or custom background logic
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
