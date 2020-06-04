import {StyleSheet} from 'react-native';
import Colors from './Colors';
import {Dimensions} from 'react-native';

var fullWidth = Dimensions.get('window').width; //full width
export default StyleSheet.create({
  overlay: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    opacity: 0.75,
    backgroundColor: 'black',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fromBottom: {
    padding: 15,
    position: 'absolute',
    // left: '50%',
    bottom: 0,
  },
  option: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: fullWidth,
    alignSelf: 'stretch',
    height: 50,
    backgroundColor: Colors.backgroundSecondary,
  },
  image: {
    marginBottom: 50,
    width: 200,
    height: 200,
    margin: 0,
    padding: 0,
    borderRadius: 200,
    // resizeMode: 'center',
  },
});
