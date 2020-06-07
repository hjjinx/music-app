import {
  View,
  Text,
  Keyboard,
  PermissionsAndroid,
  AsyncStorage,
} from 'react-native';
import React from 'react';
import {SearchBar} from 'react-native-elements';
import {ListItem} from 'react-native-elements';
import ytdl from 'ytdl-core';
import RNFetchBlob from 'rn-fetch-blob';
// import '@react-native-community/art';
import {Circle as ProgCircle} from 'react-native-progress';
import TrackPlayer from 'react-native-track-player';
import Icon from 'react-native-vector-icons/Ionicons';
import {ScrollView} from 'react-native-gesture-handler';

import Colors from '../Styles/Colors';
import {search} from '../misc/youtubeSearch.js';
import styles from '../Styles/Home';
import {getBestFormat} from '../misc/ytdl-wrapper';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    tabBarVisible: false,
  };

  constructor(props) {
    super(props);
  }
  state = {
    searchQuery: '',
    searching: false,
    results: [],
    downloading: new Array(20).map(i => null),
  };
  searchTimeout;
  searchInput: SearchBar;

  async componentDidMount() {
    if (
      !(await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      )) ||
      !(await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ))
    )
      await requestFilePermission();
    this.searchInput.focus();
  }

  onSearchChange = value => {
    this.setState({searchQuery: value}, () => {
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
      }, 50);
    });
  };

  onClickPlay = async (href, i) => {
    try {
      await TrackPlayer.setupPlayer();
      TrackPlayer.updateOptions({
        ratingType: TrackPlayer.RATING_5_STARS,
        capabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE,
          TrackPlayer.CAPABILITY_STOP,
          TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        ],

        // An array of capabilities that will show up when the notification is in the compact form on Android
        compactCapabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE,
          TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        ],
      });

      const {bestFormat, info} = await getBestFormat(href);
      console.log(info);

      await TrackPlayer.add({
        id: '1',
        url: bestFormat.url,
        title: info.title,
        artist: info.author.name,
        artwork: this.state.results[i].img,
        duration: info.length_seconds,
      });

      await TrackPlayer.play();
    } catch (err) {
      console.log('Erorr in playing sound...');
      console.log(err);
    }
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
          onPress={() => this.onClickPlay(res.href, i)}
          leftAvatar={{source: {uri: res.img}}}
          rightElement={
            <Icon
              name="md-more"
              style={{
                paddingLeft: 30,
                paddingVertical: 10,
                color: 'grey',
                marginRight: 0,
                paddingRight: 7,
              }}
              size={20}
              color={Colors.textPrimary}
              onPress={() =>
                this.props.navigation.navigate('Menu', {
                  avatar: res.img,
                  title: res.title,
                  artist: res.artist,
                  href: res.href,
                })
              }
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
          ref={input => (this.searchInput = input)}
          onChangeText={value => this.onSearchChange(value)}
          value={this.state.searchQuery}
          showLoading={this.state.searching}
          // inputStyle={{
          //   padding: 0,
          //   margin: 0,
          //   height: 10,
          // }}
          // containerStyle={{
          //   paddingVertical: 15,
          //   margin: 0,
          //   // height: 100,
          //   backgroundColor: Colors.backgroundSecondary,
          //   borderBottomWidth: 0,
          // }}
          // inputContainerStyle={{
          //   borderRadius: 100,
          //   padding: 0,
          //   margin: 0,
          //   backgroundColor: 'white',
          //   // height: 10,
          // }}

          inputStyle={{
            padding: 0,
            margin: 0,
            height: 10,
          }}
          containerStyle={{
            paddingTop: 15,
            margin: 0,
            height: 75,
            backgroundColor: Colors.backgroundSecondary,
            borderBottomWidth: 0,
          }}
          inputContainerStyle={{
            borderRadius: 100,
            padding: 0,
            margin: 0,
            backgroundColor: 'white',
            height: 40,
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
  } catch (err) {
    console.warn(err);
  }
};
