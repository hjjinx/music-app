import {createAppContainer} from 'react-navigation';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from 'react-navigation-stack';

import PlaylistScreen from './PlaylistScreen';
import LibraryScreen from './LibraryScreen';
import PlaylistMenu from './PlaylistMenu';

const LibraryStackNavigator = createStackNavigator(
  {
    Library: {screen: LibraryScreen},
    Playlist: {
      screen: PlaylistScreen,
      navigationOptions: {
        cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
      },
    },
    PlaylistMenu: {
      screen: PlaylistMenu,
      navigationOptions: {
        cardStyle: {backgroundColor: 'transparent'},
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
      },
    },
  },
  {
    headerMode: 'none',
  },
);

export default createAppContainer(LibraryStackNavigator);
