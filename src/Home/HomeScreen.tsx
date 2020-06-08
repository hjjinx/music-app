import {
  Text,
  View,
  Image,
  AsyncStorage,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import {SearchBar} from 'react-native-elements';
import ytdl from 'ytdl-core';

import Styles from '../Styles/Home';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../Styles/Colors';

export default class HomeScreen extends React.Component {
  state = {
    likedSongs: [],
    isLoading: true,
  };
  async componentDidMount() {
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
  }
  openMenu = (i: number) => {
    const data = this.state.likedSongs[i];
    this.props.navigation.navigate('Menu', data);
  };
  render() {
    let likedSongsToRender = this.state.likedSongs.map((elem, i) => (
      <TouchableHighlight onPress={() => this.openMenu(i)} key={i}>
        <View style={Styles.track}>
          <Image style={Styles.image} source={{uri: elem.image}} />
          <Text style={Styles.trackName}>{elem.title.substr(0, 30)}</Text>
        </View>
      </TouchableHighlight>
    ));

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
              onFocus={() => this.props.navigation.navigate('Search')}
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
            <View style={Styles.category}>
              <View style={Styles.heading}>
                <Text style={Styles.headingText}>Liked Songs</Text>
              </View>
              <View style={Styles.musicList}>
                <ScrollView horizontal={true}>{likedSongsToRender}</ScrollView>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}
