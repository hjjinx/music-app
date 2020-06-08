import {StyleSheet} from 'react-native';
import Colors from './Colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
    color: Colors.textPrimary,
  },
  text: {
    color: Colors.textPrimary,
  },
  category: {
    height: 200,
    marginTop: 20,
  },
  heading: {
    flex: 1,
  },
  headingText: {
    marginLeft: 10,
    fontSize: 30,
    color: 'white',
  },
  musicList: {
    flex: 3,
    backgroundColor: Colors.backgroundSecondary,
    alignContent: 'center',
    justifyContent: 'center',
  },
  track: {
    flex: 1,
    margin: 10,
    height: 150,
    width: 120,
    // backgroundColor: 'black',
  },
  image: {
    flex: 3,
    width: null,
    height: null,
    resizeMode: 'contain',
  },
  trackName: {
    flex: 2,
    color: 'white',
    textAlign: 'center',
  },
});
