import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  ImageBackground,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
} from 'react-native';
import {globalStyles} from '../styles';
import BackgroundImage from '../assets/image/main_background.png';
import Header from '../components/Header';
import {useGetRequest} from '../helpers/hooks';
import {TRANSLATE} from '../helpers/urls';
import {GlobalContext} from '../components/GlobalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../components/Loading';
import {avatars} from '../helpers/avatars';
import {COLORS, FONTS} from '../helpers/colors';
import Avatars from '../components/Avatars';
import PolygonIcon from '../assets/icon/polygon.png';

const {width, height} = Dimensions.get('window');

export default function Profile() {
  const {lang, avatar, name, setName, setLang} = useContext(GlobalContext);
  const [translations, setTranslations] = useState([]);
  const [avatarModal, setAvatarModal] = useState(false);
  const [language, setLanguage] = useState(false);
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

  const setNewLanguage = value => {
    setLang(value);
    AsyncStorage.setItem('language', value);
    setLanguage(false);
  };

  const inputRef = useRef(null);

  // Function to focus the TextInput
  const handleFocusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <View style={globalStyles.container}>
      <ImageBackground source={BackgroundImage} style={globalStyles.container}>
        <Header />

        {translations?.length ? (
          <ScrollView
            style={{flex: 1}}
            contentContainerStyle={styles.scrollView}
            nestedScrollEnabled={true}>
            <TouchableOpacity
              onPress={() => setAvatarModal(true)}
              style={{marginBottom: 80}}>
              {avatar ? (
                <Image
                  source={avatars.find(item => item?.name === avatar)?.image}
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.changeAvatarContainer}>
                  <Text style={styles.changeAvatarText}>
                    {
                      translations.find(item => item?.en === 'Change avatar')[
                        lang
                      ]
                    }
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TextInput
              ref={inputRef}
              style={styles.textInput}
              placeholder={
                translations.find(item => item?.en === 'Your Name')[lang]
              }
              placeholderTextColor={COLORS.green}
              value={name}
              onChangeText={value => {
                setName(value);
                AsyncStorage.setItem('name', value);
              }}
            />

            <TouchableOpacity
              style={styles.languagesInputContainer}
              onPress={() => setLanguage(true)}>
              <View style={styles.languageInput}>
                <Text style={styles.languageText}>
                  {
                    translations.find(item => item?.en === 'Choose Language')[
                      lang
                    ]
                  }
                </Text>

                <Image source={PolygonIcon} style={styles.polygon} />
              </View>
            </TouchableOpacity>
            {language ? (
              <View style={styles.content}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <TouchableOpacity
                    style={lang === 'ru' ? styles.activeButton : styles.button}
                    onPress={() => setNewLanguage('ru')}>
                    <Text style={styles.buttonText}>Русский</Text>
                    {lang === 'ru' ? <View style={styles.activeCircle} /> : ''}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={lang === 'en' ? styles.activeButton : styles.button}
                    onPress={() => setNewLanguage('en')}>
                    <Text style={styles.buttonText}>English</Text>
                    {lang === 'en' ? <View style={styles.activeCircle} /> : ''}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={lang === 'es' ? styles.activeButton : styles.button}
                    onPress={() => setNewLanguage('es')}>
                    <Text style={styles.buttonText}>Español</Text>
                    {lang === 'es' ? <View style={styles.activeCircle} /> : ''}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={lang === 'it' ? styles.activeButton : styles.button}
                    onPress={() => setNewLanguage('it')}>
                    <Text style={styles.buttonText}>Italiano</Text>
                    {lang === 'it' ? <View style={styles.activeCircle} /> : ''}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={lang === 'de' ? styles.activeButton : styles.button}
                    onPress={() => setNewLanguage('de')}>
                    <Text style={styles.buttonText}>Deutsch</Text>
                    {lang === 'de' ? <View style={styles.activeCircle} /> : ''}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={lang === 'fr' ? styles.activeButton : styles.button}
                    onPress={() => setNewLanguage('fr')}>
                    <Text style={styles.buttonText}>Français</Text>
                    {lang === 'fr' ? <View style={styles.activeCircle} /> : ''}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={lang === 'sw' ? styles.activeButton : styles.button}
                    onPress={() => setNewLanguage('sw')}>
                    <Text style={styles.buttonText}>Schweizerisch</Text>
                    {lang === 'sw' ? <View style={styles.activeCircle} /> : ''}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={lang === 'pl' ? styles.activeButton : styles.button}
                    onPress={() => setNewLanguage('pl')}>
                    <Text style={styles.buttonText}>Polski</Text>
                    {lang === 'pl' ? <View style={styles.activeCircle} /> : ''}
                  </TouchableOpacity>
                </ScrollView>
              </View>
            ) : (
              ''
            )}
          </ScrollView>
        ) : (
          <Loading />
        )}

        {avatarModal ? (
          <Avatars
            modalVisible={avatarModal}
            setModalVisible={setAvatarModal}
            translations={translations}
          />
        ) : (
          ''
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarImage: {
    alignSelf: 'center',
    width: width * 0.5,
    height: width * 0.5,
    objectFit: 'contain',
    marginLeft: 15,
  },
  scrollView: {
    paddingVertical: 80,
  },
  textInput: {
    width: width * 0.8,
    alignSelf: 'center',
    height: 60,
    marginTop: 30,
    backgroundColor: COLORS.white,
    textAlign: 'left',
    fontFamily: FONTS.bold,
    fontSize: 17,
    borderRadius: 12,
    paddingLeft: 20,
    lineHeight: 20,
  },
  languagesInputContainer: {
    width: '100%',
    marginTop: 20,
    position: 'relative',
  },
  languageInput: {
    width: width * 0.8,
    alignSelf: 'center',
    height: 60,
    marginTop: 30,
    backgroundColor: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 17,
    borderRadius: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  polygon: {
    width: 20,
    height: 20,
    objectFit: 'contain',
    zIndex: 101,
  },
  content: {
    width: '80%',
    height: '40%',
    alignSelf: 'center',
    backgroundColor: COLORS.white,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    marginTop: -10,
  },
  activeButton: {
    paddingHorizontal: 20,
    height: (height * 0.35) / 8,
    borderBottomWidth: 1,
    borderColor: COLORS.black,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  button: {
    paddingHorizontal: 20,
    height: (height * 0.35) / 8,
    borderBottomWidth: 1,
    borderColor: COLORS.black,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: FONTS.bold,
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 22,
    color: COLORS.green,
  },
  languageText: {
    textAlign: 'left',
    fontFamily: FONTS.bold,
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.green,
    lineHeight: 22,
  },
  activeCircle: {
    width: 15,
    height: 15,
    borderRadius: 50,
    backgroundColor: COLORS.green,
  },
  changeAvatarContainer: {
    backgroundColor: COLORS.priceTextColor,
    width: width * 0.5,
    height: width * 0.5,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 120,
  },
  changeAvatarText: {
    fontFamily: FONTS.bold,
    color: COLORS.green,
  },
});
