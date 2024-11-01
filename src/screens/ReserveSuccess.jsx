import React, {useContext, useEffect, useState} from 'react';
import {GlobalContext} from '../components/GlobalContext';
import {useGetRequest} from '../helpers/hooks';
import {TRANSLATE} from '../helpers/urls';
import {globalStyles} from '../styles';
import BackgroundImage from '../assets/image/cart_background.png';
import Header from '../components/Header';
import {
  ImageBackground,
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import {COLORS, FONTS} from '../helpers/colors';

const {width, height} = Dimensions.get('window');
export default function CartSuccess({route}) {
  const {qrImage} = route.params;
  const {lang} = useContext(GlobalContext);
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

        <View style={styles.main}>
          {qrImage ? (
            <View style={styles.qrContainer}>
              <Image source={{uri: qrImage}} style={styles.qrImage} />
            </View>
          ) : (
            ''
          )}

          {translations?.length ? (
            <Text style={styles.text}>
              {
                translations.find(
                  item => item?.en === 'Show this code to the waiter',
                )[lang]
              }
            </Text>
          ) : (
            ''
          )}
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  qrContainer: {
    backgroundColor: 'white',
    width: width / 2.5,
    height: width / 2.5,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  qrImage: {
    width: width / 3,
    height: width / 3,
    alignSelf: 'center',
  },
  text: {
    color: COLORS.green,
    fontFamily: FONTS.bold,
    fontSize: 25,
    lineHeight: 32,
    textAlign: 'center',
    paddingHorizontal: 40,
    marginTop: 20,
    fontWeight: 'bold',
  },
  main: {
    height: height / 2,
    width: width,
    backgroundColor: COLORS.priceTextColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.1,
    borderRadius: 290,
  },
});
