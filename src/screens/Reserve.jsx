import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  ImageBackground,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import {globalStyles} from '../styles';
import BackgroundImage from '../assets/image/cart_background.png';
import Header from '../components/Header';
import {GlobalContext} from '../components/GlobalContext';
import {useGetRequest, usePostRequest} from '../helpers/hooks';
import {BOOKING, TRANSLATE} from '../helpers/urls';
import {COLORS, FONTS} from '../helpers/colors';
import {useNavigation} from '@react-navigation/native';
import CustomButton from '../components/CustomButton';

export default function Reserve() {
  const {lang} = useContext(GlobalContext);
  const [translations, setTranslations] = useState([]);
  const [loading, setLoading] = useState(false);
  const getLanguagesRequest = useGetRequest({url: TRANSLATE});
  const bookingRequest = usePostRequest({url: BOOKING});
  const navigation = useNavigation();

  const getLanguages = async () => {
    const {response} = await getLanguagesRequest.request();
    if (response?.length) {
      setTranslations(response);
    }
  };

  useEffect(() => {
    getLanguages();
  }, []);

  const booking = async () => {
    setLoading(true);
    const {response} = await bookingRequest.request();
    if (response) {
      navigation.navigate('ReserveSuccess');
      setLoading(false);
    }
  };
  return (
    <View style={globalStyles.container}>
      <ImageBackground source={BackgroundImage} style={globalStyles.container}>
        <Header />

        {translations?.length ? (
          <>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {translations.find(item => item?.en === 'Booking')[lang]}
              </Text>
            </View>

            <View style={styles.main}>
              <ScrollView>
                <TextInput
                  style={styles.textInput}
                  placeholderTextColor={COLORS.brown}
                  placeholder={
                    translations.find(item => item?.en === 'Your Name')[lang]
                  }
                />

                <TextInput
                  style={styles.textInput}
                  placeholderTextColor={COLORS.brown}
                  placeholder={
                    translations.find(item => item?.en === 'Your phone')[lang]
                  }
                />

                <TextInput
                  style={styles.textInput}
                  placeholderTextColor={COLORS.brown}
                  placeholder={
                    translations.find(item => item?.en === 'E-mail')[lang]
                  }
                />

                <TextInput
                  style={styles.textInput}
                  placeholderTextColor={COLORS.brown}
                  placeholder={
                    translations.find(item => item?.en === 'Select date')[lang]
                  }
                />

                <TextInput
                  style={styles.textInput}
                  placeholderTextColor={COLORS.brown}
                  placeholder={
                    translations.find(item => item?.en === 'Select time')[lang]
                  }
                />
              </ScrollView>
            </View>

            <CustomButton
              text={translations.find(item => item?.en === 'Book now')[lang]}
              onPress={() => booking()}
              style={{marginTop: 50}}
            />
          </>
        ) : (
          ''
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: COLORS.brownFill,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    lineHeight: 32,
    fontFamily: FONTS.bold,
    color: COLORS.brown,
  },
  main: {
    width: '85%',
    backgroundColor: COLORS.priceTextColor,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
    borderRadius: 15,
    marginTop: 50,
  },
  textInput: {
    height: 45,
    backgroundColor: COLORS.white,
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 25,
    paddingLeft: 20,
    fontSize: 13,
    lineHeight: 15,
    fontFamily: FONTS.bold,
    marginBottom: 10,
  },
});
