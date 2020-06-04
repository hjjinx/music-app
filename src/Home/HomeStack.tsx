import {createAppContainer} from 'react-navigation';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from 'react-navigation-stack';

import HomeScreen from './HomeScreen';
import SearchScreen from './SearchScreen';
import PopupMenu from './PopupMenu';

const HomeStackNavigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Search: {
      screen: SearchScreen,
      navigationOptions: {
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      },
    },
    Menu: {
      screen: PopupMenu,
      navigationOptions: {
        cardStyle: {backgroundColor: 'transparent'},
      },
    },
  },
  {
    headerMode: 'none',
    // cardStyle: {shadowColor: 'transparent'},
    // transitionConfig: () => ({
    //   containerStyle: {
    //     backgroundColor: 'transparent',
    //   },
    // }),
  },
);

// Export this HomeScreen stack
export default createAppContainer(HomeStackNavigator);
