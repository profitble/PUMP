import { CText } from '@/components/common'
import React from 'react'
import { View } from 'react-native'

const AboutView = () => {
  return (
    <View
      style={{
        width: '90%',
        backgroundColor: '#F7F7F7',
        borderWidth: 1,
        borderColor: '#EEEEEE',
        borderRadius: 20,
        padding: 20,
      }}
    >
      <CText style={{ fontFamily: 'SfProRoundedBold', color: '#979797', fontSize: 14, marginBottom: 10 }}>
        ABOUT $FWOG
      </CText>
      <CText style={{ fontFamily: 'SfProRoundedBold', fontSize: 14 }}>
        FWOG is a dumb little frog coin hopping around Solana, fueled by pure internet chaos. It’s what happens when
        frogs evolve past PEPE and embrace full liquidity warfare.
      </CText>
    </View>
  )
}

export default AboutView
