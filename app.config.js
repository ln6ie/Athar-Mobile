module.exports = {
  expo: {
    name: "Athar",
    slug: "athar",
    version: "1.2.5",
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
            enableMinifyInReleaseBuilds: true
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
        "com.apple.developer.applesignin": ["Default"]
      },
      icon: {
        light: "./assets/icon-light.png",
        dark: "./assets/icon-dark.png",
        tinted: "./assets/icon-tinted.png"
      },
      infoPlist: {
        UIDesignRequiresCompatibility: false
      },
      googleServicesFile: process.env.GOOGLE_SERVICES_PLIST || "./GoogleService-Info.plist"
    },
    android: {
      package: "com.athar.app",
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
