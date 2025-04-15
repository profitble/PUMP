import { CText, Icon } from '@/components/common'
import React from 'react'
import { View } from 'react-native'

const ListItem = ({ icon, label, value, style }: { icon: any; label: string; value: string; style?: any }) => {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '90%',
          alignSelf: 'center',
        },
        style,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {icon && <Icon icon={icon} size={16} />}
        <CText style={{ fontFamily: 'SfProRoundedBold', color: '#979797', fontSize: 14 }}>{label}</CText>
      </View>
      <CText style={{ fontFamily: 'SfProRoundedBold', color: '#010101' }}>{value}</CText>
    </View>
  )
}

export default ListItem
