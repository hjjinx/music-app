import {
  View,
  Text,
  Keyboard,
  PermissionsAndroid,
  BackHandler,
} from 'react-native';
import React from 'react';
import {SearchBar} from 'react-native-elements';
import {ListItem} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import {ScrollView} from 'react-native-gesture-handler';

import Colors from '../Styles/Colors';
import {search} from '../misc/youtubeSearch.js';
import styles from '../Styles/Home';
import playSong from '../misc/playSong';

export default class SearchScreen extends React.Component {
  static navigationOptions = {
    tabBarVisible: false,
  };

  constructor(props) {
    super(props);
  }
  state = {
    searchQuery: '',
    searching: false,
    results: [],
    downloading: new Array(20).map(i => null),
  };
  searchTimeout;
  searchInput: SearchBar;
  backHandler;

  backAction = () => {
    console.log('called');
    if (!this.props.navigation.getParam('updateLikedSongs')) return false;
    this.props.navigation
      .getParam('updateLikedSongs')()
      .then(res => {
        this.props.navigation
          .getParam('updateRecentlyPlayed')()
          .then(res => {
            return false;
          });
      })
      .catch(err => {
        console.log(err);
      });
    return false;
  };

  async componentDidMount() {
    if (
      !(await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      )) ||
      !(await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ))
    )
      await requestFilePermission();
    this.searchInput.focus();

    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
  }

  async componentWillUnmount() {
    this.backHandler.remove();
  }

  onSearchChange = value => {
    this.setState({searchQuery: value}, () => {
      clearTimeout(this.searchTimeout);
      const q = this.state.searchQuery;
      if (q.length < 2) {
        this.setState({searching: false, results: []});
        return;
      }
      this.setState({searching: true});
      this.searchTimeout = setTimeout(async () => {
        // send the request for searching YouTube here
        const results = await search(q);
        this.setState({searching: false, results});
      }, 200);
    });
  };

  onClickPlay = async href => {
    try {
      await playSong(href);
    } catch (err) {
      console.log('Error in playing song');
      console.log(err);
      alert('There was an error! Please try again');
    }
  };

  render() {
    let listOfItems;
    if (this.state.results.length > 0)
      listOfItems = this.state.results.map((res, i) => (
        <ListItem
          key={i}
          title={res.title}
          titleStyle={{color: Colors.textPrimary}}
          subtitle={res.artist}
          subtitleStyle={{color: Colors.textSecondary}}
          bottomDivider
          onPress={() => this.onClickPlay(res.href)}
          leftAvatar={{source: {uri: res.img}}}
          rightElement={
            <Icon
              name="md-more"
              style={{
                paddingLeft: 30,
                paddingVertical: 10,
                color: 'grey',
                marginRight: 0,
                paddingRight: 7,
              }}
              size={20}
              color={Colors.textPrimary}
              onPress={() =>
                this.props.navigation.navigate('Menu', {
                  image: res.img,
                  title: res.title,
                  artist: res.artist,
                  href: res.href,
                })
              }
            />
          }
          containerStyle={{
            backgroundColor: Colors.backgroundPrimary,
          }}
          contentContainerStyle={{
            backgroundColor: Colors.backgroundPrimary,
            // color: 'white',
          }}
        />
      ));
    else if (!this.state.searching)
      listOfItems = (
        <View style={[styles.container, {paddingTop: 100}]}>
          <Text style={{color: Colors.textPrimary, textAlign: 'center'}}>
            No Results found!
          </Text>
        </View>
      );
    return (
      <View style={{flex: 1}}>
        <SearchBar
          placeholder="Search for..."
          ref={input => (this.searchInput = input)}
          onChangeText={value => this.onSearchChange(value)}
          value={this.state.searchQuery}
          showLoading={this.state.searching}
          inputStyle={{
            padding: 0,
            margin: 0,
            height: 10,
          }}
          containerStyle={{
            paddingTop: 15,
            margin: 0,
            height: 75,
            backgroundColor: Colors.backgroundSecondary,
            borderBottomWidth: 0,
          }}
          inputContainerStyle={{
            borderRadius: 100,
            padding: 0,
            margin: 0,
            backgroundColor: 'white',
            height: 40,
          }}
        />
        <View style={{backgroundColor: Colors.backgroundPrimary, flex: 1}}>
          <ScrollView
            onScrollBeginDrag={Keyboard.dismiss}
            keyboardShouldPersistTaps="never">
            {listOfItems}
          </ScrollView>
          {/* <View
            style={{
              backgroundColor: Colors.mainBackground,
              height: 1000,
            }}
          /> */}
        </View>
      </View>
    );
  }
}

const requestFilePermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'SpotiBoi needs access to your files',
        message:
          'SpotiBoi needs access to your files so you can download songs.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
  } catch (err) {
    console.warn(err);
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'SpotiBoi needs access to your files',
        message:
          'SpotiBoi needs access to your files so you can download songs.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
  } catch (err) {
    console.warn(err);
  }
};
