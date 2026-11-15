import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React from 'react';
import Logo from '../assets/preloginLogo.png';
import backgroundImage from '../assets/background.png';

const Prelogin = ({navigation}) => {
  function switchScreen(location) {
    navigation.navigate(location);
  }
  return (
    <>
      <ImageBackground source={backgroundImage} style={{height: '100%'}}>
        <View style={{marginTop: 'auto'}}>
          <Text
            style={{
              marginBottom: 10,
              fontSize: 20,
              marginHorizontal: 10,
              color: 'white',
            }}>
            Nutritional Insight
          </Text>
          <Text
            style={{
              marginBottom: 5,
              fontSize: 14,
              marginHorizontal: 10,
              color: '#EDEADE',
            }}>
            Nutritional Insight helps you make smarter food choices by analyzing
            ingredients and matching them with your personal diet goals.
          </Text>
          <Text
            style={{
              marginBottom: 30,
              fontSize: 14,
              marginHorizontal: 10,
              color: '#EDEADE',
            }}>
            Scan, detect, and eat with confidence—because your health matters!
          </Text>

          <TouchableOpacity
            style={{
              width: '90%',
              justifyContent: 'center',
              alignItems: 'centers',
              marginHorizontal: 'auto',
              marginBottom: 10,
            }}>
            <Text
              style={{
                color: 'orange',
                backgroundColor: 'white',
                textAlign: 'center',
                padding: 15,
              }}
              onPress={() => {
                switchScreen('login');
              }}>
              LETS START
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </>
  );
};

export default Prelogin;

const styles = StyleSheet.create({});
