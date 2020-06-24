import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeStack from './src/Home/HomeStack';
import LibraryStack from './src/Library/LibraryStack';

import colors from './src/Styles/Colors';
import Colors from './src/Styles/Colors';
import {MainContext} from './src/DataStore/Main';
import {AsyncStorage} from 'react-native';

const MainTabNavigator = createBottomTabNavigator(
  {
    Main: HomeStack,
    Library: LibraryStack,
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({focused, horizontal, tintColor}) => {
        const {routeName} = navigation.state;
        let iconName;
        if (routeName === 'Main') {
          iconName = focused ? 'ios-home' : 'ios-home';
        } else if (routeName === 'Library') {
          iconName = focused ? 'ios-musical-notes' : 'ios-musical-notes';
        }
        return <Icon name={iconName} size={30} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: colors.textPrimary,
      inactiveTintColor: colors.textSecondary,
      showLabel: false,
      style: {
        backgroundColor: Colors.backgroundSecondary,
        borderRadius: 0,
        borderTopColor: 'transparent',
        paddingBottom: 7,
      },
    },
  },
);

class Provider extends React.Component {
  state = {
    playlists: [{title: 'New', createdOn: 'Now', tracks: []}],
    liked: [],
    recentlyPlayed: [],
  };
  updatePlaylists = newPlaylists => this.setState({playlists: newPlaylists});
  updateLiked = newLiked => this.setState({liked: newLiked});
  updateRecentlyPlayed = newPlayed =>
    this.setState({recentlyPlayed: newPlayed});

  async componentDidMount() {
    const playlists = JSON.parse(await AsyncStorage.getItem('playlists'))
      ? JSON.parse(await AsyncStorage.getItem('playlists'))
      : [];
    const liked = JSON.parse(await AsyncStorage.getItem('liked_songs'))
      ? JSON.parse(await AsyncStorage.getItem('liked_songs'))
      : [];
    const recentlyPlayed = JSON.parse(
      await AsyncStorage.getItem('recentlyPlayed'),
    )
      ? JSON.parse(await AsyncStorage.getItem('recentlyPlayed'))
      : [];

    this.setState({
      playlists,
      liked,
      recentlyPlayed,
    });
  }
  render() {
    return (
      <MainContext.Provider
        value={{
          playlists: this.state.playlists,
          liked: this.state.liked,
          recentlyPlayed: this.state.recentlyPlayed,
          updatePlaylists: this.updatePlaylists,
          updateLiked: this.updateLiked,
          updateRecentlyPlayed: this.updateRecentlyPlayed,
        }}>
        {this.props.children}
      </MainContext.Provider>
    );
  }
}

const App = () => {
  const Container = createAppContainer(MainTabNavigator);
  return (
    <Provider>
      <Container />
    </Provider>
  );
};

export default App;
