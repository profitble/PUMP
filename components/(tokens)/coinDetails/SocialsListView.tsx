import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ListItem from './ListItemSocial'

const SocialsListView = () => {
  return (
    <View style={{ width: '90%', backgroundColor: '#EEF5FD', borderWidth: 1, borderColor: "#DBE5F0", borderRadius: 20 }}>
      <ListItem
        icon={"websiteIcon"}
        label='WEBSITE'
        value='itsafwog.com'
        style={{ marginVertical: 20 }}
      />
      <ListItem
        icon={"xIcon"}
        label='VOLUME'
        value='@itsafwog.com'
        style={{ marginVertical: 20 }}
      />
      <ListItem
        icon={"telegramIcon"}
        label='TELEGRAM'
        value='@fwogsolana'
        style={{ marginVertical: 20 }}
      />
      <ListItem
        icon={"discordIcon"}
        label='DISCORD'
        value='@fwogsolana'
        style={{ marginVertical: 20 }}
      />
    </View>
  )
}

export default SocialsListView

const styles = StyleSheet.create({})