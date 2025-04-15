import { CText, CTextInput, Icon, ParentView, Spacer } from '@/components'
import { FunButton } from '@/components/ui/fun-button'
import { Colors, PARENT_VIEW_HORIZONTAL_PADDING } from '@/constants'
import { useAuth } from '@/hooks'
import { customHaptics } from '@/utils'
import { useLoginWithEmail } from '@privy-io/expo'
import { router } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Keyboard, Linking, Pressable, TextInput, View } from 'react-native'

interface ValidationErrors {
  email: string | null
  otp: string | null
}

type ScreenState = 'EMAIL_INPUT' | 'OTP_INPUT'

export default function Signup() {
  const [screenState, setScreenState] = useState<ScreenState>('EMAIL_INPUT')
  const { isLoading, onSuccessAuth } = useAuth()

  const { sendCode, loginWithCode } = useLoginWithEmail({
    onSendCodeSuccess: () => {
      setScreenState('OTP_INPUT')
    },
    onLoginSuccess: onSuccessAuth,
  })

  const inputRef = useRef<TextInput>(null)
  const otpInputRef = useRef<TextInput>(null)

  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [isAgreed, setIsAgreed] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({ email: null, otp: null })
  const [keyboardVisible, setKeyboardVisible] = useState(false)

  const [isSendingCode, setIsSendingCode] = useState(false)
  const [isVerifyingCode, setIsVerifyingCode] = useState(false)

  useEffect(() => {
    const focusTimeout = setTimeout(() => {
      try {
        if (screenState === 'EMAIL_INPUT') {
          inputRef.current?.focus()
        } else {
          otpInputRef.current?.focus()
        }
      } catch (error) {
        console.warn('Failed to focus input:', error)
      }
    }, 100)

    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true))
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false))

    return () => {
      clearTimeout(focusTimeout)
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [screenState])

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setErrors((prev) => ({ ...prev, email: 'Email is required' }))
      return false
    }
    if (!emailRegex.test(email)) {
      setErrors((prev) => ({ ...prev, email: 'Please enter a valid email address' }))
      return false
    }
    setErrors((prev) => ({ ...prev, email: null }))
    return true
  }

  const validateOTP = (otp: string): boolean => {
    if (!otp) {
      setErrors((prev) => ({ ...prev, otp: 'Verification code is required' }))
      return false
    }
    if (otp.length !== 6) {
      setErrors((prev) => ({ ...prev, otp: 'Please enter a valid 6-digit code' }))
      return false
    }
    setErrors((prev) => ({ ...prev, otp: null }))
    return true
  }

  const handleEmailChange = (text: string) => {
    setEmail(text)
    if (errors.email) {
      validateEmail(text)
    }
  }

  const handleOTPChange = (text: string) => {
    // Only allow numbers
    const numbersOnly = text.replace(/[^0-9]/g, '')
    setOtp(numbersOnly)
    if (errors.otp) {
      validateOTP(numbersOnly)
    }
  }

  const handleGoToTermsofService = () => {
    customHaptics.success()
    Linking.openURL('https://top.fun/terms')
  }

  const handleGoToPrivacyPolicy = () => {
    customHaptics.success()
    Linking.openURL('https://top.fun/privacy')
  }

  const handleSendOTP = async () => {
    customHaptics.success()
    console.log('handleSendOTP')
    if (!validateEmail(email)) {
      customHaptics.error()
      console.log('validateEmail failed')
      return
    }

    customHaptics.tap()
    try {
      console.log('handleSendOTP try')
      setIsSendingCode(true)

      await sendCode({ email })
      console.log('sendCode done')
      setScreenState('OTP_INPUT')
    } catch (error) {
      customHaptics.error()
      console.log('sendCode error', error)
      setErrors((prev) => ({
        ...prev,
        email: 'Failed to send verification code. Please try again.',
      }))
    } finally {
      setIsSendingCode(false)
    }
  }

  const handleVerifyOTP = async () => {
    customHaptics.softTap()
    console.log('handleVerifyOTP')
    if (!validateOTP(otp)) {
      customHaptics.error()
      console.log('validateOTP failed')
      return
    }

    customHaptics.tap()
    try {
      console.log('handleVerifyOTP try')
      setIsVerifyingCode(true)

      await loginWithCode({
        email,
        code: otp,
      })
      console.log('loginWithCode done')
    } catch (error) {
      customHaptics.error()
      console.log('loginWithCode error', error)
      setErrors((prev) => ({
        ...prev,
        otp: 'Invalid verification code. Please try again.',
      }))
    } finally {
      setIsVerifyingCode(false)
    }
  }

  const handleBackToEmail = () => {
    customHaptics.success()
    setScreenState('EMAIL_INPUT')
    setOtp('')
    setErrors((prev) => ({ ...prev, otp: null }))
  }

  const isEmailInputDisabled = !email || !isAgreed || isLoading
  const isOTPInputDisabled = !otp || isLoading

  if (isLoading) {
    return (
      <View className="flex items-center justify-center flex-1 gap-4 bg-top-blue">
        <CText isExpanded weight="bold" className="text-xl text-white font-sf-bold">
          Loading...
        </CText>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    )
  }

  return (
    <ParentView
      containerStyle={{
        paddingHorizontal: PARENT_VIEW_HORIZONTAL_PADDING,
        backgroundColor: '#0174E7',
      }}
    >
      <Pressable onPress={Keyboard.dismiss} className="flex-col items-center justify-between flex-1 px-4 py-8 ">
        <View className="flex-col items-center justify-start flex-1 max-w-sm">
          {screenState === 'EMAIL_INPUT' ? (
            <>
              <View className={`flex-col  items-center justify-start ${keyboardVisible ? 'pt-4' : 'pt-16'}`}>
                <CText isExpanded weight="bold" className="text-xl text-title" style={{ fontFamily: 'SfProRounded' }}>
                  What's your email address?
                </CText>
                <Spacer size={12} />
                {!keyboardVisible && (
                  <>
                    <CText
                      isExpanded
                      weight="regular"
                      style={{
                        fontFamily: 'SfProRoundedMedium',
                        fontSize: 18,
                      }}
                      className="text-center text-title"
                    >
                      We'll send you a verification code
                    </CText>
                    <Spacer size={36} />
                  </>
                )}
              </View>

              <View className="w-full">
                <View className="flex flex-row items-center justify-start w-full space-x-3">
                  <CTextInput
                    inputRef={inputRef}
                    value={email}
                    onChangeText={handleEmailChange}
                    placeholder="me@gmail.com"
                    selectionColor={'#FFFFFF'}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="done"
                    autoCorrect={false}
                    onSubmitEditing={handleSendOTP}
                    placeholderTextColor={Colors.inputPlaceholderInnerLight}
                    style={{
                      borderRadius: 12,
                      color: Colors.inputPlaceholderLight,
                      backgroundColor: Colors.inputInnerLight,
                      fontFamily: 'SfProRounded',
                      fontSize: 14,
                      fontWeight: '700',
                      lineHeight: 18,
                      letterSpacing: 0.437,
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                    }}
                    weight="medium"
                    className="flex-shrink w-full h-12 text-base"
                  />

                  <FunButton
                    variant="orange"
                    onPress={handleSendOTP}
                    disabled={isEmailInputDisabled}
                    loading={isSendingCode}
                  >
                    Send
                  </FunButton>

                  {/* <Pressable
                    onPress={handleSendOTP}
                    disabled={isEmailInputDisabled}
                    className={`flex-shrink-0 rounded-2xl flex flex-row justify-center items-center h-12 bg-white px-6
                    ${isEmailInputDisabled ? 'opacity-40' : 'opacity-100'}
                    ${isLoadingAuthStatus ? 'opacity-40' : 'opacity-100'}
                  `}
                  >
                    {isLoadingAuthStatus ? (
                      <ActivityIndicator size="small" color="black" />
                    ) : (
                      <CText
                        isExpanded
                        weight="black"
                        className="text-[18px]"
                        style={{
                          color: Colors.buttonBackgroundLight,
                          fontFamily: 'SfProRounded',
                        }}
                      >
                        Send
                      </CText>
                    )}
                  </Pressable> */}
                </View>

                {errors.email && (
                  <CText className="p-2 mt-2 ml-2 text-lg text-orange-300 font-sf-regular" weight="regular">
                    {errors.email}
                  </CText>
                )}
              </View>

              <Spacer size={14} />

              <View className="flex flex-row items-start justify-start w-full pl-2 space-x-2">
                <Pressable
                  onPress={() => {
                    customHaptics.success()
                    setIsAgreed((prev) => !prev)
                  }}
                  className={`h-5 w-5 rounded flex flex-col justify-center items-center p-2 mt-1
                  ${isAgreed ? 'bg-white' : 'bg-transparent'}
                `}
                  style={{
                    borderWidth: 1,
                    borderColor: Colors.backgroundLight,
                  }}
                >
                  <Icon icon="tick" size={12} color="black" style={{ opacity: isAgreed ? 1 : 0 }} />
                </Pressable>
                <View className="flex flex-row flex-wrap justify-start items-center space-x-0.5 text-white">
                  <CText weight="regular" className="text-base text-white">
                    I agree to the
                  </CText>
                  <Pressable
                    onPress={handleGoToTermsofService}
                    className="flex flex-col items-center justify-start border-b border-white"
                  >
                    <CText weight="regular" className="text-base text-white">
                      Terms of Service
                    </CText>
                  </Pressable>
                  <CText weight="regular" className="text-base text-white">
                    and
                  </CText>
                  <Pressable
                    onPress={handleGoToPrivacyPolicy}
                    className="flex flex-col items-center justify-start border-b border-white"
                  >
                    <CText weight="regular" className="text-base text-white">
                      Privacy Policy
                    </CText>
                  </Pressable>
                </View>
              </View>
            </>
          ) : (
            <>
              <View className={`flex-col items-center justify-start ${keyboardVisible ? 'pt-4' : 'pt-16'}`}>
                <CText isExpanded weight="bold" className="text-xl text-title" style={{ fontFamily: 'SfProRounded' }}>
                  Enter verification code
                </CText>
                <Spacer size={12} />
                {!keyboardVisible && (
                  <>
                    <CText
                      isExpanded
                      weight="regular"
                      style={{
                        fontFamily: 'SfProRoundedMedium',
                        fontSize: 18,
                      }}
                      className="text-center text-title"
                    >
                      {`We sent a code to\n${email}`}
                    </CText>
                    <Spacer size={36} />
                  </>
                )}
              </View>

              <View className="w-full ">
                <View className="flex flex-row items-center justify-start w-full space-x-3">
                  <CTextInput
                    inputRef={otpInputRef}
                    value={otp}
                    onChangeText={handleOTPChange}
                    placeholder="******"
                    selectionColor={'#FFFFFF'}
                    keyboardType="number-pad"
                    returnKeyType="done"
                    maxLength={6}
                    onSubmitEditing={handleVerifyOTP}
                    placeholderTextColor={Colors.inputPlaceholderInnerLight}
                    style={{
                      borderRadius: 12,
                      color: Colors.inputPlaceholderLight,
                      backgroundColor: Colors.inputInnerLight,
                      fontFamily: 'SfProRounded',
                      fontSize: 18,
                      fontWeight: '700',
                      lineHeight: 24,
                      letterSpacing: 8,
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      textAlign: 'center',
                    }}
                    weight="medium"
                    className="flex-shrink w-full h-12 text-base"
                  />
                  {/* <Pressable
                    onPress={handleVerifyOTP}
                    disabled={isOTPInputDisabled}
                    className={`flex-shrink-0 rounded-2xl flex flex-row justify-center items-center h-12 bg-white px-6
                    ${isOTPInputDisabled ? 'opacity-40' : 'opacity-100'}
                    ${isLoadingAuthStatus ? 'opacity-40' : 'opacity-100'}
                  `}
                  >
                    {isLoadingAuthStatus ? (
                      <ActivityIndicator size="small" color="black" />
                    ) : (
                      <CText
                        isExpanded
                        weight="black"
                        className="text-[18px]"
                        style={{
                          color: Colors.buttonBackgroundLight,
                          fontFamily: 'SfProRounded',
                        }}
                      >
                        Verify
                      </CText>
                    )}
                  </Pressable> */}

                  <FunButton
                    variant="orange"
                    onPress={handleVerifyOTP}
                    disabled={isOTPInputDisabled}
                    loading={isVerifyingCode}
                  >
                    Verify
                  </FunButton>
                </View>

                {errors.otp && (
                  <CText className="mt-2 ml-2 text-red-500" weight="regular">
                    {errors.otp}
                  </CText>
                )}
              </View>

              <Spacer size={20} />

              <View className="flex flex-col items-center justify-center w-full space-x-1 ">
                <CText weight="regular" className="text-base text-white">
                  Didn't receive the code?
                </CText>
                <Pressable onPress={handleBackToEmail} className="flex flex-col items-center justify-start">
                  <CText weight="medium" className="text-base text-white ">
                    Try again
                  </CText>
                </Pressable>
              </View>
            </>
          )}
        </View>

        {/* Back to socials button */}
        <View className="w-full ">
          {screenState === 'OTP_INPUT' && (
            <>
              <FunButton variant="default" onPress={handleBackToEmail}>
                Back to email
              </FunButton>
              <Spacer size={12} />
            </>
          )}

          <FunButton variant="outline" onPress={() => {
            customHaptics.tap()
            router.navigate('/privy-social-auth')
          }}>
            Back to socials
          </FunButton>
        </View>

        {/* <FunButton variant="orange">Sign up</FunButton> */}
      </Pressable>
    </ParentView>
  )
}
