import {createAppContainer} from 'react-navigation';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from 'react-navigation-stack';

import HomeScreen from './HomeScreen';
import SearchScreen from './SearchScreen';

const HomeStackNavigator = createStackNavigator(
  {
    Home: {screen: HomeScreen},
    Search: {screen: SearchScreen},
  },
  {
    headerMode: 'none',
    defaultNavigationOptions: {
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    },
  },
);

// Export this HomeScreen stack
export default createAppContainer(HomeStackNavigator);
