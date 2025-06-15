const IS_DEV = process.env.EXPO_PUBLIC_APP_VARIANT === 'development'

export default {

  expo: {
    name: 'Top Fun',
    slug: 'loldotfun',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'fun.top',
    userInterfaceStyle: 'automatic',
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      buildNumber: '1',
      bundleIdentifier: 'com.maxta.topfun',
      supportsTablet: true,
      config: {
        usesNonExemptEncryption: false,
      },
      infoPlist: {
        UIBackgroundModes: [
          "remote-notification"
        ],
        CFBundleAllowMixedLocalizations: true,
        NSLocationWhenInUseUsageDescription: "This app does not use or track location data.",
        NSPhotoLibraryUsageDescription: "This app does not access your photo library.",
        NSCameraUsageDescription: "This app does not use your camera.",
        NSMicrophoneUsageDescription: "This app does not use your microphone.",
        NSUserNotificationUsageDescription: "Receive notifications for your daily verse and reminders.",
        LSApplicationQueriesSchemes: ['blob'],
      },
      jsEngine: "hermes",
      hermesFlags: {
        gc: "nonconservative",
        "small-heap": true,
        "max-heap-size": "512MB"
      },
      "usesAppleSignIn": true,
    },
    android: {

    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    platforms: [
      "ios"
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false
      },
      eas: {

      },
    },
    owner: 'maxta',
    updates: {
      url: 'https://u.expo.dev/85eed254-de6f-49ab-8bec-41a1bbd283ac',
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
  },
}
