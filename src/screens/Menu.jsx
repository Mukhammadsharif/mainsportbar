import React, {useEffect, useState} from 'react';
import {ImageBackground, View, StyleSheet, ScrollView} from 'react-native';
import {globalStyles} from '../styles';
import BackgroundImage from '../assets/image/menu_background.png';
import Header from '../components/Header';
import Loading from '../components/Loading';
import MenuItem from '../components/MenuItem';
import {useGetRequest} from '../helpers/hooks';
import {TRANSLATE} from '../helpers/urls';

export default function Menu({route}) {
  const {products} = route.params;
  const [translations, setTranslations] = useState([]);
  const getLanguagesRequest = useGetRequest({url: TRANSLATE});

  const getLanguages = async () => {
    const {response} = await getLanguagesRequest.request();
    if (response?.length) {
      setTranslations(response);
    }
  };

  useEffect(() => {
    getLanguages();
  }, []);

  return (
    <View style={globalStyles.container}>
      <ImageBackground source={BackgroundImage} style={globalStyles.container}>
        <Header />

        {products?.length && translations?.length ? (
          <ScrollView contentContainerStyle={styles.main} style={{flex: 1}}>
            {products.map((item, index) => (
              <MenuItem item={item} key={index} translations={translations} />
            ))}
          </ScrollView>
        ) : (
          <Loading />
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingHorizontal: '7%',
    marginTop: 40,
    paddingBottom: 50,
  },
});
