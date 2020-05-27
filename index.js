/**
 * @format
 */
import React from 'react';
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

class AppContainer extends React.Component {
  // Will contain list of all the songs present in the /Music folder
  state = {music: []};
  componentDidMount() {}

  render() {
    return <App />;
  }
}

AppRegistry.registerComponent(appName, () => AppContainer);
