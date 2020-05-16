import {StyleSheet} from 'react-native';
import Colors from './Colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
    color: Colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: Colors.textPrimary,
  },
});
