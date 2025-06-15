import { Pressable, View } from 'react-native'
import { useEmbeddedSolanaWallet } from '@privy-io/expo'

import { customHaptics } from '@/utils'

import { CText, Spacer } from '@/components'

export const ManuallyCreateWallet = () => {
  const wallet = useEmbeddedSolanaWallet()

  const handleCreateWallet = () => {
    customHaptics.tap()
    try {
      if (wallet.status === 'not-created') {
        wallet?.create({
          recoveryMethod: 'privy',
        })
      }
    } catch (error) {
      console.error('Error in background wallet creation:', error)
    }
  }

  return (
    <View className="flex flex-col justify-start items-center">
      <CText weight="regular" className="text-white text-base">
        Create a wallet to begin transacting
      </CText>
      <Spacer size={16} />
      <Pressable
        onPress={handleCreateWallet}
        className="w-full rounded-2xl flex flex-col justify-center items-center h-14 bg-white px-8"
      >
        <CText isExpanded weight="black" className="text-[18px] text-black">
          CREATE WALLET
        </CText>
      </Pressable>
    </View>
  )
}
