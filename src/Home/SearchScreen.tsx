import {View, Text, Keyboard} from 'react-native';
import React from 'react';
import {SearchBar, colors} from 'react-native-elements';
import {ListItem} from 'react-native-elements';

import Colors from '../Styles/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import {search} from '../SearchAPI/youtubeSearch';
import {ScrollView} from 'react-native-gesture-handler';
import styles from '../Styles/Home';

export default class HomeScreen extends React.Component {
  state = {
    searchQuery: '',
    searching: false,
    results: [],
  };
  searchTimeout;

  onSearchChange = () => {
    clearTimeout(this.searchTimeout);
    const q = this.state.searchQuery;
    if (q.length < 2) {
      this.setState({searching: false, results: []});
      return;
    }
    this.setState({searching: true});
    this.searchTimeout = setTimeout(async () => {
      // send the request for searching YouTube here
      const results = await search(q);
      this.setState({searching: false, results});
    }, 300);
  };

  onClickDownload = href => {
    // start downloading the song here
  };

  render() {
    let listOfItems;
    if (this.state.results.length > 0)
      listOfItems = this.state.results.map((res, i) => (
        <ListItem
          key={i}
          title={res.title}
          titleStyle={{color: Colors.textPrimary}}
          subtitle={res.artist}
          subtitleStyle={{color: Colors.textSecondary}}
          bottomDivider
          leftAvatar={
            <Icon
              name="ios-play"
              size={20}
              // onPress={this.onClickDownload}
              style={{color: 'white'}}
            />
          }
          rightElement={
            <Icon
              name="ios-cloud-download"
              size={20}
              onPress={this.onClickDownload}
              style={{paddingLeft: 30, paddingVertical: 10, color: 'grey'}}
            />
          }
          containerStyle={{
            backgroundColor: Colors.backgroundPrimary,
          }}
          contentContainerStyle={{
            backgroundColor: Colors.backgroundPrimary,
            // color: 'white',
          }}
        />
      ));
    else
      listOfItems = (
        <View style={[styles.container, {paddingTop: 100}]}>
          <Text style={{color: Colors.textPrimary}}>No Results found!</Text>
        </View>
      );
    return (
      <View style={{flex: 1}}>
        <SearchBar
          placeholder="Search for..."
          onChangeText={value => this.setState({searchQuery: value})}
          value={this.state.searchQuery}
          onChange={this.onSearchChange}
          showLoading={this.state.searching}
          inputStyle={{
            padding: 0,
            margin: 0,
            height: 10,
          }}
          containerStyle={{
            paddingVertical: 15,
            margin: 0,
            // height: 100,
            backgroundColor: Colors.backgroundSecondary,
            borderBottomWidth: 0,
          }}
          inputContainerStyle={{
            borderRadius: 100,
            padding: 0,
            margin: 0,
            backgroundColor: 'white',
            // height: 10,
          }}
        />
        <View style={{backgroundColor: Colors.backgroundPrimary, flex: 1}}>
          <ScrollView
            onScrollBeginDrag={Keyboard.dismiss}
            keyboardShouldPersistTaps="never">
            {listOfItems}
          </ScrollView>
          {/* <View
            style={{
              backgroundColor: Colors.mainBackground,
              height: 1000,
            }}
          /> */}
        </View>
      </View>
    );
  }
}
