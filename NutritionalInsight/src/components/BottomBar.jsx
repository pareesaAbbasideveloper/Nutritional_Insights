import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import {useIsFocused} from '@react-navigation/native';

const BottomBar = ({navigation, callFunction, onContactRedirect}) => {
  const switchScreen = location => {
    navigation.navigate(location);
  };
  const {routes, index} = navigation.getState();
  const currentRoute = routes[index].name;

  function handleClick() {
    console.log(currentRoute);
    if (currentRoute == 'Contact') {
      callFunction(true);
    } else {
      onContactRedirect(true); // Call the function passed from the Main component
    }
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingVertical: 10,
        borderTopWidth: 1,
        paddingHorizontal: 20,
        borderTopColor: '#d9d9d9',
      }}>
      <TouchableOpacity onPress={() => switchScreen('Scan')}>
        <Icon style={[styles.BottomIcon]} name="home"></Icon>
        <Text style={[styles.BottomText]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => switchScreen('Alternative')}>
        <AntDesign style={[styles.BottomIcon]} name="contacts"></AntDesign>
        <Text style={[styles.BottomText]}>Alternatives</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          switchScreen('Community');
        }}>
        <Ionicons
          style={[styles.BottomIcon]}
          name="chatbox-ellipses-outline"></Ionicons>
        <Text style={[styles.BottomText]}>Community</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          switchScreen('Support');
        }}>
        <AntDesign
          style={[styles.BottomIcon]}
          name="questioncircleo"></AntDesign>
        <Text style={[styles.BottomText]}>Support</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          switchScreen('AIChatScreen');
        }}>
        <FontAwesome5
          style={[styles.BottomIcon]}
          name="hands-helping"></FontAwesome5>
        <Text style={[styles.BottomText]}>AI Help</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          switchScreen('Profile');
        }}>
        <AntDesign style={[styles.BottomIcon]} name="user"></AntDesign>
        <Text style={[styles.BottomText]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomBar;

const styles = StyleSheet.create({
  BottomIcon: {
    fontSize: 25,
    marginHorizontal: 'auto',
    color: 'black',
  },
  BottomText: {
    fontSize: 10,
  },
});
