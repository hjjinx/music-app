import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import Icon from "react-native-vector-icons/Ionicons";

import HomeStack from "./src/Home/HomeStack";

class LibraryScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Library</Text>
      </View>
    );
  }
}

const MainTabNavigator = createBottomTabNavigator(
  {
    Main: HomeStack,
    Library: LibraryScreen,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let IconComponent = Icon;
        let iconName;
        if (routeName === "Main") {
          iconName = focused ? "ios-home" : "ios-home";
          // Sometimes we want to add badges to some icons.
          // You can check the implementation below.
        } else if (routeName === "Library") {
          iconName = focused ? "ios-list-box" : "ios-list";
        }

        // You can return any component that you like here!
        return <IconComponent name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: "green",
      inactiveTintColor: "gray",
      showLabel: false,
      style: {
        backgroundColor: "black",
        borderBottomLeftRadius: 1,
        borderColor: "green",
        paddingBottom: 10,
      },
    },
  }
);

export default createAppContainer(MainTabNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
    color: "green",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "green",
  },
});
