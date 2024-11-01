import React from 'react';
import {globalStyles} from '../styles';
import BackgroundImage from '../assets/image/translation_background.png';
import Header from '../components/Header';
import {ImageBackground, View} from 'react-native';

export default function India() {
  return (
    <View style={globalStyles.container}>
      <ImageBackground source={BackgroundImage} style={globalStyles.container}>
        <Header />
      </ImageBackground>
    </View>
  );
}
