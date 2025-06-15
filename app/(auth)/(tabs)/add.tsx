import { useFundSolanaWallet, usePrivy } from '@privy-io/expo'
import { decode } from 'base64-arraybuffer'
import * as FileSystem from 'expo-file-system'
import * as ImageManipulator from 'expo-image-manipulator'
import * as ImagePicker from 'expo-image-picker'
import React, { useEffect, useRef, useState } from 'react'
import {
  Alert,
  Dimensions,
  Image,
  Keyboard,
  Linking,
  Pressable,
  StatusBar,
  TextInput,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { customHaptics, QueryKeys, supabase, TableNames } from '@/utils'

import { useAuth, useCreateToken, useCreateWallet } from '@/hooks'

import { Colors } from '@/constants'

import { CText, CTextInput, Icon, ParentView, Spacer, TokenCreatedToast } from '@/components'
import { FunButton } from '@/components/ui/fun-button'
import { toast, ToastPosition } from '@backpackapp-io/react-native-toast'
import { useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'

const resizeImage = async (uri: string) => {
  const result = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: 400 } }], { compress: 0.5 })
  return result.uri
}

export default function AddTokenScreen() {
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showLaunchSuccessModal, setShowLaunchSuccessModal] = useState(false)
  const [imagePath, setImagePath] = useState<string | null>(null)
  const [tokenName, setTokenName] = useState('')
  const [tokenTicker, setTokenTicker] = useState('')
  const [tokenDescription, setTokenDescription] = useState('')
  const [isBusy, setIsBusy] = useState(false)

  const nameInputRef = useRef<TextInput>(null)
  const tickerInputRef = useRef<TextInput>(null)
  const descriptionInputRef = useRef<TextInput>(null)
  const tiktokLinkInputRef = useRef<TextInput>(null)
  const twitterLinkInputRef = useRef<TextInput>(null)
  const webLinkInputRef = useRef<TextInput>(null)

  const { user } = useAuth()

  const { mutateAsync, isPending: isCreatingToken } = useCreateToken()
  const { fundWallet } = useFundSolanaWallet()
  const { isReady, user: privyUser } = usePrivy()
  const { mutateAsync: createWallet } = useCreateWallet()

  useEffect(() => {
    if (user) {
      setImagePath(null)
    }
  }, [user])

  const queryClient = useQueryClient()

  const handleImageUpload = async () => {
    customHaptics.tap()

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'You need to enable photo library access to upload images.', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open Settings',
          style: 'destructive',
          onPress: () => {
            Linking.openSettings()
          },
        },
      ])
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled) {
      setImagePath(result.assets[0].uri)
    }
  }

  const handleCreateToken = async () => {
    customHaptics.tap()
    setIsBusy(true)

    try {
      console.log('[Token Creation] Compressing image...')
      const photoCompressed = await resizeImage(imagePath!)
      console.log('[Token Creation] Converting image to base64...')
      const photoBase64 = await FileSystem.readAsStringAsync(photoCompressed, {
        encoding: 'base64',
      })
      console.log('[Token Creation] Image processing complete')

      // Generate a unique filename
      const fileExt = imagePath!.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `token-images/${fileName}`

      // Upload to Supabase Storage using base64-arraybuffer
      console.log('[Token Creation] Uploading to Supabase Storage...')
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('tokens') // Your bucket name
        .upload(filePath, decode(photoBase64), {
          contentType: `image/${fileExt}`,
          upsert: false,
        })

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('tokens').getPublicUrl(filePath)

      console.log('[Token Creation] Image uploaded successfully:', publicUrl)

      const userId = await supabase.auth.getSession().then((session) => {
        console.log('session', JSON.stringify(session.data, null, 2))
        return session.data.session?.user.id
      })

      // Add this after the tokenData is created
      const createdTokenData = {
        name: tokenName,
        symbol: tokenTicker,
        description: tokenDescription,
        image_url: publicUrl,
        user_id: userId,
        graduation_target: 100,
        volume_24h: 0,
        approved: false,
      }

      // Insert into created_tokens table
      const { data: createdToken, error: createdTokenError } = await supabase
        .from(TableNames.PRESALE_TOKENS)
        .insert([createdTokenData])
        .select()
        .single()

      if (createdTokenError) {
        throw new Error(`Database error: ${createdTokenError.message}`)
      }

      if (createdToken) {
        setTokenName('')
        setTokenTicker('')
        setTokenDescription('')
        setImagePath(null)
        // setShowLaunchSuccessModal(true)

        queryClient.invalidateQueries({
          queryKey: [QueryKeys.TRENDING_PRESALES],
        })
      }

      toast.success('Token submitted', {
        duration: 3000,
        disableShadow: true,
        width: Dimensions.get('screen').width * 0.9,
        isSwipeable: true,
        position: ToastPosition.TOP,
        customToast: () => {
          return <TokenCreatedToast tokenName={tokenName} />
        },
      })
      router.push('/(auth)/(tabs)/(coin)')
    } catch (error) {
      console.error('[Token Creation] Failed to process image or create token:', error)
      Alert.alert('Token Creation Failed', 'Failed to upload image or create token. Please try again.', [
        { text: 'OK' },
      ])
    } finally {
      setIsBusy(false)
    }
  }

  const isCreateCoinDisabled = !imagePath || !tokenName || !tokenTicker || !tokenDescription
  const { width, height } = useWindowDimensions()
  const isSmallScreen = width < 768

  return (
    <ParentView>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        <Spacer size={isSmallScreen ? 10 : 20} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: isSmallScreen ? 15 : 20,
            paddingTop: isSmallScreen ? 10 : 20,
          }}
        >
          <View style={{ flex: 1 }} />
          <View style={{ position: 'absolute', left: 0, right: 0, alignItems: 'center' }}>
            <CText
              isExpanded
              weight="semibold"
              style={{
                lineHeight: isSmallScreen ? 40 : 50,
                fontSize: isSmallScreen ? 20 : 24,
                color: Colors.titleLight,
                fontFamily: 'SfProRounded',
              }}
            >
              Launcher
            </CText>
          </View>
          <Pressable
            onPress={() =>{
              customHaptics.tap()
              setShowInfoModal(true)
              }}
            style={{
              position: 'relative',
              top: -8,
              backgroundColor: '#F5F4EE',
              borderRadius: 50,
              padding: isSmallScreen ? 6 : 10,
            }}
          >
            <Icon icon="dogeCoinIcon" size={isSmallScreen ? 20 : 24} />
          </Pressable>
        </View>
        <Spacer size={8} />

        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: showInfoModal ? 100 : 10,
            }}
            extraHeight={100}
            enableOnAndroid={true}
            enableAutomaticScroll={true}
          >
            <Spacer size={20} />
            <View
              className="flex w-full mx-auto lg:max-w-lg"
              style={{ alignItems: 'center', paddingHorizontal: isSmallScreen ? 15 : 20 }}
            >
              {imagePath ? (
                <Pressable
                  onPress={handleImageUpload}
                  style={{ overflow: 'hidden', borderRadius: 50, height: 100, width: 100 }}
                >
                  <Image
                    source={{ uri: imagePath }}
                    style={{ width: '100%', height: '100%', borderRadius: 50 }}
                    resizeMode="cover"
                  />
                </Pressable>
              ) : (
                <Pressable
                  onPress={handleImageUpload}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 50,
                    height: 100,
                    width: 100,
                    backgroundColor: Colors.inputInnerLight,
                  }}
                >
                  <Icon icon="launcherProfile" size={36} color={Colors.icon} />
                </Pressable>
              )}

              <Spacer size={20} />

              <View className="flex flex-col items-start justify-start w-full">
                <CText weight="bold" className="text-base" style={{ fontFamily: 'SfProRounded', fontSize: 15.6 }}>
                  NAME
                </CText>
                <Spacer size={6} />
                <CTextInput
                  inputRef={nameInputRef}
                  value={tokenName}
                  onChangeText={setTokenName}
                  onSubmitEditing={() => tickerInputRef.current?.focus()}
                  returnKeyType="next"
                  numberOfLines={1}
                  placeholder="TOPCOIN"
                  placeholderTextColor={Colors.inputPlaceholderInnerLight}
                  style={{
                    borderRadius: 15.5,
                    color: Colors.inputPlaceholderLight,
                    backgroundColor: Colors.inputInnerLight,
                    fontFamily: 'SfProRounded',
                    fontSize: 14,
                    fontWeight: '700',
                    lineHeight: 14,
                    letterSpacing: 0.437,
                    paddingTop: 15,
                    paddingBottom: 10,
                    paddingLeft: 15,
                    height: 45.77,
                    textAlignVertical: 'center',
                    width: '100%',
                  }}
                  weight="medium"
                  className="w-full h-12 text-base text-white bg-inputBackground border-inputBorder"
                />
              </View>
              <Spacer size={20} />
              <View className="flex flex-col items-start justify-start w-full">
                <CText weight="bold" className="text-base" style={{ fontFamily: 'SfProRounded', fontSize: 15.6 }}>
                  TICKER
                </CText>
                <Spacer size={6} />
                <CTextInput
                  inputRef={tickerInputRef}
                  value={tokenTicker}
                  onChangeText={setTokenTicker}
                  onSubmitEditing={() => descriptionInputRef.current?.focus()}
                  returnKeyType="next"
                  numberOfLines={1}
                  maxLength={10}
                  placeholder="$TOP"
                  placeholderTextColor={Colors.inputPlaceholderInnerLight}
                  style={{
                    borderRadius: 15.5,
                    color: Colors.inputPlaceholderLight,
                    backgroundColor: Colors.inputInnerLight,
                    fontFamily: 'SfProRounded',
                    fontSize: 14,
                    fontWeight: '700',
                    lineHeight: 14,
                    letterSpacing: 0.437,
                    paddingTop: 15,
                    paddingBottom: 10,
                    paddingLeft: 15,
                    height: 45.77,
                    textAlignVertical: 'center',
                    width: '100%',
                  }}
                  weight="medium"
                  className="w-full h-12 bg-inputBackground border-inputBorder"
                />
              </View>
              <Spacer size={20} />
              {/* Description */}
              <View className="flex flex-col items-start justify-start w-full">
                <CText weight="bold" className="text-base" style={{ fontFamily: 'SfProRounded', fontSize: 15.6 }}>
                  DESCRIPTION
                </CText>
                <Spacer size={6} />
                <CTextInput
                  inputRef={descriptionInputRef}
                  value={tokenDescription}
                  onChangeText={setTokenDescription}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  multiline
                  returnKeyType="done"
                  numberOfLines={4}
                  placeholder="TOPCOIN IS FUN"
                  verticalAlign="top"
                  placeholderTextColor={Colors.inputPlaceholderInnerLight}
                  style={{
                    borderRadius: 15.58,
                    color: Colors.inputPlaceholderLight,
                    backgroundColor: Colors.inputInnerLight,
                    fontFamily: 'SfProRounded',
                    fontSize: 14,
                    fontStyle: 'normal',
                    fontWeight: '700',
                    lineHeight: 14,
                    letterSpacing: 0.437,
                    paddingTop: 20, // Adjusted for vertical centering
                    paddingLeft: 15,
                    textAlignVertical: 'center', // Ensures vertical alignment (Android)
                    textAlign: 'left', // Keeps text left-aligned
                    height: 74.99,
                  }}
                  weight="medium"
                  className="w-full h-20 text-base text-white bg-inputBackground border-inputBorder"
                />
              </View>
              <Spacer size={30} />

              {/* <CButton2
              title="Launch coin"
              variant="blue"
              onPress={handleCreateToken}
              isBusy={isBusy}
              disabled={isCreateCoinDisabled || isCreatingToken}
            /> */}

              <FunButton
                onPress={handleCreateToken}
                variant="blue"
                fullWidth
                disabled={isCreateCoinDisabled || isCreatingToken}
                loading={isBusy}
                // style={{ marginTop: 20 }}
              >
                Launch coin
              </FunButton>
            </View>
            <Spacer size={20} />
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
      </View>
    </ParentView>
  )
}
