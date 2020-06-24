import {
  Text,
  View,
  Image,
  AsyncStorage,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import React from 'react';
import {SearchBar} from 'react-native-elements';

import Styles from '../Styles/Home';
import {ScrollView} from 'react-native-gesture-handler';
import Colors from '../Styles/Colors';
import {MainContext} from '../DataStore/Main';

export default class HomeScreen extends React.Component {
  state = {
    likedSongs: [],
    recentlyPlayed: [],
  };

  updateLikedSongs = async () => {
    if (!(await AsyncStorage.getItem('liked_songs'))) {
      await AsyncStorage.setItem('liked_songs', '[]');
      this.setState({likedSongs: []});
      return;
    }

    const likedSongs = JSON.parse(await AsyncStorage.getItem('liked_songs'));
    this.setState({likedSongs});
  };

  updateRecentlyPlayed = async () => {
    if (!(await AsyncStorage.getItem('recentlyPlayed'))) {
      await AsyncStorage.setItem('recentlyPlayed', '[]');
      this.setState({recentlyPlayed: []});
      return;
    }

    const recentlyPlayed = JSON.parse(
      await AsyncStorage.getItem('recentlyPlayed'),
    );
    this.setState({recentlyPlayed});
  };

  async componentDidMount() {
    this.updateLikedSongs();
    this.updateRecentlyPlayed();
    if (!(await AsyncStorage.getItem('playlists'))) {
      await AsyncStorage.setItem('playlists', '[]');
    }
  }
  openMenuLikedSongs = (i: number) => {
    const data = this.state.likedSongs[i];
    this.props.navigation.navigate('Menu', data);
  };

  openMenuRecentlyPlayed = (i: number) => {
    const data = this.state.recentlyPlayed[i];
    this.props.navigation.navigate('Menu', data);
  };

  openMenu = data => {
    this.props.navigation.navigate('Menu', data);
  };

  render() {
    let likedSongsToRender = (
      <MainContext.Consumer>
        {context => {
          return context.liked.length > 0 ? (
            context.liked.map((elem, i) => (
              <TouchableHighlight onPress={() => this.openMenu(elem)} key={i}>
                <View style={Styles.track}>
                  <Image style={Styles.image} source={{uri: elem.image}} />
                  <Text style={Styles.trackName}>
                    {elem.title.substr(0, 30)}
                  </Text>
                </View>
              </TouchableHighlight>
            ))
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
          );
        }}
      </MainContext.Consumer>
    );

    let recentlyPlayedToRender = (
      <MainContext.Consumer>
        {context => {
          console.log(context.recentlyPlayed);
          return context.recentlyPlayed.length > 0 ? (
            context.recentlyPlayed.map((elem, i) => (
              <TouchableHighlight onPress={() => this.openMenu(elem)} key={i}>
                <View style={Styles.track}>
                  <Image style={Styles.image} source={{uri: elem.image}} />
                  <Text style={Styles.trackName}>
                    {elem.title.substr(0, 30)}
                  </Text>
                </View>
              </TouchableHighlight>
            ))
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
          );
        }}
      </MainContext.Consumer>
    );

    // let likedSongsToRender = this.state.likedSongs.map((elem, i) => (
    //   <MainContext.Consumer>
    //     {
    //       context => {
    //         const likedSongs = context.liked;
    //         likedSongs.map((elem, i) => )
    //       }
    //     }

    // ));

    // let recentlyPlayedToRender = this.state.recentlyPlayed.map((elem, i) => (
    //   <TouchableHighlight
    //     onPress={() => this.openMenuRecentlyPlayed(i)}
    //     key={i}>
    //     <View style={Styles.track}>
    //       <Image style={Styles.image} source={{uri: elem.image}} />
    //       <Text style={Styles.trackName}>{elem.title.substr(0, 30)}</Text>
    //     </View>
    //   </TouchableHighlight>
    // ));

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
                  updateRecentlyPlayed: this.updateRecentlyPlayed,
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
                <ScrollView horizontal={true}>{likedSongsToRender}</ScrollView>
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
                  {recentlyPlayedToRender}
                </ScrollView>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
