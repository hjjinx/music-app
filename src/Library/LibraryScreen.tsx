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

import Styles from '../Styles/Home';
import Colors from '../Styles/Colors';
import {ListItem} from 'react-native-elements';
import {MainContext} from '../DataStore/Main';

export default class LibraryScreen extends React.Component {
  async componentDidMount() {
    const playlists = JSON.parse(await AsyncStorage.getItem('playlists'));
    console.log(playlists);
    this.setState({playlists});
  }
  openPlaylist = i => {
    this.props.navigation.navigate('Playlist', {
      playlists: this.state.playlists[i],
    });
  };
  render() {
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
          <View style={{flex: 1, marginTop: 40, justifyContent: 'flex-start'}}>
            <View>
              <Text style={[Styles.headingText, {fontSize: 25}]}>
                Your Personal Playlists
              </Text>
            </View>
            <View style={{marginTop: 10}}>
              <ScrollView>
                <MainContext.Consumer>
                  {playlists => {
                    return playlists.playlists.length > 0 ? (
                      playlists.playlists.map((playlist, i) => (
                        <ListItem
                          key={i}
                          onPress={() => {
                            this.props.navigation.navigate('Playlist', {
                              playlists: playlist,
                            });
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
                          You haven't created any playlists yet!
                        </Text>
                      </View>
                    );
                  }}
                </MainContext.Consumer>
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
