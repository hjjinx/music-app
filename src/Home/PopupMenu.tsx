import React from 'react';
import {
  View,
  Image,
  Text,
  TouchableHighlight,
  PermissionsAndroid,
  AsyncStorage,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import TrackPlayer from 'react-native-track-player';
import RNFetchBlob from 'rn-fetch-blob';
import ytdl from 'ytdl-core';

import searchStyles from '../Styles/Search';
import Colors from '../Styles/Colors';
import {getBestFormat} from '../misc/ytdl-wrapper';
import playSong from '../misc/playSong';
import {MainContext} from '../DataStore/Main';

export default class PopupMenu extends React.Component {
  static navigationOptions = {
    tabBarVisible: false,
  };
  state = {downloadStatus: 0, liked: false};
  async componentDidMount() {
    const downloaded = await RNFetchBlob.fs.ls(RNFetchBlob.fs.dirs.MusicDir);
    let likedSongs = JSON.parse(await AsyncStorage.getItem('liked_songs'));
    // Unike song if already liked
    for (const song of likedSongs) {
      if (song.href === this.props.navigation.getParam('href'))
        this.setState({liked: true});
    }
    if (downloaded.includes(this.props.navigation.getParam('title') + '.webm'))
      this.setState({downloadStatus: 2});
  }

  addToQueue = async () => {
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
    let state = await TrackPlayer.getState();
    let trackId = await TrackPlayer.getCurrentTrack();
    let trackObject = await TrackPlayer.getTrack(trackId);
    const {bestFormat, info} = await getBestFormat(
      this.props.navigation.getParam('href'),
    );

    let streamUrl = '';
    const downloaded = await RNFetchBlob.fs.ls(RNFetchBlob.fs.dirs.MusicDir);
    if (downloaded.includes(info.title + '.webm'))
      streamUrl =
        'file://' + RNFetchBlob.fs.dirs.MusicDir + '/' + info.title + '.webm';
    else streamUrl = bestFormat.url;

    await TrackPlayer.add({
      id: '0',
      url: streamUrl,
      title: this.props.navigation.getParam('title'),
      artist: this.props.navigation.getParam('artist'),
      artwork: this.props.navigation.getParam('image'),
    });
    TrackPlayer.play();
    console.log(await TrackPlayer.getQueue());
  };

  like = async likedSongs => {
    try {
      /*
      likedSong obejct: {title: string, href: string, image: string, artist: string}
      */
      // Unlike song if already liked

      for (let i = 0; i < likedSongs.length; i++) {
        const song = likedSongs[i];
        if (song.href === this.props.navigation.getParam('href')) {
          likedSongs.splice(i, 1);
          this.setState({liked: false});
          await AsyncStorage.setItem('liked_songs', JSON.stringify(likedSongs));
          return likedSongs;
        }
      }
      // Like song if not already liked
      likedSongs.unshift({
        href: this.props.navigation.getParam('href'),
        title: this.props.navigation.getParam('title'),
        image: this.props.navigation.getParam('image'),
        artist: this.props.navigation.getParam('artist'),
      });
      this.setState({liked: true});

      await AsyncStorage.setItem('liked_songs', JSON.stringify(likedSongs));
      return likedSongs;
    } catch (err) {
      console.log('Error in liking song..');
      console.log(err);
      alert('There was an error! Please try again.');
    }
  };

  onClickDownload = async () => {
    if (this.state.downloadStatus === 2 || this.state.downloadStatus === 1)
      return;
    this.setState({downloadStatus: 1});
    // let newDownloading = Object.assign({}, this.state.downloading);
    // newDownloading[i] = 0;
    // this.setState({downloading: newDownloading});

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
      info = await ytdl.getInfo(this.props.navigation.getParam('href'));
    } catch (err) {
      // let newDownloading = Object.assign({}, this.state.downloading);
      // delete newDownloading[i];
      // this.setState({downloading: newDownloading});
      alert('There was an error in fetching the details! Please try again');
      console.log('Error in getting song info');
      console.log(err);
      return;
    }
    let bestFormat;
    if (!info.formats) return;
    let maxBitrate = 0;
    for (let format of info.formats)
      if (
        format.audioBitrate &&
        format.audioBitrate > maxBitrate &&
        format.mimeType == 'audio/webm; codecs="opus"'
      ) {
        maxBitrate = format.audioBitrate;
        bestFormat = format;
      }
    if (!bestFormat) {
      console.log('Unable to get a good format');
      alert('Unable to download!');
      return;
    }
    RNFetchBlob.config({
      addAndroidDownloads: {
        useDownloadManager: true,
        path: RNFetchBlob.fs.dirs.MusicDir + `/${info.title}.webm`,
        // Optional, override notification setting (default to true)
        notification: true,
        // Optional, but recommended since android DownloadManager will fail when
        // the url does not contains a file extension, by default the mime type will be text/plain
        title: `Downloading ${this.props.navigation.getParam('title')}`,
        mime: 'audio/webm',
        description: this.props.navigation.getParam('artist'),
        mediaScannable: true,
      },
    })
      .fetch('GET', bestFormat.url)
      // .progress({interval: 10}, (received, total) => {
      //   let newDownloading = Object.assign({}, this.state.downloading);
      //   newDownloading[i] = received / total;
      //   // this.prog[i].animateTo(
      //   //   (received * 100) / total,
      //   //   2000,
      //   //   Easing.bezier(0, 0.62, 1, 1),
      //   // );
      //   this.setState({downloading: newDownloading});
      // })
      .then(res => {
        this.setState({downloadStatus: 2});
      })
      .catch(err => {
        alert('There was an error with the download! Please try again');
        console.log('Song not downloaded completely');
        console.error(err);
      });
  };

  onClickPlay = async updateRecentlyPlayed => {
    try {
      await playSong(
        this.props.navigation.getParam('href'),
        updateRecentlyPlayed,
      );
    } catch (err) {
      console.log('Error in playing song');
      console.log(err);
      alert('There was an error! Please try again');
    }
  };
  render() {
    return (
      <TouchableHighlight
        onPress={() => this.props.navigation.goBack()}
        style={searchStyles.overlay}>
        <View style={searchStyles.fromBottom}>
          <View style={{alignItems: 'center'}}>
            <Image
              source={{uri: this.props.navigation.getParam('image')}}
              style={searchStyles.image}
            />
            <Text
              style={{
                color: Colors.textPrimary,
                marginBottom: 5,
                fontSize: 25,
                textAlign: 'center',
              }}>
              {this.props.navigation.getParam('title').length > 50
                ? this.props.navigation.getParam('title').substr(0, 50) + '...'
                : this.props.navigation.getParam('title')}
            </Text>
            <Text
              style={{
                color: Colors.textSecondary,
                marginBottom: 20,
                fontSize: 20,
              }}>
              {this.props.navigation.getParam('artist')}
            </Text>
          </View>
          <MainContext.Consumer>
            {context => {
              return (
                <React.Fragment>
                  <TouchableHighlight
                    onPress={() =>
                      this.props.navigation.navigate('Playlist', {
                        href: this.props.navigation.getParam('href'),
                        title: this.props.navigation.getParam('title'),
                        artist: this.props.navigation.getParam('artist'),
                        image: this.props.navigation.getParam('image'),
                      })
                    }>
                    <View style={searchStyles.option}>
                      <View style={{flex: 1, alignItems: 'flex-end'}}>
                        <Icon
                          name="playlist-add"
                          style={{
                            color: 'grey',
                            marginRight: 10,
                          }}
                          size={20}
                          color={Colors.textPrimary}
                        />
                      </View>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            color: Colors.textPrimary,
                            textAlign: 'center',
                            fontSize: 17,
                          }}>
                          Add to Playlist
                        </Text>
                      </View>
                      <View style={{flex: 1}} />
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight onPress={this.addToQueue}>
                    <View style={[searchStyles.option]}>
                      <View style={{flex: 1, alignItems: 'flex-end'}}>
                        <Icon
                          name="queue"
                          style={{
                            color: 'grey',
                            marginRight: 10,
                          }}
                          size={20}
                          color={Colors.textPrimary}
                        />
                      </View>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            color: Colors.textPrimary,
                            textAlign: 'center',
                            fontSize: 17,
                          }}>
                          Add to Queue
                        </Text>
                      </View>
                      <View style={{flex: 1}} />
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight
                    onPress={async () => {
                      const likedSongs = await this.like(context.liked);
                      context.updateLiked(likedSongs);
                    }}>
                    <View style={[searchStyles.option]}>
                      <View style={{flex: 1, alignItems: 'flex-end'}}>
                        <AntIcon
                          name={this.state.liked ? 'heart' : 'hearto'}
                          style={{
                            color: this.state.liked ? 'white' : 'grey',
                            marginRight: 10,
                          }}
                          size={20}
                          color={Colors.textPrimary}
                        />
                      </View>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            color: Colors.textPrimary,
                            textAlign: 'center',
                            fontSize: 17,
                          }}>
                          Like{this.state.liked ? 'd' : ''}
                        </Text>
                      </View>
                      <View style={{flex: 1}} />
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight onPress={this.onClickDownload}>
                    <View style={searchStyles.option}>
                      <View style={{flex: 1, alignItems: 'flex-end'}}>
                        <Icon
                          name={
                            this.state.downloadStatus === 2
                              ? 'cloud-done'
                              : 'cloud-download'
                          }
                          style={{
                            color:
                              this.state.downloadStatus === 0
                                ? 'grey'
                                : 'white',
                            marginRight: 10,
                          }}
                          size={20}
                          color={Colors.textPrimary}
                        />
                      </View>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            color: Colors.textPrimary,
                            textAlign: 'center',
                            fontSize: 17,
                          }}>
                          Download
                          {this.state.downloadStatus === 2
                            ? 'ed'
                            : this.state.downloadStatus === 0
                            ? ''
                            : 'ing'}
                        </Text>
                      </View>
                      <View style={{flex: 1}} />
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight
                    onPress={() => {
                      this.onClickPlay(context.updateRecentlyPlayed);
                    }}>
                    <View style={searchStyles.option}>
                      <View style={{flex: 1, alignItems: 'flex-end'}}>
                        <Icon
                          name={'play-arrow'}
                          style={{
                            color: 'grey',
                            marginRight: 10,
                          }}
                          size={20}
                          color={Colors.textPrimary}
                        />
                      </View>
                      <View style={{flex: 1}}>
                        <Text
                          style={{
                            color: Colors.textPrimary,
                            textAlign: 'center',
                            fontSize: 17,
                          }}>
                          Play
                        </Text>
                      </View>
                      <View style={{flex: 1}} />
                    </View>
                  </TouchableHighlight>
                </React.Fragment>
              );
            }}
          </MainContext.Consumer>
        </View>
      </TouchableHighlight>
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
