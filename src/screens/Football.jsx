import React, {useContext} from 'react';
import {globalStyles} from '../styles';
import Header from '../components/Header';
import {ImageBackground, View} from 'react-native';
import {GlobalContext} from '../components/GlobalContext';

export default function Football() {
  const {lang} = useContext(GlobalContext);

  const images = {
    en: require('../assets/events/en_football.png'),
    ru: require('../assets/events/ru_football.png'),
    es: require('../assets/events/es_football.png'),
    it: require('../assets/events/it_football.png'),
    de: require('../assets/events/de_football.png'),
    fr: require('../assets/events/fr_football.png'),
    sw: require('../assets/events/de_football.png'),
    pl: require('../assets/events/pl_football.png'),
  };
  return (
    <View style={globalStyles.container}>
      <ImageBackground source={images[lang]} style={globalStyles.container}>
        <Header route={'Events'} />
      </ImageBackground>
    </View>
  );
}
