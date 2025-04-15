import { View, ImageBackground } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { router } from 'expo-router'

import { Images, PARENT_VIEW_HORIZONTAL_PADDING } from '@/constants'

import { ParentView, CButton } from '@/components'
import { FunButton } from '@/components/ui/fun-button'
import { customHaptics } from '@/utils'

export default function Onboard() {
  const bottomInset = useSafeAreaInsets().bottom

  const handleGoToSignUp = () => {
    customHaptics.tap()
    router.push('/privy-social-auth')
  }

  const handleGoToSignin = () => {
    customHaptics.tap()
    router.push('/privy-social-auth')
  }

  return (
    <ParentView
      containerStyle={{
        paddingHorizontal: PARENT_VIEW_HORIZONTAL_PADDING,
        paddingBottom: bottomInset,
        backgroundColor: '#0174E7',
      }}
    >
      <View className="relative flex-col items-center justify-end flex-1">
        <View className="flex-col items-center justify-center flex-1">
          <ImageBackground source={Images.topFun} resizeMode="contain" className="w-[300px] h-[100px]" />
        </View>
        <View className="absolute bottom-0 flex">
          <ImageBackground source={Images.signUpText} resizeMode="contain" className="w-[200px] h-[70px]" />
          <View className="flex flex-col items-center justify-center gap-2 pb-5">
            {/* <CButton title="Sign Up" variant="short-orange" onPress={handleGoToSignUp} /> */}

            <FunButton size="lg" variant="orange" onPress={handleGoToSignUp} fullWidth>
              Sign Up
            </FunButton>

            {/* <CButton title="Login" textClassName="text-[#FE6301]" onPress={handleGoToSignin} /> */}

            <FunButton size="lg" variant="ghost" onPress={handleGoToSignUp} fullWidth>
              Login
            </FunButton>
          </View>
        </View>
      </View>
    </ParentView>
  )
}
