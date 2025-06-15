const IS_DEV = process.env.EXPO_PUBLIC_APP_VARIANT === 'development'

export default {

  expo: {
    name: 'Top Fun',
    slug: 'loldotfun',
    version: '1.0.4',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'fun.top',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#0061FF',
    },

    ios: {
      buildNumber: '2',
      bundleIdentifier: 'top.fun.app',
      supportsTablet: true,
      config: {
        usesNonExemptEncryption: false,
      },
      infoPlist: {
        LSApplicationQueriesSchemes: ['blob'],
      },
      "usesAppleSignIn": true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#161618',
      },
      "package": "top.fun.app"

    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-font',
      'expo-router',
      [
        'expo-image-picker',
        {
          photosPermission: 'topfun needs access to your photos to let you upload an image for your meme',
        },
      ],
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#0174E7",
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 300
        }
      ],
      'expo-secure-store',

      "expo-apple-authentication"
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas: {
        projectId: '85eed254-de6f-49ab-8bec-41a1bbd283ac',
      },
    },
    owner: 'tamara-tran',
    updates: {
      url: 'https://u.expo.dev/85eed254-de6f-49ab-8bec-41a1bbd283ac',
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
  },
}
