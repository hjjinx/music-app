import {Text, View} from 'react-native';
import React from 'react';
import {SearchBar} from 'react-native-elements';

import Styles from '../Styles/Home';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../Styles/Colors';

export default class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <TouchableOpacity
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
        </TouchableOpacity>
        <View style={Styles.container}>
          <Text style={Styles.text}>Home Screen</Text>
        </View>
      </View>
    );
  }
}
