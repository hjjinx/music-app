import {createAppContainer} from 'react-navigation';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from 'react-navigation-stack';

import PlaylistScreen from './PlaylistScreen';
import LibraryScreen from './LibraryScreen';

const LibraryStackNavigator = createStackNavigator(
  {
    Library: {screen: LibraryScreen},
    Playlist: {
      screen: PlaylistScreen,
      navigationOptions: {
        cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
      },
    },
  },
  {
    headerMode: 'none',
  },
);

export default createAppContainer(LibraryStackNavigator);
