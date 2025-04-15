import React, { useState } from 'react'
import { Pressable, View } from 'react-native'
import { LineChart } from 'react-native-gifted-charts'

import { customHaptics } from '@/utils'

import { CText } from '@/components'

const data = [
  { value: 50 },
  { value: 80 },
  { value: 90 },
  { value: 70 },
  { value: 20 },
  { value: 40 },
  { value: 30 },
  { value: 60 },
]

const timePeriods = [
  {
    id: 'live',
    label: 'LIVE',
  },
  {
    id: '4h',
    label: '4H',
  },
  {
    id: '1d',
    label: '1D',
  },
  {
    id: 'max',
    label: 'MAX',
  },
]

export const CoinChart = () => {
  const [chartDimensions, setChartDimensions] = useState({
    width: 0,
    height: 0,
  })

  const [selectedTimePeriod, setSelectedTimePeriod] = useState('1d')

  return (
    <View className="flex-1 flex-col justify-start items-start w-full">
      <View
        style={{
          borderRadius: 12,
        }}
        className="bg-[#1C1C1E] border border-[#39383D] flex-1 flex-col justify-start items-center w-full"
      >
        <View className="h-[25%] w-full bg-transparent px-5 pt-6 flex flex-col justify-start items-start space-y-0.5">
          <CText isExpanded weight="semibold" className="text-white text-4xl">
            $48.46
          </CText>
          <View className="flex flex-row justify-start items-center">
            <CText isExpanded weight="medium" className="text-[#EBFF92] text-base">
              $48.46 (38.88%)
            </CText>
          </View>
        </View>
        <View
          className="flex-1 flex flex-col justify-start items-center w-full overflow-hidden"
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
            color="white"
            hideDataPoints
            // axes
            startFillColor="#242426"
            endFillColor="#242426"
            areaChart={true}
            hideOrigin
            hideYAxisText
            hideRules
            yAxisLabelWidth={0}
            initialSpacing={0}
            endSpacing={0}
            xAxisColor="transparent"
            yAxisColor="transparent"
            pointerConfig={{
              pointerColor: 'white',
              pointerStripColor: 'white',
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
                  <View className="bg-white/10 px-3 py-2 rounded-lg backdrop-blur-lg">
                    <CText weight="medium" className="text-white text-base">
                      {items[0].value}
                    </CText>
                  </View>
                )
              },
            }}
          />
        </View>
        <View className="flex flex-row justify-between items-center w-full bg-transparent px-5 h-[18%] space-x-3 py-4">
          {timePeriods.map((timePeriod) => (
            <Pressable
              key={timePeriod.id}
              onPress={() => {
                customHaptics.softTap()
                setSelectedTimePeriod(timePeriod.id)
              }}
              className={`flex-1 h-full flex flex-col justify-center items-center rounded-full border border-[#424147]
                ${selectedTimePeriod === timePeriod.id ? 'bg-[#424147]' : 'bg-transparent'}
                `}
            >
              <CText weight="bold" className="text-white text-sm">
                {timePeriod.label}
              </CText>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  )
}
