import { Pressable, View } from 'react-native'

import { customHaptics } from '@/utils'

import { Colors, iconRegistry, PARENT_VIEW_HORIZONTAL_PADDING } from '@/constants'

import { CText, Icon } from '@/components'

const headings = [
  {
    id: '1',
    icon: 'coin' as keyof typeof iconRegistry,
    label: 'Pre-Sale',
  },
  {
    id: '2',
    icon: 'trending' as keyof typeof iconRegistry,
    label: 'Migrated',
  },
]

type FilterCarouselProps = {
  activeTab: string
  setActiveTab: React.Dispatch<React.SetStateAction<string>>
}

export const FilterCarousel = ({ activeTab, setActiveTab }: FilterCarouselProps) => {
  return (
    <View
      style={{
        paddingHorizontal: PARENT_VIEW_HORIZONTAL_PADDING,
      }}
      className="flex flex-row items-center justify-around w-full h-12 bg-white"
    >
      {headings.map((heading) => (
        <Pressable
          key={heading.id}
          onPress={() => {
            customHaptics.softTap()
            setActiveTab(heading.id)
          }}
          className={`h-full flex flex-col items-center gap-1
            ${activeTab === heading.id ? 'opacity-100 ' : 'opacity-50'}
            `}
        >
          <CText
            isExpanded
            weight="bold"
            className="text-sm text-black"
            style={{
              fontFamily: 'SfProRounded',
              color: Colors.buttonBlue,
              fontSize: 18,
            }}
          >
            {heading.label}
          </CText>
          {activeTab === heading.id && (
            <CText
              style={{
                color: Colors.buttonBlue,
                fontSize: 30,
                fontWeight: 'bold',
                lineHeight: 25,
              }}
            >
              •
            </CText>
          )}
        </Pressable>
      ))}
    </View>
  )
}
