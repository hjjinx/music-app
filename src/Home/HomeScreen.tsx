import {Text, View, Image} from 'react-native';
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
        <View style={Styles.container}>
          <Text style={Styles.text}>Home Screen</Text>
        </View>
      </View>
    );
  }
}
