import React from 'react'
import { View } from 'react-native'
import ListItem from './ListItem'

export const DetailsListView = () => {
  return (
    <View
      style={{ width: '90%', backgroundColor: '#F7F7F7', borderWidth: 1, borderColor: '#EEEEEE', borderRadius: 20 }}
    >
      <ListItem icon={'marketCapIcon'} label="MARKET CAP" value="$128,531" style={{ marginVertical: 20 }} />
      <ListItem icon={'volumeIcon'} label="VOLUME" value="$43,289" style={{ marginVertical: 20 }} />
      <ListItem icon={'circulatingIcon'} label="CIRCULATING SUPPLY" value="23,549" style={{ marginVertical: 20 }} />
      <ListItem icon={'supplyIcon'} label="TOTAL SUPPLY" value="100,000" style={{ marginVertical: 20 }} />
      <ListItem icon={'createdIcon'} label="CREATED" value="100,000" style={{ marginVertical: 20 }} />
    </View>
  )
}
