import React, {Component} from 'react';
import {
  View,
  Image,
  Text,
  AsyncStorage,
  Button,
  Dimensions,
} from 'react-native';
import {ListItem, Input} from 'react-native-elements';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Entypo';

import Colors from '../Styles/Colors';
import {PlaylistContext} from '../DataStore/Playlist';

const monthMap = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

class playlistScreen extends Component {
  state = {
    newPlaylist: '',
    playlists: [],
    /*
        {
            title: `Title of the playlist`,
            tracks: [
                        {href, title, artist, image}, 
                        {href, title, artist, image}, 
                        {href, title, artist, image}
                    ],
            createdOn: `Date on which the playlist was created`
        }
    */
  };
  async componentDidMount() {
    const playlists = JSON.parse(await AsyncStorage.getItem('playlists'));
    console.log(playlists);
    this.setState({playlists});
  }

  createNew = async playlists => {
    if (this.state.newPlaylist === '') {
      alert('Please enter a name');
      return;
    }
    for (const playlist of playlists) {
      if (playlist.title === this.state.newPlaylist) {
        alert('Please enter a unique and valid name');
        return;
      }
    }
    var date = new Date().getDate();
    var month = monthMap[new Date().getMonth()];
    var year = new Date().getFullYear();
    const newPlaylist = {
      title: this.state.newPlaylist,
      tracks: [],
      createdOn: `${date} ${month}, ${year}`,
    };
    const newPlaylists = [newPlaylist, ...playlists];
    await AsyncStorage.setItem('playlists', JSON.stringify(newPlaylists));
    return newPlaylists;
  };
  addToThis = async i => {
    const playlists = this.state.playlists;
    playlists[i].tracks = [
      ...playlists[i].tracks,
      {
        href: this.props.navigation.getParam('href'),
        title: this.props.navigation.getParam('title'),
        artist: this.props.navigation.getParam('artist'),
        image: this.props.navigation.getParam('image'),
      },
    ];
    await AsyncStorage.setItem('playlists', JSON.stringify(playlists));
    this.props.navigation.goBack();
  };
  render() {
    const playlistsToRender = this.state.playlists.map((playlist, i) => (
      <ListItem
        key={i}
        onPress={() => this.addToThis(i)}
        title={playlist.title}
        titleStyle={{color: Colors.textPrimary}}
        subtitle={'Created on ' + playlist.createdOn}
        subtitleStyle={{color: Colors.textSecondary}}
        bottomDivider
        //   onPress={() => this.onClickPlay(res.href)}
        leftIcon={
          <Icon
            name="add-to-list"
            size={20}
            style={{color: Colors.textPrimary}}
          />
        }
        containerStyle={{
          backgroundColor: Colors.backgroundPrimary,
        }}
        contentContainerStyle={{
          backgroundColor: Colors.backgroundPrimary,
        }}
      />
    ));
    return (
      <View style={{flex: 1}}>
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
          style={{backgroundColor: Colors.backgroundPrimary, height: '100%'}}>
          <View style={{}}>
            <Text
              style={{
                textAlign: 'center',
                color: Colors.textPrimary,
                fontSize: 30,
                padding: 20,
              }}>
              Select Playlist
            </Text>
          </View>
          <View>
            <View>
              <Text
                style={{
                  textAlign: 'left',
                  color: Colors.blueBack,
                  fontSize: 20,
                  paddingTop: 10,
                }}>
                Create new
              </Text>
            </View>
            <Input
              placeholder="Name of the new playlist.."
              placeholderTextColor={Colors.textPrimary}
              onChangeText={text => this.setState({newPlaylist: text})}
              containerStyle={{
                marginTop: 10,
                marginBottom: 0,
                paddingBottom: 0,
              }}
              style={{
                marginBottom: 0,
                paddingBottom: 0,
              }}
              inputStyle={{
                color: Colors.textPrimary,
                marginBottom: 0,
                paddingBottom: 0,
              }}
              inputContainerStyle={{
                marginBottom: 0,
                paddingBottom: 0,
              }}
            />
            <PlaylistContext.Consumer>
              {data => {
                return (
                  <Button
                    title="Create new"
                    onPress={async () => {
                      const newPlaylists = await this.createNew(data.playlists);
                      data.updatePlaylists(newPlaylists);
                    }}
                  />
                );
              }}
            </PlaylistContext.Consumer>
            <View style={{marginBottom: 20}} />

            <View>
              <Text
                style={{
                  textAlign: 'left',
                  color: Colors.blueBack,
                  fontSize: 20,
                  paddingTop: 10,
                }}>
                Add to existing
              </Text>
            </View>
            <PlaylistContext.Consumer>
              {context => {
                return context.playlists.length > 0 ? (
                  context.playlists.map((playlist, i) => (
                    <ListItem
                      key={i}
                      onPress={async () => {
                        const newPlaylists = context.playlists;
                        newPlaylists[i].tracks.push({
                          href: this.props.navigation.getParam('href'),
                          title: this.props.navigation.getParam('title'),
                          artist: this.props.navigation.getParam('artist'),
                          image: this.props.navigation.getParam('image'),
                        });
                        await AsyncStorage.setItem(
                          'playlists',
                          JSON.stringify(newPlaylists),
                        );
                        context.updatePlaylists(newPlaylists);
                      }}
                      title={playlist.title}
                      titleStyle={{color: Colors.textPrimary}}
                      subtitle={
                        'Created on ' +
                        playlist.createdOn +
                        '\nNumber of tracks: ' +
                        playlist.tracks.length
                      }
                      subtitleStyle={{color: Colors.textSecondary}}
                      bottomDivider
                      //   onPress={() => this.onClickPlay(res.href)}
                      leftIcon={
                        <IconMaterial
                          name="playlist-play"
                          size={20}
                          style={{color: Colors.textPrimary}}
                        />
                      }
                      containerStyle={{
                        backgroundColor: Colors.backgroundPrimary,
                      }}
                      contentContainerStyle={{
                        backgroundColor: Colors.backgroundPrimary,
                      }}
                    />
                  ))
                ) : (
                  <Text
                    style={{
                      color: Colors.textPrimary,
                      textAlign: 'center',
                      marginTop: 30,
                    }}>
                    Such empty. Much vow
                  </Text>
                );
              }}
            </PlaylistContext.Consumer>
          </View>
        </View>
      </View>
    );
  }
}

export default playlistScreen;
