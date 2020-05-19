import {View, Text, Keyboard, PermissionsAndroid} from 'react-native';
import React from 'react';
import {SearchBar, colors} from 'react-native-elements';
import {ListItem} from 'react-native-elements';
import ytdl from 'ytdl-core';
import RNFetchBlob from 'react-native-fetch-blob';

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

  onClickDownload = async href => {
    let info = await ytdl.getInfo(href);
    let bestFormat;
    if (!info.formats) return;
    let maxBitrate = 0;
    for (let format of info.formats)
      if (format.audioBitrate && format.audioBitrate > maxBitrate) {
        maxBitrate = format.audioBitrate;
        bestFormat = format;
      }
    // console.log(info);
    // console.log(bestFormat);
    // console.log('Path: ');
    // console.log(RNFetchBlob.fs.dirs);
    RNFetchBlob.config({
      path:
        RNFetchBlob.fs.dirs.MusicDir + `/${info.title}.${bestFormat.container}`,
      fileCache: true,
    })
      .fetch('GET', bestFormat.url)
      .progress({count: 10}, (received, total) => {
        console.log('progress', received / total);
      })
      .then(res => {
        console.log(res);
        console.log('The file saved to ', res.path());
      })
      .catch(err => {
        alert('There was an error with the download! Please try again');
        console.error(err);
      });

    // console.log(maxBitrate);
    // console.log(bestFormat);
    // start downloading the song here
    // /storage/emulated/0/
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
              onPress={() => this.onClickDownload(res.href)}
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
    else if (!this.state.searching)
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

const requestFilePermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'SpotiBoi needs access to your files',
        message:
          'SpotiBoi needs access to your files so you can download songs.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
    } else {
      console.log('Camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'SpotiBoi needs access to your files',
        message:
          'SpotiBoi needs access to your files so you can download songs.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
    } else {
      console.log('Camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};
