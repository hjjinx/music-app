import { Text, View } from "react-native";
import React from "react";

import Styles from "../Styles/Home";

export default class HomeScreen extends React.Component {
  render() {
    return (
      <View style={Styles.container}>
        <Text style={Styles.text}>Search Screen</Text>
      </View>
    );
  }
}
