import React, {Component} from 'react';
import {View, Image, Text, AsyncStorage} from 'react-native';
import {ListItem} from 'react-native-elements';

import Colors from '../Styles/Colors';
import Icon from 'react-native-vector-icons/Entypo';

class playlistScreen extends Component {
  state = {
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
    this.setState({playlists});
  }
  render() {
    const playlistsToRender = this.state.playlists.map((playlist, i) => {
      <ListItem
        key={i}
        title={playlist.title}
        titleStyle={{color: Colors.textPrimary}}
        subtitle={playlist.createdOn}
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
      />;
    });
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
            <ListItem
              key={1}
              title={'Create new'}
              titleStyle={{color: Colors.textPrimary}}
              subtitleStyle={{color: Colors.textSecondary}}
              bottomDivider
              topDivider
              // onPress={() => this.onClickPlay(res.href)}
              leftIcon={
                <Icon
                  name="plus"
                  style={{color: Colors.textPrimary}}
                  size={20}
                />
              }
              containerStyle={{
                backgroundColor: Colors.backgroundPrimary,
                marginBottom: 20,
              }}
              contentContainerStyle={{
                backgroundColor: Colors.backgroundPrimary,
              }}
            />

            <ListItem
              key={1}
              title={'Title'}
              titleStyle={{color: Colors.textPrimary}}
              subtitle={'Created on 14 June, 2020'}
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
            {playlistsToRender}
          </View>
        </View>
      </View>
    );
  }
}

export default playlistScreen;
