import {
  Text,
  View,
  Image,
  AsyncStorage,
  TouchableHighlight,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import React from 'react';
import {SearchBar} from 'react-native-elements';
import ytdl from 'ytdl-core';

import Styles from '../Styles/Home';
import {ScrollView} from 'react-native-gesture-handler';
import Colors from '../Styles/Colors';

export default class HomeScreen extends React.Component {
  state = {
    likedSongs: [],
    recentlyPlayed: [],
    isLoading: true,
  };

  updateLikedSongs = async () => {
    if (!(await AsyncStorage.getItem('liked_songs'))) {
      await AsyncStorage.setItem('liked_songs', '[]');
      this.setState({likedSongs: [], isLoading: false});
      return;
    }

    const likedSongsHref = JSON.parse(
      await AsyncStorage.getItem('liked_songs'),
    );
    let likedSongs = [];
    for (let i = 0; i < likedSongsHref.length; i++) {
      const element = likedSongsHref[i];
      const data = await ytdl.getBasicInfo(element);
      likedSongs.push({
        title: data.title,
        href: element,
        image: data.player_response.videoDetails.thumbnail.thumbnails[2].url,
        artist: data.author.name,
      });
    }
    this.setState({likedSongs, isLoading: false});
    return likedSongs;
  };

  updateRecentlyPlayed = async () => {
    if (!(await AsyncStorage.getItem('recentlyPlayed'))) {
      await AsyncStorage.setItem('recentlyPlayed', '[]');
      this.setState({recentlyPlayed: [], isLoading: false});
      return;
    }

    const recentlyPlayedHref = JSON.parse(
      await AsyncStorage.getItem('recentlyPlayed'),
    );
    let recentlyPlayedSongs = [];
    for (let i = 0; i < recentlyPlayedHref.length; i++) {
      const element = recentlyPlayedHref[i];
      const data = await ytdl.getBasicInfo(element);
      recentlyPlayedSongs.push({
        title: data.title,
        href: element,
        image: data.player_response.videoDetails.thumbnail.thumbnails[2].url,
        artist: data.author.name,
      });
    }
    this.setState({recentlyPlayed: recentlyPlayedSongs, isLoading: false});
    return recentlyPlayedSongs;
  };

  async componentDidMount() {
    this.updateLikedSongs();
    this.updateRecentlyPlayed();
  }
  openMenuLikedSongs = (i: number) => {
    const data = this.state.likedSongs[i];
    this.props.navigation.navigate('Menu', data);
  };

  openMenuRecentlyPlayed = (i: number) => {
    const data = this.state.recentlyPlayed[i];
    this.props.navigation.navigate('Menu', data);
  };

  render() {
    let likedSongsToRender = this.state.likedSongs.map((elem, i) => (
      <TouchableHighlight onPress={() => this.openMenuLikedSongs(i)} key={i}>
        <View style={Styles.track}>
          <Image style={Styles.image} source={{uri: elem.image}} />
          <Text style={Styles.trackName}>{elem.title.substr(0, 30)}</Text>
        </View>
      </TouchableHighlight>
    ));

    console.log(this.state.recentlyPlayed);

    let recentlyPlayedToRender = this.state.recentlyPlayed.map((elem, i) => (
      <TouchableHighlight
        onPress={() => this.openMenuRecentlyPlayed(i)}
        key={i}>
        <View style={Styles.track}>
          <Image style={Styles.image} source={{uri: elem.image}} />
          <Text style={Styles.trackName}>{elem.title.substr(0, 30)}</Text>
        </View>
      </TouchableHighlight>
    ));
    console.log(recentlyPlayedToRender);

    return (
      <View style={{flex: 1}}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 8, backgroundColor: Colors.backgroundSecondary}}>
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
              flex: 10,
              // paddingBottom: 10,
              // paddingTop: 12,
              backgroundColor: Colors.backgroundSecondary,
            }}>
            {/* <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Search')}>
              <View style={{backgroundColor: Colors.backgroundSecondary}}>
                <Text
                  style={{
                    color: 'white',
                    padding: 10,
                    textAlign: 'center',
                    fontSize: 20,
                  }}>
                  <Icon name="ios-search" size={20} color={'white'} />
                  {'  '}Search
                </Text>
              </View>
            </TouchableOpacity> */}
            {/* <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Search')}> */}
            <SearchBar
              placeholder="Search for..."
              onFocus={() =>
                this.props.navigation.navigate('Search', {
                  updateLikedSongs: this.updateLikedSongs,
                })
              }
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
            {/* </TouchableOpacity> */}
          </View>
        </View>
        {this.state.isLoading ? (
          <ActivityIndicator
            style={{
              backgroundColor: Colors.backgroundPrimary,
              flex: 1,
              alignContent: 'center',
              justifyContent: 'center',
            }}
          />
        ) : (
          <View style={Styles.container}>
            <View
              style={{
                backgroundColor: Colors.backgroundPrimary,
              }}>
              <View style={Styles.category}>
                <View style={Styles.heading}>
                  <Text style={Styles.headingText}>Liked Songs</Text>
                </View>
                <View style={Styles.musicList}>
                  <ScrollView horizontal={true}>
                    {likedSongsToRender.length > 0 ? (
                      likedSongsToRender
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
                          You haven't liked any songs yet!
                        </Text>
                      </View>
                    )}
                  </ScrollView>
                </View>
              </View>
            </View>

            <View
              style={{
                backgroundColor: Colors.backgroundPrimary,
              }}>
              <View style={Styles.category}>
                <View style={Styles.heading}>
                  <Text style={Styles.headingText}>Recently Played</Text>
                </View>
                <View style={Styles.musicList}>
                  <ScrollView horizontal={true}>
                    {recentlyPlayedToRender.length > 0 ? (
                      recentlyPlayedToRender
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
                          You haven't played any songs yet!
                        </Text>
                      </View>
                    )}
                  </ScrollView>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}
