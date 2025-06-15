import { usePrivy } from '@privy-io/expo'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native'

import { customHaptics, getStoredAuthData, supabase, UserData } from '@/utils'

import { useAuth, useImportWallet, useSolanaBalance } from '@/hooks'

import { Colors } from '@/constants'

import { CText, Icon, ParentView, Spacer } from '@/components'
import { FunButton } from '@/components/ui/fun-button'
import { useUserBalance } from '@/hooks/payments/use-user-balance'
import { RealtimeChannel } from '@supabase/supabase-js'
import InAppBrowser from 'react-native-inappbrowser-reborn'
import UserBalance from '@/components/(profile)/user-balance'
import { ManuallyCreateWallet } from '@/components/(profile)/manually-created-wallet'
import Holdings from '@/components/(profile)/holdings'
import CreatedTokensList from '@/components/(profile)/created-tokens-lis'

export default function ProfileScreen() {
  const { signOut, user } = useAuth()

  const walletAddress = useImportWallet()
  const hasWallet = walletAddress !== null

  const { logout: privyLogout, user: privyUser } = usePrivy()
  const { wallet } = useSolanaBalance()
  const router = useRouter()

  const [storedUser, setStoredUser] = useState<UserData | null>(null)
  const [activeProfileTab, setActiveProfileTab] = useState('holdings')
  const [isBusy, setIsBusy] = useState(false)
  const [isDepositing, setIsDepositing] = useState(false)
  useEffect(() => {
    const loadStoredUser = async () => {
      const userData = await getStoredAuthData()
      setStoredUser(userData)
    }
    loadStoredUser()
  }, [])

  const gotoSettings = () => {
    customHaptics.tap()
    router.push('/(auth)/(tabs)/settings')
  }

  const handleDeposit = async () => {
    setIsDepositing(true)
    customHaptics.tap()
    const solanaWalletAddress = walletAddress?.walletAddress?.[0]?.address
    console.log('solanaWalletaddress=>', solanaWalletAddress)
    // setIsBusy(true)
    try {
      // if (!solanaWalletAddress) throw 'Please connect solana wallet!'

      const { data, error } = await supabase.functions.invoke('create-crypto-session', {
        body: {},
      })

      setSessionId(data?.id)

      console.log('sessionn_id=', data.id)

      if (error) throw error

      try {
        if (await InAppBrowser.isAvailable()) {
          await InAppBrowser.close()
          await InAppBrowser.open(data.redirect_url, {
            // Browser configuration
            showTitle: true,
            toolbarColor: '#2563EB',
            secondaryToolbarColor: 'black',
            enableUrlBarHiding: true,
            enableDefaultShare: false,
            forceCloseOnRedirection: true,
          })
          // temporarily show a toast to simulate a token purchase
          // in reality, we need to confirm whether the purchase was successful
          // toast('Token Created', {
          //     duration: 5000,
          //     disableShadow: true,
          //     width: Dimensions.get('screen').width * 0.9,
          //     isSwipeable: true,
          //     customToast: () => {
          //         return <TokenPurchaseToast tokenName="Saad" />;
          //     },
          // });
        }
      } catch (error) {
        console.error(error)
      }
    } catch (error: unknown) {
      console.error('Deposit failed:', error)

      Alert.alert('Error', typeof error === 'string' ? error : 'Failed to create OnRamp session')
      console.error(error)
    } finally {
      setIsBusy(false)
      setIsDepositing(false)
    }
  }

  const handleSend = async () => {
    customHaptics.tap()
    // console.log(`Sending 0.1 SOL to ${JSON.stringify(wallet?.address)}`)
    // if (!wallet?.address) return
    // try {
    //   const connection = new Connection('https://api.mainnet-beta.solana.com')
    //   const transaction = new Transaction().add(
    //     SystemProgram.transfer({
    //       fromPubkey: new PublicKey(wallet.address),
    //       toPubkey: new PublicKey('RECIPIENT_PUBKEY_HERE'),
    //       lamports: LAMPORTS_PER_SOL * 0.1,
    //     })
    //   )
    //   // Get recent blockhash and sign
    //   const { blockhash } = await connection.getRecentBlockhash()
    //   transaction.recentBlockhash = blockhash
    //   transaction.feePayer = new PublicKey(wallet.address)
    //   // Sign and send directly
    //   const signedTx = await wallet.signTransaction(transaction)
    //   const signature = await connection.sendRawTransaction(signedTx.serialize())
    //   console.log('Transaction successful:', signature)
    // } catch (error) {
    //   console.error('Send failed:', error)
    // }
  }
  const { balance: userBalance, loading: balanceLoading, error, refetch: refetchBalance } = useUserBalance()
  const { width } = useWindowDimensions()

  const [sessionId, setSessionId] = useState<string | null>(null)
  useEffect(() => {
    let subscription: RealtimeChannel

    const setupRealtimeSubscription = () => {
      console.log(`Setting up realtime subscription for payment status SESSION=${sessionId}`)
      subscription = supabase
        .channel('payment_status')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'crypto_payments',
            filter: `session_id=eq.${sessionId}`,
          },
          async (payload) => {
            console.log('Payment status changed:', payload)
            if (payload.new.status === 'fulfillment_complete') {
              InAppBrowser.close()
              await refetchBalance()
              Alert.alert('Payment successful', 'Your payment was successful')
            }
          }
        )
        .subscribe()
    }

    if (sessionId) {
      setupRealtimeSubscription()
    }

    return () => {
      subscription?.unsubscribe()
    }
  }, [sessionId])

  const twitterAccount = privyUser?.linked_accounts.find((acc) => acc.type === 'twitter_oauth')
  const tiktokAccount = privyUser?.linked_accounts.find((acc) => acc.type === 'tiktok_oauth')
  // console.log('user', user);
  // console.log('privyUser', privyUser);

  const getSocialUsername = () => {
    if (tiktokAccount?.username) return `@${tiktokAccount.username}`
    if (twitterAccount?.username) return `@${twitterAccount.username}`
    return `@${storedUser?.username ?? 'anonymous'}`
  }

  const getSocialProfileImage = () => {
    // if (tiktokAccount?.profile_picture_url)
    //     return tiktokAccount.profile_picture_url;
    // if (twitterAccount?.profile_picture_url)
    //     return twitterAccount.profile_picture_url;
    return null
  }
  const isTablet = width >= 768

  return (
    <ParentView>
      <View className="flex-col items-start justify-start flex-1 w-full px-5 pb-16 md:px-10">
        {/* Header */}
        <View className="relative flex flex-row items-center justify-between w-full">
          <View className="flex flex-row items-center justify-between w-full">
            {/* <Icon icon="userCircle" size={36} /> */}
            <View style={{ width: 36 }} />
            <CText weight="semibold" className="text-lg md:text-xl text-gray-700 font-[SfProRounded]">
              Wallet
            </CText>
            <Pressable onPress={gotoSettings}>
              <Icon icon="userCircle" size={36} />
            </Pressable>
          </View>
        </View>

        <Spacer size={isTablet ? 30 : 20} />

        {/* Wallet Info */}
        <View className="flex flex-col items-center justify-start w-full">
          {!hasWallet ? (
            <ManuallyCreateWallet />
          ) : (
            <UserBalance
              handleSend={handleSend}
              handleDeposit={handleDeposit}
              balance={userBalance}
              loading={balanceLoading}
              error={error}
            />
          )}
        </View>

        {/* Holdings and Created Tokens Tabs */}
        {hasWallet && (
          <View className="flex flex-col items-center justify-start flex-1 w-full">
            <Spacer size={isTablet ? 40 : 30} />

            <View className="flex-col items-center justify-center w-5/6 rounded-full">
              {/* Tabs */}
              <View className="flex-row items-center justify-between w-full">
                <Pressable
                  onPress={() => {
                    customHaptics.softTap()
                    setActiveProfileTab('holdings')
                  }}
                >
                  <View className="relative">
                    <CText
                      weight="bold"
                      className={activeProfileTab === 'holdings' ? 'text-[#0174E7]' : 'text-[#B6D0F3]'}
                      style={{ fontFamily: 'SfProRounded' }}
                    >
                      Holdings
                    </CText>
                    {activeProfileTab === 'holdings' && (
                      <CText className="absolute text-4xl text-[#0174E7] left-[50%]">.</CText>
                    )}
                  </View>
                </Pressable>

                <Pressable
                  onPress={() => {
                    customHaptics.softTap()
                    setActiveProfileTab('created')
                  }}
                >
                  <View className="relative">
                    <CText
                      weight="bold"
                      className={activeProfileTab === 'created' ? 'text-[#0174E7]' : 'text-[#B6D0F3]'}
                      style={{ fontFamily: 'SfProRounded' }}
                    >
                      Coins Created
                    </CText>
                    {activeProfileTab === 'created' && (
                      <CText className="absolute text-4xl text-[#0174E7] left-[50%]">.</CText>
                    )}
                  </View>
                </Pressable>
              </View>

              {/* Tab Content */}
              <View className="w-[90%] mt-5" style={{ height: 200 }}>
                {activeProfileTab === 'holdings' ? <Holdings /> : <CreatedTokensList />}
              </View>
            </View>

            <Spacer size={isTablet ? 20 : 16} />
          </View>
        )}

        {/* Buy Button */}
        {/* <CButton title="Buy" variant="blue" isBusy={isBusy} onPress={handleDeposit} className="mx-4 " /> */}

        <FunButton
          onPress={handleDeposit}
          disabled={isDepositing}
          loading={isDepositing}
          variant="blue"
          classList=""
          fullWidth
        >
          Buy
        </FunButton>
      </View>
    </ParentView>
  )
}

const styles = StyleSheet.create({
  text: {
    color: Colors.titleLight,
    fontFamily: 'SfProRounded',
    textAlign: 'center',
    fontStyle: 'normal',
    fontWeight: '700',
  },
})
