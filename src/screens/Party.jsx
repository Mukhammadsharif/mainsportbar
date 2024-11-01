import React, {useContext} from 'react';
import {globalStyles} from '../styles';
import Header from '../components/Header';
import {ImageBackground, View} from 'react-native';
import {GlobalContext} from '../components/GlobalContext';

export default function Party() {
  const {lang} = useContext(GlobalContext);

  const images = {
    en: require('../assets/events/en_party.png'),
    ru: require('../assets/events/ru_party.png'),
    es: require('../assets/events/es_party.png'),
    it: require('../assets/events/it_party.png'),
    de: require('../assets/events/de_party.png'),
    fr: require('../assets/events/fr_party.png'),
    sw: require('../assets/events/de_party.png'),
    pl: require('../assets/events/pl_party.png'),
  };
  return (
    <View style={globalStyles.container}>
      <ImageBackground source={images[lang]} style={globalStyles.container}>
        <Header route={'Events'} />
      </ImageBackground>
    </View>
  );
}
