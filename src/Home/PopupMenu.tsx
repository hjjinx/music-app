import React from 'react';
import {View, Image, Text} from 'react-native';

import searchStyles from '../Styles/Search';
import Colors from '../Styles/Colors';

export default class PopupMenu extends React.Component {
  render() {
    console.log(this.props.navigation.getParam('avatar'));
    return (
      <View style={searchStyles.overlay}>
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
              }}>
              {this.props.navigation.getParam('title').length > 28
                ? this.props.navigation.getParam('title').substr(0, 28) + '...'
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
          <View style={searchStyles.option}>
            <Text style={{color: Colors.textPrimary}}>Add to playlist</Text>
          </View>
          <View style={searchStyles.option}>
            <Text style={{color: Colors.textPrimary}}>Add to Queue</Text>
          </View>
          <View style={searchStyles.option}>
            <Text style={{color: Colors.textPrimary}}>Like</Text>
          </View>
        </View>
      </View>
    );
  }
}
