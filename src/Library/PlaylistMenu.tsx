import React from 'react';
import {
  View,
  TouchableHighlight,
  Image,
  Text,
  AsyncStorage,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TrackPlayer from 'react-native-track-player';

import searchStyles from '../Styles/Search';
import Colors from '../Styles/Colors';
import {MainContext} from '../DataStore/Main';
import playSong from '../misc/playSong';
import {getBestFormat} from '../misc/ytdl-wrapper';

export default class PlaylistMenu extends React.Component {
  onClickPlay = async updateRecentlyPlayed => {
    const tracks = this.props.navigation.getParam('tracks');
    try {
      await playSong(tracks[0].href, updateRecentlyPlayed);
    } catch (err) {
      console.log('Error in playing song');
      console.log(err);
      alert('There was an error! Please try again');
    }
    for (let i = 1; i < tracks.length; i++) {
      const href = tracks[i].href;
      var {bestFormat, info} = await getBestFormat(href);
      await TrackPlayer.add({
        id: '1',
        url: bestFormat.url,
        title: info.title,
        artist: info.author.name,
        artwork: info.player_response.videoDetails.thumbnail.thumbnails[2].url,
        duration: parseInt(info.length_seconds),
      });
    }
  };
  onClickDelete = async (updatePlaylists, playlists) => {
    console.log(playlists);
    console.log(this.props.navigation.getParam('title'));
    for (let i = 0; i < playlists.length; i++) {
      const playlist = playlists[i];
      if (playlist.title === this.props.navigation.getParam('title'))
        playlists.splice(i, 1);
    }
    updatePlaylists(playlists);
    await AsyncStorage.setItem('playlists', JSON.stringify(playlists));
    this.props.navigation.goBack();
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
                fontSize: 20,
              }}>
              {'Created on: ' + this.props.navigation.getParam('createdOn')}
            </Text>
            <Text
              style={{
                color: Colors.textSecondary,
                marginBottom: 20,
                fontSize: 20,
              }}>
              {'Number of Tracks: ' +
                this.props.navigation.getParam('tracks').length}
            </Text>
          </View>
          <MainContext.Consumer>
            {context => {
              return (
                <React.Fragment>
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
                  <TouchableHighlight
                    onPress={() => {
                      this.onClickDelete(
                        context.updatePlaylists,
                        context.playlists,
                      );
                    }}>
                    <View style={searchStyles.option}>
                      <View style={{flex: 1, alignItems: 'flex-end'}}>
                        <Icon
                          name={'delete-forever'}
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
                          Delete
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
