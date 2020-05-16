import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import styles from '../Styles/Home';

export default class LibraryScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Library</Text>
      </View>
    );
  }
}
