/**
 * @format
 */
// import 'react-native-gesture-handler';
import {AppRegistry, AsyncStorage} from 'react-native';
import App from './App';
import TrackPlayer from 'react-native-track-player';
import {name as appName} from './app.json';

const setUp = async () => {
  if (!(await AsyncStorage.getItem('liked_songs')))
    await AsyncStorage.setItem('liked_songs', '[]');
};

setUp();

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => require('./service.js'));
