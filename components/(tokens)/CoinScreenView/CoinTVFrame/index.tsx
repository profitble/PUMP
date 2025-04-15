import React from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'

type CoinTVFrameProps = {
  pairAddress: string
}

export const CoinTVFrame = ({ pairAddress }: CoinTVFrameProps) => {
  return (
    <View className="flex-1 w-full h-[600px]">
      <WebView
        source={{
          uri: `https://birdeye.so/tv-widget/${pairAddress}?chain=solana&viewMode=pair&chartInterval=15&chartType=Candle&chartTimezone=Etc%2FUTC&chartLeftToolbar=hide&theme=dark`,
        }}
        style={{ flex: 1 }}
        allowFileAccess
        domStorageEnabled
        javaScriptEnabled
        allowsFullscreenVideo
        allowUniversalAccessFromFileURLs
        mediaPlaybackRequiresUserAction={false}
        originWhitelist={['*']}
      />
    </View>
  )
}
