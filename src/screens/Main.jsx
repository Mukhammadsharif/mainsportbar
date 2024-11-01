import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useGetRequest} from '../helpers/hooks';
import {toCapitalize} from '../helpers/functions';
import Header from '../components/Header';
import Loading from '../components/Loading';
import {GlobalContext} from '../components/GlobalContext';
import {globalStyles} from '../styles';
import {PRODUCTS, TRANSLATE} from '../helpers/urls';
import {COLORS, FONTS} from '../helpers/colors';
import MenuBackgroundImage from '../assets/image/inactive_menu.png';
import BackgroundImage from '../assets/image/home_background.png';

export default function Main() {
  const navigation = useNavigation();
  const {lang, refresh, setRefresh} = useContext(GlobalContext);
  const [translations, setTranslations] = useState([]);
  const [products, setProducts] = useState([]);
  const getLanguagesRequest = useGetRequest({url: TRANSLATE});
  const getProductsRequest = useGetRequest({url: PRODUCTS});

  const getLanguages = async () => {
    const {response} = await getLanguagesRequest.request();
    if (response?.length) {
      setTranslations(response);
    }
  };

  const getProducts = async () => {
    const {response} = await getProductsRequest.request();
    if (response?.length) {
      setProducts(response);
    }
  };

  useEffect(() => {
    getLanguages();
    getProducts();
  }, []);
  return (
    <View style={globalStyles.container}>
      <ImageBackground source={BackgroundImage} style={globalStyles.container}>
        <Header back={false} />
        {translations?.length && products?.length ? (
          <View style={styles.main}>
            <TouchableOpacity
              style={styles.category}
              onPress={() => {
                navigation.navigate('Menu', {
                  products: products.filter(pro => pro.type === 'salads'),
                });
                setRefresh(!refresh);
              }}>
              <ImageBackground
                source={MenuBackgroundImage}
                style={styles.backgroundImage}
                imageStyle={styles.backgroundImageStyle}>
                <Text style={styles.categoryText}>
                  {toCapitalize(
                    translations.find(item => item?.en === 'salads')[lang],
                  )}
                </Text>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.category}
              onPress={() => {
                navigation.navigate('Menu', {
                  products: products.filter(pro => pro.type === 'starters'),
                });
                setRefresh(!refresh);
              }}>
              <ImageBackground
                source={MenuBackgroundImage}
                style={styles.backgroundImage}
                imageStyle={styles.backgroundImageStyle}>
                <Text style={styles.categoryText}>
                  {toCapitalize(
                    translations.find(item => item?.en === 'starters')[lang],
                  )}
                </Text>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.category}
              onPress={() => {
                navigation.navigate('Menu', {
                  products: products.filter(pro => pro.type === 'desserts'),
                });
                setRefresh(!refresh);
              }}>
              <ImageBackground
                source={MenuBackgroundImage}
                style={styles.backgroundImage}
                imageStyle={styles.backgroundImageStyle}>
                <Text style={styles.categoryText}>
                  {toCapitalize(
                    translations.find(item => item?.en === 'desserts')[lang],
                  )}
                </Text>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.category}
              onPress={() => {
                navigation.navigate('Menu', {
                  products: products.filter(pro => pro.type === 'drinks'),
                });
                setRefresh(!refresh);
              }}>
              <ImageBackground
                source={MenuBackgroundImage}
                style={styles.backgroundImage}
                imageStyle={styles.backgroundImageStyle}>
                <Text style={styles.categoryText}>
                  {toCapitalize(
                    translations.find(item => item?.en === 'drinks')[lang],
                  )}
                </Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
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
    height: '100%',
    marginTop: '20%',
  },
  category: {
    width: '90%',
    height: 80,
    marginTop: '10%',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.brown,
  },
  categoryText: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    color: COLORS.brown,
    lineHeight: 40,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImageStyle: {
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
});
