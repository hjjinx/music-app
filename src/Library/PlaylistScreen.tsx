import React from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  AsyncStorage,
  Dimensions,
} from 'react-native';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import TrackPlayer from 'react-native-track-player';

import Styles from '../Styles/Home';
import Colors from '../Styles/Colors';
import {ListItem} from 'react-native-elements';
import playSong from '../misc/playSong';
import {getBestFormat} from '../misc/ytdl-wrapper';

export default class PlaylistScreen extends React.Component {
  state = {
    title: '',
    createdOn: '',
    tracks: [],
  };
  componentDidMount() {
    console.log(this.props.navigation.getParam('playlists'));
    this.setState({...this.props.navigation.getParam('playlists')});
  }
  onClickPlay = async href => {
    try {
      await playSong(href);
    } catch (err) {
      console.log('Error in playing song');
      console.log(err);
      alert('There was an error! Please try again');
    }
  };
  startPlaylist = async () => {
    try {
      await playSong(this.state.tracks[0].href);
    } catch (err) {
      console.log('Error in playing song');
      console.log(err);
      alert('There was an error! Please try again');
    }
    for (let i = 1; i < this.state.tracks.length; i++) {
      const href = this.state.tracks[i].href;
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
  render() {
    console.log(this.state);
    const tracksToRender = this.state.tracks.map((track, i) => (
      <ListItem
        key={i}
        title={track.title}
        titleStyle={{color: Colors.textPrimary}}
        subtitle={track.artist}
        subtitleStyle={{color: Colors.textSecondary}}
        bottomDivider
        onPress={() => this.onClickPlay(track.href)}
        leftAvatar={{source: {uri: track.image}}}
        // rightElement={
        //   <Icon
        //     name="md-more"
        //     style={{
        //       paddingLeft: 30,
        //       paddingVertical: 10,
        //       color: 'grey',
        //       marginRight: 0,
        //       paddingRight: 7,
        //     }}
        //     size={20}
        //     color={Colors.textPrimary}
        //     onPress={() =>
        //       this.props.navigation.navigate('Menu', {
        //         image: res.img,
        //         title: res.title,
        //         artist: res.artist,
        //         href: res.href,
        //       })
        //     }
        //   />
        // }
        containerStyle={{
          backgroundColor: Colors.backgroundPrimary,
        }}
        contentContainerStyle={{
          backgroundColor: Colors.backgroundPrimary,
          // color: 'white',
        }}
      />
    ));
    return (
      <View style={[Styles.container, {flex: 1}]}>
        <View style={{height: 70, backgroundColor: Colors.backgroundSecondary}}>
          <Image
            source={require('../Images/Spotiboi.png')}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              flex: 1,
              width: null,
              height: null,
              resizeMode: 'contain',
            }}
          />
        </View>
        <View
          style={{
            backgroundColor: Colors.backgroundPrimary,
            height: Dimensions.get('window').height,
          }}>
          <View style={{flex: 1, marginTop: 30, justifyContent: 'flex-start'}}>
            <IconMaterial
              name="play"
              style={{
                color: Colors.textPrimary,
                textAlign: 'center',
                marginBottom: 10,
              }}
              size={40}
              onPress={this.startPlaylist}
            />
            <View>
              <Text
                style={[
                  {
                    fontSize: 25,
                    textAlign: 'center',
                    color: Colors.textPrimary,
                    marginBottom: 5,
                  },
                ]}>
                {this.state.title}
              </Text>
              <Text
                style={[
                  {
                    fontSize: 15,
                    textAlign: 'center',
                    color: Colors.textSecondary,
                  },
                ]}>
                {'Created on ' + this.state.createdOn}
              </Text>
            </View>
            <View style={{marginTop: 10}}>
              <ScrollView>
                {this.state.tracks.length > 0 ? (
                  tracksToRender
                ) : (
                  <View
                    style={{
                      justifyContent: 'center',
                      width: Dimensions.get('window').width,
                    }}>
                    <Text
                      adjustsFontSizeToFit={true}
                      style={{
                        color: Colors.textPrimary,
                        textAlign: 'center',
                        fontSize: 15,
                      }}>
                      You haven't added any songs to this playlist yet!
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
