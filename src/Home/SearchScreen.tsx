import {View} from 'react-native';
import React from 'react';
import {SearchBar, colors} from 'react-native-elements';
import {ListItem} from 'react-native-elements';

import Colors from '../Styles/Colors';
import Icon from 'react-native-vector-icons/Ionicons';

export default class HomeScreen extends React.Component {
  state = {
    searchQuery: '',
    searching: false,
    results: [
      {
        title: 'DripReport - Skechers (Lyrics) ft. Tyga',
        artist: '7clouds',
        href: 'https://www.youtube.com/watch?v=6lTL-wz4hMA',
      },
      {
        title: 'DripReport - Skechers (Lyrics) ft. Tyga',
        artist: '7clouds',
        href: 'https://www.youtube.com/watch?v=6lTL-wz4hMA',
      },
      {
        title: 'DripReport - Skechers (Lyrics) ft. Tyga',
        artist: '7clouds',
        href: 'https://www.youtube.com/watch?v=6lTL-wz4hMA',
      },
      {
        title: 'DripReport - Skechers (Lyrics) ft. Tyga',
        artist: '7clouds',
        href: 'https://www.youtube.com/watch?v=6lTL-wz4hMA',
      },
    ],
  };
  searchTimeout;

  onSearchChange = () => {
    const q = this.state.searchQuery;
    if (q.length < 2) return;
    this.setState({searching: true});
    this.searchTimeout = setTimeout(() => {
      // send the request for searching YouTube here
      this.setState({searching: false});
    }, 2000);
  };

  onClickDownload = href => {
    // start downloading the song here
  };

  render() {
    const listOfItems = this.state.results.map((res, i) => (
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
          backgroundColor: Colors.mainBackground,
        }}
        contentContainerStyle={{
          backgroundColor: Colors.mainBackground,
          // color: 'white',
        }}
      />
    ));
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
            // padding: 0,
            margin: 0,
            // height: 100,
            backgroundColor: Colors.mainBackground,
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
        <View style={{backgroundColor: Colors.mainBackground}}>
          {listOfItems}
          <View
            style={{
              backgroundColor: Colors.mainBackground,
              height: 1000,
            }}
          />
        </View>
      </View>
    );
  }
}
