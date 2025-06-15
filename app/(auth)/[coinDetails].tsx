import { CText, Icon } from '@/components'
import { Colors } from '@/constants'
import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons'
import { useHeaderHeight } from '@react-navigation/elements'
import { useNavigation } from '@react-navigation/native'
import React, { useLayoutEffect, useState } from 'react'
import { Image, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { LineChart } from 'react-native-gifted-charts'

import { customHaptics } from '@/utils'
import SocialsListView from '@/components/(tokens)/coinDetails/SocialsListView'
import { useRouter } from 'expo-router'
import { DetailsListView } from '@/components/(tokens)/coinDetails/DetailsListView'
import AboutView from '@/components/(tokens)/coinDetails/Aboutview'

const data = [
  { value: 90 },
  { value: 20 },
  { value: 30 },
  { value: 20 },
  { value: 40 },
  { value: 30 },
  { value: 40 },
  { value: 60 },
  { value: 40 },
  { value: 50 },
  { value: 30 },
  { value: 50 },
  { value: 30 },
  { value: 40 },
]

const timePeriods = [
  {
    id: 'Hour',
    label: 'H',
  },
  {
    id: 'Day',
    label: 'D',
  },
  {
    id: 'Week',
    label: 'W',
  },
  {
    id: 'Month',
    label: 'M',
  },
  {
    id: 'Year',
    label: 'Y',
  },
]

const CoinDetails = () => {
  const headerHeight = useHeaderHeight()
  const navigation = useNavigation()
  const router = useRouter()
  const [chartDimensions, setChartDimensions] = useState({
    width: 0,
    height: 0,
  })

  const [selectedTimePeriod, setSelectedTimePeriod] = useState('Hour')

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '$FWOG',
      headerTitleAlign: 'center',
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            router.back()
          }}
          style={styles.iconButton}
        >
          <Icon icon="backArrow" size={16} color="#979797" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <Pressable hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }} onPress={() => console.log('Right action')}>
          <Icon icon="uploadBlueIcon" size={20} color={Colors.buttonBlue} />
        </Pressable>
      ),
    })
  }, [navigation])

  return (
    <View style={[styles.container, { paddingTop: headerHeight }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-col items-start justify-start flex-1 w-full">
          <View
            style={{
              borderRadius: 12,
            }}
            className="flex-col items-center justify-start flex-1 w-full "
          >
            <View
              className="w-full px-5 h-36"
              style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <View>
                <View className="bg-transparent " style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                  <CText
                    style={{
                      fontFamily: 'SfProRounded',
                      color: '#B3B3B3',
                      fontSize: 28,
                    }}
                  >
                    $
                  </CText>
                  <CText
                    style={{
                      fontFamily: 'SfProRoundedHeavy',
                      fontSize: 28,
                    }}
                  >
                    0.0849
                  </CText>
                  <CText
                    style={{
                      fontFamily: 'SfProRoundedHeavy',
                      color: '#E7E7E7',
                      marginBottom: 8,
                      marginHorizontal: 3,
                      fontSize: 18,
                    }}
                  >
                    .
                  </CText>
                  <CText
                    style={{
                      fontFamily: 'SfProRoundedHeavy',
                      color: '#14D443',
                      fontSize: 12,
                    }}
                  >
                    7.2%
                  </CText>
                  <FontAwesome6 name="caret-up" color={'#14D443'} />
                </View>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Image style={{ width: 48, height: 48, marginTop: 20 }} />
                <CText
                  style={{
                    fontFamily: 'SfProRoundedHeavy',
                    color: '#B0B0B0',
                    marginBottom: 8,
                    marginHorizontal: 3,
                    fontSize: 18,
                  }}
                >
                  $0.0912
                </CText>
              </View>
            </View>
            <View
              className="items-center justify-start flex-1 w-full overflow-hidden"
              style={{ height: 200 }}
              onLayout={(event) => {
                const { width, height } = event.nativeEvent.layout
                setChartDimensions({ width: width, height: height })
              }}
            >
              <LineChart
                data={data}
                disableScroll
                // size
                height={chartDimensions.height}
                width={chartDimensions.width}
                adjustToWidth={true}
                // line
                curved={true}
                thickness={4}
                color="#FE6301"
                hideDataPoints
                // axes
                startFillColor="#FE6301"
                endFillColor="#FFFFFF"
                areaChart={true}
                hideOrigin
                hideYAxisText
                hideRules
                yAxisLabelWidth={0}
                initialSpacing={0}
                endSpacing={20}
                xAxisColor="transparent"
                yAxisColor="transparent"
                pointerConfig={{
                  pointerColor: '#FE6301',
                  pointerStripColor: '#FE6301',
                  pointerStripWidth: 2,
                  pointerStripHeight: chartDimensions.height,
                  radius: 6,
                  pointerLabelWidth: 100,
                  pointerLabelHeight: 40,
                  stripOverPointer: true, // Add this
                  pointerVanishDelay: 0, // Add this
                  pointerEvents: 'auto', // Add this
                  persistPointer: false, // Add this
                  activatePointersOnLongPress: false,
                  autoAdjustPointerLabelPosition: true,
                  pointerLabelComponent: (items: any) => {
                    return (
                      <View className="px-3 py-2 rounded-lg bg-white/10 backdrop-blur-lg">
                        <CText weight="medium" className="text-base text-white">
                          {items[0].value}
                        </CText>
                      </View>
                    )
                  },
                }}
              />
            </View>
            <View className="flex flex-row items-center justify-between w-full h-16 px-5 py-4 space-x-3 bg-transparent">
              {timePeriods.map((timePeriod) => (
                <Pressable
                  key={timePeriod.id}
                  onPress={() => {
                    customHaptics.softTap()
                    setSelectedTimePeriod(timePeriod.id)
                  }}
                  className={`flex-1 h-full flex flex-col justify-center items-center rounded-full
                    ${selectedTimePeriod === timePeriod.id ? 'bg-[#DAEBFB]' : 'bg-transparent'}
                    `}
                >
                  <CText
                    weight="bold"
                    className={`text-sm
                    ${selectedTimePeriod === timePeriod.id ? 'color-[#0174E7]' : 'color-[#8DB9EA]'}
                    `}
                  >
                    {timePeriod.label}
                  </CText>
                </Pressable>
              ))}
            </View>
            <View style={styles.divider} />
            <DetailsListView />
            <View style={[styles.divider, { marginTop: 20 }]} />
            <AboutView />
            <View style={[styles.divider, { marginTop: 20 }]} />
            <SocialsListView />
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '88%',
          alignSelf: 'center',
          marginTop: 10,
        }}
      >
        <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
          <Icon size={20} icon="dogeCoinIcon" />
          <CText
            style={{
              fontFamily: 'SfProRoundedHeavy',
              color: '#9E9E9E',
            }}
          >
            YOU HAVE:
          </CText>
        </View>
        <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
          <CText
            style={{
              fontFamily: 'SfProRoundedHeavy',
              color: '#0174E7',
            }}
          >
            403.23
          </CText>
          <MaterialCommunityIcons name="approximately-equal" size={16} color="#82B8F3" />
          <CText
            style={{
              fontFamily: 'SfProRoundedHeavy',
              color: '#0174E7',
            }}
          >
            $34.2
          </CText>
        </View>
      </View>
      <View
        className="flex-row items-center justify-between w-full gap-2 mt-1 mb-3"
        style={{
          width: '90%',
          alignSelf: 'center',
        }}
      >
        <Pressable
          onPress={() => {}}
          className="flex-row items-center justify-center flex-1 py-2"
          style={{
            backgroundColor: '#0061FF',
            borderRadius: 12,
          }}
        >
          <CText
            isExpanded
            weight="black"
            className="text-[14px] text-white ml-2"
            style={{ fontFamily: 'SfProRounded' }}
          >
            Buy
          </CText>
        </Pressable>

        <Pressable
          onPress={() => {}}
          className="flex-row items-center justify-center flex-1 py-2"
          style={{
            backgroundColor: '#DBE5F0',
            borderRadius: 12,
          }}
        >
          <CText
            isExpanded
            weight="black"
            className="text-[14px] text-[#0174E7] ml-2"
            style={{ fontFamily: 'SfProRounded' }}
          >
            Sell
          </CText>
        </Pressable>
      </View>
    </View>
  )
}

export default CoinDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  iconButton: {
    padding: 5,
  },
  divider: { height: 1, width: '90%', backgroundColor: '#F0F0F0', marginHorizontal: 20, marginBottom: 20 },
})
