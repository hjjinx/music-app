import React from 'react';
import {View, Image, Text, TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import TrackPlayer from 'react-native-track-player';

import searchStyles from '../Styles/Search';
import Colors from '../Styles/Colors';
import {getBestFormat} from '../misc/ytdl-wrapper';

export default class PopupMenu extends React.Component {
  addToPlaylist = () => {
    console.log('adding to playlist');
  };
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
    console.log(state);
    console.log(trackObject);
    const {bestFormat, info} = await getBestFormat(
      this.props.navigation.getParam('href'),
    );
    await TrackPlayer.add({
      id: '0',
      url: bestFormat.url,
      title: this.props.navigation.getParam('title'),
      artist: this.props.navigation.getParam('artist'),
      artwork: this.props.navigation.getParam('img'),
    });
    TrackPlayer.play();
    console.log('adding to queue.');
  };
  like = () => {
    console.log('Liking..');
  };
  render() {
    console.log(this.props.navigation.getParam('avatar'));
    return (
      <TouchableHighlight
        onPress={() => this.props.navigation.goBack()}
        style={searchStyles.overlay}>
        <View style={searchStyles.fromBottom}>
          <View style={{alignItems: 'center'}}>
            <Image
              source={{uri: this.props.navigation.getParam('avatar')}}
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
          <TouchableHighlight onPress={this.addToPlaylist}>
            <View
              style={[
                searchStyles.option,
                {borderBottomColor: '#777', borderBottomWidth: 1},
              ]}>
              <View style={{flex: 3, alignItems: 'flex-end'}}>
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
              <View style={{flex: 3}}>
                <Text
                  style={{
                    color: Colors.textPrimary,
                    textAlign: 'center',
                    fontSize: 17,
                  }}>
                  Add to Playlist
                </Text>
              </View>
              <View style={{flex: 3}} />
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.addToQueue}>
            <View
              style={[
                searchStyles.option,
                {borderBottomColor: '#777', borderBottomWidth: 1},
              ]}>
              <View style={{flex: 3, alignItems: 'flex-end'}}>
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
              <View style={{flex: 3}}>
                <Text
                  style={{
                    color: Colors.textPrimary,
                    textAlign: 'center',
                    fontSize: 17,
                  }}>
                  Add to Queue
                </Text>
              </View>
              <View style={{flex: 3}} />
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.like}>
            <View
              style={[
                searchStyles.option,
                {borderBottomColor: '#777', borderBottomWidth: 1},
              ]}>
              <View style={{flex: 3, alignItems: 'flex-end'}}>
                <AntIcon
                  name="hearto"
                  style={{
                    color: 'grey',
                    marginRight: 10,
                  }}
                  size={20}
                  color={Colors.textPrimary}
                />
              </View>
              <View style={{flex: 3}}>
                <Text
                  style={{
                    color: Colors.textPrimary,
                    textAlign: 'center',
                    fontSize: 17,
                  }}>
                  Like
                </Text>
              </View>
              <View style={{flex: 3}} />
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.like}>
            <View style={searchStyles.option}>
              <View style={{flex: 3, alignItems: 'flex-end'}}>
                <Icon
                  name="cloud-download"
                  style={{
                    color: 'grey',
                    marginRight: 10,
                  }}
                  size={20}
                  color={Colors.textPrimary}
                />
              </View>
              <View style={{flex: 3}}>
                <Text
                  style={{
                    color: Colors.textPrimary,
                    textAlign: 'center',
                    fontSize: 17,
                  }}>
                  Download
                </Text>
              </View>
              <View style={{flex: 3}} />
            </View>
          </TouchableHighlight>
        </View>
      </TouchableHighlight>
    );
  }
}
