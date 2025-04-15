import { ParentView } from '@/components'
import { FunButton } from '@/components/ui/fun-button'
import { useAuth } from '@/hooks'
import { customHaptics } from '@/utils'
import { usePrivy } from '@privy-io/expo'
import { useHeaderHeight } from '@react-navigation/elements'
import { useNavigation, useRouter } from 'expo-router'
import React from 'react'
import { Alert, Text, View } from 'react-native'

export default function SettingsScreen() {
  const headerHeight = useHeaderHeight()
  const navigation = useNavigation()
  const router = useRouter()
  const { logout: privyLogout, user: privyUser } = usePrivy()
  const { signOut, user } = useAuth()

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     title: 'S',
  //     headerTitleAlign: 'center',
  //     headerLeft: () => (
  //       <TouchableOpacity
  //         onPress={() => {
  //           router.back()
  //         }}
  //         style={styles.iconButton}
  //       >
  //         <Icon icon="backArrow" size={16} color="#979797" />
  //       </TouchableOpacity>
  //     ),
  //   })
  // }, [navigation])

  const handleLogout = () => {
    customHaptics.success()
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        onPress: async () => {
          await privyLogout()
          await signOut()
          router.replace('/onboard')
          console.log('Logging out...')
        },
      },
    ])
  }

  const handleDeleteAccount = () => {
    customHaptics.success()
    Alert.alert('Delete Account', 'This action is irreversible. Do you want to proceed?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: () => {
          // privyLogout()
          // signOut()
          router.replace('/onboard')
        },
        style: 'destructive',
      },
    ])
  }

  console.log('user', user)

  return (
    <ParentView>
      <View className="flex-col items-start justify-start flex-1 w-full px-5 pb-16 md:px-10">
        <Text className="text-2xl font-bold text-gray-800">Profile</Text>

        {/* <Card className="p-4 mt-4 bg-white shadow rounded-2xl">
          <Text className="text-lg font-semibold">Linked Accounts</Text>
          {user.linked_accounts.map((account, index) => (
            <View key={index} className="flex-row items-center mt-2">
              <Text className="text-sm text-gray-700">
                {account.type === 'apple_oauth' ? account.email : account.address}
              </Text>
              {account.type !== 'apple_oauth' && (
                <TouchableOpacity onPress={() => account.address && copyToClipboard(account.address)}>
                  <Copy size={16} className="ml-2 text-blue-500" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </Card>

        <Card className="p-4 mt-4 bg-white shadow rounded-2xl">
          <Text className="text-lg font-semibold">Public Key</Text>
          <View className="flex-row items-center">
            <Text className="flex-1 text-sm text-gray-700">{user.publicKey}</Text>
            <TouchableOpacity onPress={() => copyToClipboard(user.publicKey)}>
              <Copy size={16} className="ml-2 text-blue-500" />
            </TouchableOpacity>
          </View>
        </Card> */}

        <View className="w-full ">
          <View style={{ gap: 20, marginTop: 40, marginHorizontal: 20 }}>
            <FunButton variant="orange" size="lg" fullWidth onPress={handleLogout}>
              Logout
            </FunButton>
            <FunButton variant="destructive" size="lg" fullWidth onPress={handleDeleteAccount}>
              Delete Account
            </FunButton>
          </View>
        </View>
      </View>
    </ParentView>
  )
}

// import React from 'react'
// import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native'
// import { useNavigation } from '@react-navigation/native'
// import { Clipboard } from 'react-native'
// import { Card } from '@/components/ui/card'
// import { FunButton } from '@/components/ui/fun-button'
// import { LogOut, Trash2, Copy } from 'lucide-react-native'
// import { ParentView } from '@/components'

// const ProfileScreen = () => {
//   const navigation = useNavigation()

//

//   const copyToClipboard = (text: string) => {
//     Clipboard.setString(text)
//     Alert.alert('Copied', 'Copied to clipboard!')
//   }

//   return (
//     <ParentView>
//       <ScrollView className="flex-1 p-4 bg-gray-100"></ScrollView>
//     </ParentView>
//   )
// }

// export default ProfileScreen
