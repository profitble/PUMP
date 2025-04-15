import * as Haptics from 'expo-haptics'

export const customHaptics = {
  success: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
  },
  error: () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
  },
  tap: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
  },
  softTap: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  },
}

export default customHaptics
