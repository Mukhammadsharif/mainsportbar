import React, {useContext, useEffect, useState} from 'react';
import {globalStyles} from '../styles';
import BackgroundImage from '../assets/image/cart_background.png';
import Header from '../components/Header';
import {
  ImageBackground,
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {GlobalContext} from '../components/GlobalContext';
import {useGetRequest} from '../helpers/hooks';
import {TRANSLATE} from '../helpers/urls';
import Loading from '../components/Loading';
import {COLORS, FONTS} from '../helpers/colors';
import {useNavigation} from '@react-navigation/native';

export default function Events() {
  const navigation = useNavigation();
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

  const languages = {
    india: {
      de: 'Abend in Indien',
      en: 'Evening in India',
      es: 'Noche en la India',
      fr: 'Soirée en Inde',
      it: 'Sera in India',
      pl: 'Wieczór w Indiach',
      ru: 'Вечер в Индии',
      sw: 'Kväll i Indien',
    },
    football: {
      de: 'Fußball-Quiz',
      en: 'Football Quiz',
      es: 'Quiz de fútbol',
      fr: 'Quiz de football',
      it: 'Quiz di calcio',
      pl: 'Piłkarski quiz',
      ru: 'Футбольная викторина',
      sw: 'Fotbollsquiz',
    },
    kinder: {
      de: 'Kinder-Workshop',
      en: 'Kids Workshop',
      es: 'Taller infantil',
      fr: 'Atelier pour enfants',
      it: 'Laboratorio per bambini',
      pl: 'Warsztaty dla dzieci',
      ru: 'Детский мастер-класс',
      sw: 'Barnverkstad',
    },
    party: {
      de: 'Beste Kostümparty',
      en: 'Best Costume Party',
      es: 'Mejor fiesta de disfraces',
      fr: 'Meilleure fête costumée',
      it: 'Miglior festa in costume',
      pl: 'Najlepsza impreza kostiumowa',
      ru: 'Лучший костюм пати',
      sw: 'Bästa kostymfest',
    },
  };

  return (
    <View style={globalStyles.container}>
      <ImageBackground source={BackgroundImage} style={globalStyles.container}>
        <Header />

        {translations?.length ? (
          <>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {translations.find(item => item?.en === 'Events')[lang]}
              </Text>
            </View>

            <ScrollView
              style={{flex: 1}}
              contentContainerStyle={styles.scrollView}>
              <TouchableOpacity
                style={styles.container}
                onPress={() => navigation.navigate('India')}>
                <Text style={styles.name}>{languages.india[lang]}</Text>
                <Text style={styles.date}>27/11 18:00</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.container}
                onPress={() => navigation.navigate('Football')}>
                <Text style={styles.name}>{languages.football[lang]}</Text>
                <Text style={styles.date}>28/11 21:00</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.container}
                onPress={() => navigation.navigate('Kinder')}>
                <Text style={styles.name}>{languages.kinder[lang]}</Text>
                <Text style={styles.date}>29/11 16:00</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.container}
                onPress={() => navigation.navigate('Party')}>
                <Text style={styles.name}>{languages.party[lang]}</Text>
                <Text style={styles.date}>30/11 19:00</Text>
              </TouchableOpacity>
            </ScrollView>
          </>
        ) : (
          <Loading />
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
  scrollView: {
    alignItems: 'center',
  },
  container: {
    marginTop: 20,
    height: 150,
    width: '70%',
    backgroundColor: COLORS.priceTextColor,
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  name: {
    color: COLORS.black,
    fontFamily: FONTS.bold,
    fontSize: 25,
    lineHeight: 28,
    marginTop: 15,
    textAlign: 'center',
  },
  date: {
    color: COLORS.green,
    fontFamily: FONTS.bold,
    fontSize: 25,
    lineHeight: 28,
    marginVertical: 15,
  },
});
