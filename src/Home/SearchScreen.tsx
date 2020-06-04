import {
  View,
  Text,
  Keyboard,
  PermissionsAndroid,
  TouchableHighlight,
  Image,
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
  constructor(props) {
    super(props);
  }
  state = {
    searchQuery: '',
    searching: false,
    results: [],
    downloading: new Array(20).map(i => null),
    // Will contain list of all the songs present in the /Music folder
    downloaded: [],
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
    const downloaded = await RNFetchBlob.fs.ls(RNFetchBlob.fs.dirs.MusicDir);
    this.setState({downloaded});
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
      }, 500);
    });
  };

  onClickDownload = async (href, i) => {
    let newDownloading = Object.assign({}, this.state.downloading);
    newDownloading[i] = 0;
    this.setState({downloading: newDownloading});

    if (
      !(await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      )) ||
      !(await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ))
    )
      await requestFilePermission();
    let info;
    try {
      info = await ytdl.getInfo(href);
    } catch (err) {
      let newDownloading = Object.assign({}, this.state.downloading);
      delete newDownloading[i];
      this.setState({downloading: newDownloading});
      alert('There was an error in fetching the details! Please try again');
      console.log('Error in getting song info');
      console.log(err);
      return;
    }

    let bestFormat;
    if (!info.formats) return;
    let maxBitrate = 0;
    for (let format of info.formats)
      if (format.audioBitrate && format.audioBitrate > maxBitrate) {
        maxBitrate = format.audioBitrate;
        bestFormat = format;
      }
    // alert(
    //   `Download started! The audio file is being saved in ${
    //     RNFetchBlob.fs.dirs.MusicDir
    //   }/${info.title}.mp3`,
    // );
    RNFetchBlob.config({
      path: RNFetchBlob.fs.dirs.MusicDir + `/${info.title}.mp3`,
    })
      .fetch('GET', bestFormat.url)
      .progress({interval: 10}, (received, total) => {
        let newDownloading = Object.assign({}, this.state.downloading);
        newDownloading[i] = received / total;
        // this.prog[i].animateTo(
        //   (received * 100) / total,
        //   2000,
        //   Easing.bezier(0, 0.62, 1, 1),
        // );
        this.setState({downloading: newDownloading});
      })
      .then(res => {
        let newDownloading = Object.assign({}, this.state.downloading);
        delete newDownloading[i];
        let newDownloaded = this.state.downloaded.slice();
        newDownloaded.push(info.title + '.mp3');
        this.setState({downloading: newDownloading, downloaded: newDownloaded});
        alert(`${info.title} has been sucessfully downloaded!`);
      })
      .catch(err => {
        let newDownloading = Object.assign({}, this.state.downloading);
        delete newDownloading[i];
        this.setState({downloading: newDownloading});
        alert('There was an error with the download! Please try again');
        console.log('Song not downloaded completely');
        console.error(err);
      });

    // console.log(maxBitrate);
    // console.log(bestFormat);
    // start downloading the song here
    // /storage/emulated/0/
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
            this.state.downloading[i] != null ? (
              <ProgCircle
                progress={this.state.downloading[i]}
                unfilledColor={Colors.backgroundSecondary}
                showsText={true}
                // ref={elem => (this.prog[i] = elem)}
                size={20}
                thickness={1}
                textStyle={{fontSize: 8}}
                formatText={progress => `${Math.round(progress * 100)}`}
                borderWidth={0}
                color={Colors.textPrimary}
                animated={true}
              />
            ) : (
              // this.state.downloaded.includes(res.title + '.mp3') ? (
              //   <Icon
              //     name="ios-cloud-done"
              //     size={20}
              //     onPress={() => this.onClickPlay(res.href, i)}
              //     style={{paddingLeft: 30, paddingVertical: 10, color: 'grey'}}
              //   />
              // ) : (
              //   <Icon
              //     name="ios-cloud-download"
              //     size={20}
              //     onPress={() => this.onClickDownload(res.href, i)}
              //     style={{paddingLeft: 30, paddingVertical: 10, color: 'grey'}}
              //   />
              // )
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
            )
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
