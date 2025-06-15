import { FlatList, Pressable, View } from 'react-native'

import { customHaptics } from '@/utils'

import { PARENT_VIEW_HORIZONTAL_PADDING } from '@/constants'

import { CText, Icon } from '@/components'

const headings = [
  {
    id: '1',
    label: 'Coins Held',
    icon: 'coins',
  },
  {
    id: '2',
    label: 'Coins Created',
    icon: 'add',
  },
  {
    id: '3',
    label: 'Notifications',
    icon: 'notification',
  },
]

type TabCarouselProps = {
  selectedTab: string
  setSelectedTab: (selectedTab: string) => void
}

export const TabCarousel = ({ selectedTab, setSelectedTab }: TabCarouselProps) => {
  const handlePress = (id: string) => {
    customHaptics.softTap()
    setSelectedTab(id)
  }

  const renderTipItem = ({ item }: { item: (typeof headings)[0] }) => (
    <Pressable
      key={item.id}
      onPress={() => handlePress(item.id)}
      style={{
        marginRight: PARENT_VIEW_HORIZONTAL_PADDING,
      }}
      className={`h-full flex flex-row justify-center items-center rounded-full space-x-2 px-5 border border-[#424147]
        ${selectedTab === item.id ? 'bg-[#424147] opacity-100' : 'bg-transparent opacity-70'}
        `}
    >
      <Icon
        // @ts-ignore-next-line
        icon={item.icon}
        size={16}
        className="text-white"
      />
      <CText weight="regular" className="text-white text-base">
        {item.label}
      </CText>
    </Pressable>
  )

  return (
    <View className="flex flex-col justify-start items-center w-full h-12">
      <FlatList
        contentContainerStyle={{
          paddingLeft: PARENT_VIEW_HORIZONTAL_PADDING,
        }}
        data={headings}
        keyExtractor={(item) => item.id}
        renderItem={renderTipItem}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  )
}
