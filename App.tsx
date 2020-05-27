import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeStack from './src/Home/HomeStack';
import LibraryScreen from './src/Library/LibraryScreen';

import colors from './src/Styles/Colors';
import Colors from './src/Styles/Colors';

const MainTabNavigator = createBottomTabNavigator(
  {
    Main: HomeStack,
    Library: LibraryScreen,
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({focused, horizontal, tintColor}) => {
        const {routeName} = navigation.state;
        let iconName;
        if (routeName === 'Main') {
          iconName = focused ? 'ios-home' : 'ios-home';
          // Sometimes we want to add badges to some icons.
          // You can check the implementation below.
        } else if (routeName === 'Library') {
          iconName = focused ? 'ios-musical-notes' : 'ios-musical-notes';
        }

        // You can return any component that you like here!
        return <Icon name={iconName} size={30} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: colors.textPrimary,
      inactiveTintColor: colors.textSecondary,
      showLabel: false,
      style: {
        backgroundColor: Colors.backgroundSecondary,
        borderRadius: 0,
        borderTopColor: 'transparent',
        paddingBottom: 7,
      },
    },
  },
);

export default createAppContainer(MainTabNavigator);
