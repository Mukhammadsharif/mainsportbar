import React, {useContext} from 'react';
import {globalStyles} from '../styles';
import Header from '../components/Header';
import {ImageBackground, View} from 'react-native';
import {GlobalContext} from '../components/GlobalContext';

export default function India() {
  const {lang} = useContext(GlobalContext);

  const images = {
    en: require('../assets/events/en_india.png'),
    ru: require('../assets/events/ru_india.png'),
    es: require('../assets/events/es_india.png'),
    it: require('../assets/events/it_india.png'),
    de: require('../assets/events/de_india.png'),
    fr: require('../assets/events/fr_india.png'),
    sw: require('../assets/events/de_india.png'),
    pl: require('../assets/events/pl_india.png'),
  };

  return (
    <View style={globalStyles.container}>
      <ImageBackground source={images[lang]} style={globalStyles.container}>
        <Header route={'Events'} />
      </ImageBackground>
    </View>
  );
}
