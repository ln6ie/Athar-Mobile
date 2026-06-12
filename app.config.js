const fs = require('fs');
const path = require('path');

try {
  const envPath = path.resolve(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf-8');
    envFile.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...valueParts] = trimmed.split('=');
        const val = valueParts.join('=').trim();
        const cleanKey = key.trim();
        if (cleanKey && !process.env[cleanKey]) {
          process.env[cleanKey] = val;
        }
      }
    });
  }
} catch (e) {
  // Ignored
}

module.exports = {
  expo: {
    name: "Athar",
    slug: "athar",
    version: "1.2.6",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    plugins: [
      "expo-router",
      [
        "expo-build-properties",
        {
          ios: {
            deploymentTarget: "16.4",
            useFrameworks: "static"
          },
          android: {
            enableMinifyInReleaseBuilds: true,
            enableShrinkResourcesInReleaseBuilds: true,
            buildArchs: ["arm64-v8a"]
          }
        }
      ],
      "expo-font",
      [
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme: process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME
        }
      ],
      "@react-native-firebase/app",
      "@react-native-firebase/messaging"
    ],
    scheme: "athar",
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.athar.iq.app",
      entitlements: {
        "com.apple.developer.applesignin": ["Default"],
        "aps-environment": process.env.EXPO_PUBLIC_APP_ENV === "production" ? "production" : "development"
      },
      icon: {
        light: "./assets/icon-light.png",
        dark: "./assets/icon-dark.png",
        tinted: "./assets/icon-tinted.png"
      },
      infoPlist: {
        UIDesignRequiresCompatibility: false,
        UIBackgroundModes: ["remote-notification"]
      },
      googleServicesFile: process.env.GOOGLE_SERVICES_PLIST || "./GoogleService-Info.plist"
    },
    android: {
      package: "com.athar.iq.app",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
        monochromeImage: "./assets/monochrome-icon.png"
      },
      predictiveBackGestureEnabled: false,
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON || "./google-services.json"
    },
    web: {
      favicon: "./assets/favicon.png"
    }
  }
};
