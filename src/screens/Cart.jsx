import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Text,
  ScrollView,
} from 'react-native';
import {globalStyles} from '../styles';
import BackgroundImage from '../assets/image/cart_background.png';
import Header from '../components/Header';
import {useNavigation} from '@react-navigation/native';
import {GlobalContext} from '../components/GlobalContext';
import {useGetRequest, usePostRequest} from '../helpers/hooks';
import {ORDER, TRANSLATE} from '../helpers/urls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../components/Loading';
import {COLORS, FONTS} from '../helpers/colors';
import CustomButton from '../components/CustomButton';
import CartItem from '../components/CartItem';
import {currency} from '../helpers/avatars';

export default function Cart() {
  const navigation = useNavigation();
  const {lang, refresh, setRefresh} = useContext(GlobalContext);
  const [translations, setTranslations] = useState([]);
  const [cart, setCart] = useState([]);
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const getLanguagesRequest = useGetRequest({url: TRANSLATE});
  const orderRequest = usePostRequest({url: ORDER});

  const getLanguages = async () => {
    const {response} = await getLanguagesRequest.request();
    if (response?.length) {
      setTranslations(response);
    }
  };

  const order = async () => {
    setLoading(true);
    const {response} = await orderRequest.request();
    if (response) {
      await AsyncStorage.setItem('cartList', '');
      navigation.navigate('CartSuccess', {qrImage: response?.res});
      setLoading(false);
      setRefresh(!refresh);
    }
  };

  useEffect(() => {
    getLanguages();
  }, []);

  useEffect(() => {
    const getCart = async () => {
      const list = await AsyncStorage.getItem('cartList');
      if (list?.length) {
        setCart(JSON.parse(list));
      } else {
        setCart(null);
      }
    };

    getCart();
  }, [refresh]);

  useEffect(() => {
    if (cart?.length) {
      let sum = 0;
      cart.forEach(product => {
        sum += product.price * product.count;
      });

      setPrice(sum);
    }
  }, [cart, refresh]);

  return (
    <View style={globalStyles.container}>
      <ImageBackground source={BackgroundImage} style={globalStyles.container}>
        <Header />

        {cart && cart.length && translations?.length ? (
          <>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {translations.find(item => item?.en === 'Order')[lang]}
              </Text>
            </View>

            <View style={styles.main}>
              <ScrollView
                style={{flex: 1}}
                contentContainerStyle={{paddingBottom: 50}}>
                {cart.map((item, index) => (
                  <CartItem item={item} key={index} />
                ))}

                <View style={styles.currency}>
                  <Text style={styles.priceTitle}>
                    {
                      translations.find(item => item?.en === 'Total Amount')[
                        lang
                      ]
                    }
                    :
                  </Text>
                  <Text style={styles.price}>
                    {price} {currency}
                  </Text>
                </View>
              </ScrollView>
            </View>

            <CustomButton
              text={translations.find(item => item?.en === 'Place Order')[lang]}
              onPress={() => order()}
              style={{marginTop: 30}}
            />
          </>
        ) : translations?.length ? (
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {
                translations.find(item => item?.en === 'Your cart is empty')[
                  lang
                ]
              }
            </Text>
          </View>
        ) : (
          ''
        )}

        {!translations?.length || loading ? <Loading /> : ''}
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
    backgroundColor: COLORS.priceTextColor,
    width: '80%',
    alignSelf: 'center',
    marginTop: 20,
    height: '60%',
    borderRadius: 12,
    padding: 10,
  },
  currency: {
    width: '60%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginTop: 10,
    padding: 10,
  },
  priceTitle: {
    fontFamily: FONTS.bold,
    color: COLORS.black,
    fontSize: 20,
    lineHeight: 26,
    marginTop: 20,
  },
  price: {
    fontFamily: FONTS.bold,
    color: COLORS.green,
    fontSize: 18,
    lineHeight: 22,
    marginTop: 8,
  },
});
