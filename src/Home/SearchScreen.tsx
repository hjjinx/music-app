import { Text, View } from "react-native";
import React from "react";
import { SearchBar } from "react-native-elements";

import Styles from "../Styles/Home";

export default class HomeScreen extends React.Component {
  state = {
    searchQuery: "",
    searching: false,
  };
  searchTimeout;
  onSearchChange = () => {
    const q = this.state.searchQuery;
    this.searchTimeout = setTimeout(() => {
      // send the request for searching YouTube here
    }, 2000);
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <SearchBar
          placeholder="Type Here..."
          onChangeText={(value) => this.setState({ searchQuery: value })}
          value={this.state.searchQuery}
          onChange={this.onSearchChange}
          showLoading={this.state.searching}
        />
        <View style={Styles.container}>
          <Text style={Styles.text}>Search Screen</Text>
        </View>
      </View>
    );
  }
}
