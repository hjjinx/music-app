import {View, Text, Keyboard, PermissionsAndroid, Easing} from 'react-native';
import React from 'react';
import {SearchBar} from 'react-native-elements';
import {ListItem} from 'react-native-elements';
import ytdl from 'ytdl-core';
import RNFetchBlob from 'rn-fetch-blob';
import AnimatedProgressWheel from 'react-native-progress-wheel';

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
    downloading: {},
    // Will contain list of all the songs present in the /Music folder
    downloaded: [],
  };
  searchTimeout;
  searchInput: SearchBar;
  prog: AnimatedProgressWheel;
  async componentDidMount() {
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
    newDownloading[i] = true;
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
      alert('There was an error in fetching the details! Please try again');
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
        console.log('Progress' + (received * 100) / total);
        let newDownloading = Object.assign({}, this.state.downloading);
        newDownloading[i] = true;
        this.prog.animateTo(
          (received * 100) / total,
          2000,
          Easing.bezier(0, 0.62, 1, 1),
        );
        this.setState({downloading: newDownloading});
      })
      .then(res => {
        console.log(res);
        let newDownloading = Object.assign({}, this.state.downloading);
        delete newDownloading[i];
        let newDownloaded = this.state.downloaded.slice();
        newDownloaded.push(info.title + '.mp3');
        this.setState({downloading: newDownloading, downloaded: newDownloaded});
        alert(`${info.title} has been sucessfully downloaded!`);
        console.log('The file saved to ', res.path());
      })
      .catch(err => {
        let newDownloading = Object.assign({}, this.state.downloading);
        delete newDownloading[i];
        this.setState({downloading: newDownloading});
        alert('There was an error with the download! Please try again');
        console.error(err);
      });

    // console.log(maxBitrate);
    // console.log(bestFormat);
    // start downloading the song here
    // /storage/emulated/0/
  };

  onClickPlay = async (href, i) => {
    console.log('Will play now');
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
          leftAvatar={
            <Icon
              name="ios-play"
              size={20}
              onPress={() => this.onClickPlay(res.href, i)}
              style={{color: 'white'}}
            />
          }
          rightElement={
            this.state.downloading[i] ? (
              <AnimatedProgressWheel
                ref={elem => (this.prog = elem)}
                width={2}
                size={20}
                // progress={this.state.downloading[i].progress}
                color={Colors.textPrimary}
                backgroundColor={Colors.backgroundSecondary}
              />
            ) : this.state.downloaded.includes(res.title + '.mp3') ? (
              <Icon
                name="ios-cloud-done"
                size={20}
                onPress={() => this.onClickPlay(res.href, i)}
                style={{paddingLeft: 30, paddingVertical: 10, color: 'grey'}}
              />
            ) : (
              <Icon
                name="ios-cloud-download"
                size={20}
                onPress={() => this.onClickDownload(res.href, i)}
                style={{paddingLeft: 30, paddingVertical: 10, color: 'grey'}}
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
