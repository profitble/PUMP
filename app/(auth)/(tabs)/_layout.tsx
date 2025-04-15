import React from 'react'
import { Pressable, View, Dimensions } from 'react-native'
import { Tabs } from 'expo-router'

import { customHaptics } from '@/utils'

import { ICON_SIZE } from '@/constants'

import { Icon } from '@/components'
const { width, height } = Dimensions.get('window')

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: 'absolute',
          bottom: 26,
          backgroundColor: '#FAFAFA',
          transform: [{ translateX: width / 2 - 110 }],
          width: 220,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 20,
          height: 60,
          shadowColor: '#000',
          borderColor: '#EEEEEE',
          borderWidth: 2,
          // shadowOffset: {
          //   width: 0,
          //   height: 2,
          // },
          // shadowOpacity: 0.15,
          // shadowRadius: 1,
          elevation: 5,
        },

        tabBarButton: (props) => (
          <Pressable
            {...props}
            onPress={(e) => {
              customHaptics.softTap()
              props.onPress?.(e)
            }}
            style={{
              height: 60,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>{props.children}</View>
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen
        name="(coin)"
        options={{
          title: 'Home',
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => <Icon icon={focused ? 'homeSeleted' : 'home'} size={ICON_SIZE} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => <Icon icon={focused ? 'addSeleted' : 'add'} size={ICON_SIZE} />,
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          title: 'Profile',
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => <Icon icon={focused ? 'profileSeleted' : 'profile'} size={ICON_SIZE + 2} />,
        }}
      />
    </Tabs>
  )
}
