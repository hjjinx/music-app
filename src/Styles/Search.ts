import {StyleSheet} from 'react-native';
import Colors from './Colors';
import {Dimensions} from 'react-native';

var fullWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  overlay: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fromBottom: {
    padding: 0,
    opacity: 1,
    position: 'absolute',
    // left: '50%',
    bottom: 0,
  },
  option: {
    flex: 1,
    opacity: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: fullWidth,
    alignSelf: 'stretch',
    height: 50,
    backgroundColor: Colors.backgroundSecondary,
  },
  image: {
    marginBottom: 30,
    width: 200,
    height: 200,
    margin: 0,
    padding: 0,
    borderRadius: 200,
    // resizeMode: 'center',
  },
  backgroundOverlay: {
    position: 'absolute',
    flex: 1,
    left: 10,
    bottom: 0,
    opacity: 1,
    backgroundColor: 'black',
    width: fullWidth,
    height: '100%',
  },
});
