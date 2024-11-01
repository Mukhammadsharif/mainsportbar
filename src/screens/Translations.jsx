import React, {useContext, useEffect, useState} from 'react';
import {GlobalContext} from '../components/GlobalContext';
import {useGetRequest} from '../helpers/hooks';
import {BROADCASTS, TRANSLATE} from '../helpers/urls';
import {globalStyles} from '../styles';
import BackgroundImage from '../assets/image/translation_background.png';
import Header from '../components/Header';
import {
  ImageBackground,
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import {COLORS, FONTS} from '../helpers/colors';
import Loading from '../components/Loading';
import MenuBackgroundImage from '../assets/image/inactive_menu.png';
import BallIcon from '../assets/image/ball.png';

const {width, height} = Dimensions.get('window');
export default function Translations() {
  const {lang} = useContext(GlobalContext);
  const [translations, setTranslations] = useState([]);
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const getLanguagesRequest = useGetRequest({url: TRANSLATE});
  const broadcastsRequest = useGetRequest({url: BROADCASTS});

  const getLanguages = async () => {
    const {response} = await getLanguagesRequest.request();
    if (response?.length) {
      setTranslations(response);
    }
  };

  const getBroadcasts = async () => {
    const {response} = await broadcastsRequest.request();
    if (response?.length) {
      setBroadcasts(response);
    }
  };

  useEffect(() => {
    getLanguages();
    getBroadcasts();
  }, []);

  return (
    <View style={globalStyles.container}>
      <ImageBackground source={BackgroundImage} style={globalStyles.container}>
        <Header />

        {translations?.length ? (
          <>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {translations.find(item => item?.en === 'Broadcasts')[lang]}
              </Text>
            </View>

            <ScrollView
              style={{flex: 1}}
              contentContainerStyle={styles.scrollView}>
              {broadcasts?.map((item, index) => (
                <View key={index} style={styles.container}>
                  <View style={styles.left}>
                    <Text style={styles.league}>{item?.liga}</Text>
                    <Image source={BallIcon} style={styles.ballIcon} />
                  </View>
                  <View style={styles.right}>
                    <ImageBackground
                      source={MenuBackgroundImage}
                      style={styles.drawerImage}
                      imageStyle={styles.drawerImageStyle}>
                      <View style={styles.rightCircle}>
                        <Text style={styles.league}>{item?.date}</Text>
                        <Text style={styles.league}>{item?.time}</Text>
                      </View>

                      <View>
                        <Text style={styles.league}>{item?.team1}</Text>
                        <Text style={styles.league}>{item?.team2}</Text>
                      </View>
                    </ImageBackground>
                  </View>
                </View>
              ))}
            </ScrollView>
          </>
        ) : (
          ''
        )}
      </ImageBackground>

      {!translations?.length || loading ? <Loading /> : ''}
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
  main: {},
  scrollView: {
    paddingBottom: 70,
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  left: {
    width: '40%',
    backgroundColor: COLORS.white,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 5},
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  right: {
    width: '60%',
    height: 100,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 5},
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  league: {
    fontSize: 15,
    lineHeight: 18,
    fontFamily: FONTS.blackRegular,
    color: COLORS.black,
    textAlign: 'center',
  },
  drawerImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  drawerImageStyle: {
    borderRadius: 12,
  },
  ballIcon: {
    width: 50,
    height: 50,
    objectFit: 'contain',
    marginBottom: -20,
  },
  rightCircle: {
    backgroundColor: COLORS.brownFill,
    padding: 10,
    borderRadius: 250,
  },
});
