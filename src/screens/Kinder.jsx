import React, {useContext} from 'react';
import {globalStyles} from '../styles';
import Header from '../components/Header';
import {ImageBackground, View} from 'react-native';
import {GlobalContext} from '../components/GlobalContext';

export default function Kinder() {
  const {lang} = useContext(GlobalContext);

  const images = {
    en: require('../assets/events/en_kinder.png'),
    ru: require('../assets/events/ru_kinder.png'),
    es: require('../assets/events/es_kinder.png'),
    it: require('../assets/events/it_kinder.png'),
    de: require('../assets/events/de_kinder.png'),
    fr: require('../assets/events/fr_kinder.png'),
    sw: require('../assets/events/de_kinder.png'),
    pl: require('../assets/events/pl_kinder.png'),
  };
  return (
    <View style={globalStyles.container}>
      <ImageBackground source={images[lang]} style={globalStyles.container}>
        <Header route={'Events'} />
      </ImageBackground>
    </View>
  );
}
