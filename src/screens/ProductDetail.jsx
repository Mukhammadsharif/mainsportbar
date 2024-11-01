import React, {useContext, useEffect, useState} from 'react';
import {
  ImageBackground,
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {globalStyles} from '../styles';
import {useGetRequest} from '../helpers/hooks';
import {TRANSLATE} from '../helpers/urls';
import BackgroundImage from '../assets/image/product_detail_background_2.png';
import Header from '../components/Header';
import Loading from '../components/Loading';
import {GlobalContext} from '../components/GlobalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS, FONTS} from '../helpers/colors';
import DecrementIcon from '../assets/icon/decrement_icon.png';
import IncrementIcon from '../assets/icon/increment_icon.png';
import {StrokeText} from '@charmy.tech/react-native-stroke-text';
import {currency} from '../helpers/avatars';

export default function ProductDetail({route}) {
  const {product} = route.params;
  const [translations, setTranslations] = useState([]);
  const getLanguagesRequest = useGetRequest({url: TRANSLATE});
  const {refresh, setRefresh, lang} = useContext(GlobalContext);
  const [added, setAdded] = useState(false);
  const [carts, setCarts] = useState([]);

  const add = async menuProduct => {
    const cartList = await AsyncStorage.getItem('cartList');
    if (cartList) {
      const cartArray = JSON.parse(cartList);
      const existProduct = cartArray.find(
        cart => cart.title.en === menuProduct.title.en,
      );
      if (!existProduct) {
        cartArray.push({...menuProduct, count: 1});
        await AsyncStorage.setItem('cartList', JSON.stringify(cartArray));
      }
    } else {
      const cartArray = [];
      cartArray.push({...menuProduct, count: 1});
      await AsyncStorage.setItem('cartList', JSON.stringify(cartArray));
    }
    await setRefresh(!refresh);
  };

  const trash = async menuProduct => {
    const cartList = await AsyncStorage.getItem('cartList');
    if (cartList) {
      const cartArray = JSON.parse(cartList);
      const existProduct = cartArray.find(
        cart => cart.title.en === menuProduct.title.en,
      );
      if (existProduct) {
        const newArray = cartArray.filter(
          cart => cart.title.en !== menuProduct.title.en,
        );
        await AsyncStorage.setItem('cartList', JSON.stringify(newArray));
      }
    }
    await setRefresh(!refresh);
  };

  const define = async menuProduct => {
    const cartList = await AsyncStorage.getItem('cartList');
    if (cartList) {
      const cartArray = JSON.parse(cartList);
      const existProduct = cartArray.find(
        cart => cart.title.en === menuProduct.title.en,
      );
      if (existProduct) {
        await trash(menuProduct);
      } else {
        await add(menuProduct);
      }
    } else {
      await add(menuProduct);
    }
  };

  useEffect(() => {
    const getProduct = async () => {
      const cartList = await AsyncStorage.getItem('cartList');
      if (cartList) {
        const cartArray = JSON.parse(cartList);
        const existProduct = cartArray.find(
          cart => cart.title.en === product.title.en,
        );
        if (existProduct) {
          setAdded(true);
        } else {
          setAdded(false);
        }
      } else {
        setAdded(false);
      }
    };

    getProduct();
  }, [refresh]);

  useEffect(() => {
    const getCartList = async () => {
      const cartList = await AsyncStorage.getItem('cartList');
      if (cartList?.length) {
        setCarts(JSON.parse(cartList));
      }
    };

    getCartList();
  }, [refresh]);

  const increment = async () => {
    if (carts?.length) {
      const updatedCarts = carts.map(menuProduct => {
        if (menuProduct.title.en === product.title.en) {
          return {...menuProduct, count: menuProduct.count + 1}; // Increment count
        }
        return menuProduct;
      });
      await AsyncStorage.setItem('cartList', JSON.stringify(updatedCarts));
      await setRefresh(!refresh); // Trigger refresh
    }
  };

  const decrement = async () => {
    if (carts?.length) {
      const updatedCarts = carts.map(menuProduct => {
        if (
          menuProduct.title.en === product.title.en &&
          menuProduct.count > 0
        ) {
          return {...menuProduct, count: menuProduct.count - 1}; // Decrease count
        }
        return menuProduct;
      });
      await AsyncStorage.setItem('cartList', JSON.stringify(updatedCarts));
      await setRefresh(!refresh); // Trigger refresh
    }
  };

  const deleteItem = async () => {
    if (carts?.length) {
      const newArray = carts.filter(
        menuProduct => menuProduct.title.en !== product.title.en,
      );
      await setCarts(newArray);
      await AsyncStorage.setItem('cartList', JSON.stringify(newArray));
      await setRefresh(!refresh);
    }
  };

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

        {product && translations?.length ? (
          <View style={styles.main}>
            <View style={styles.imageContainer}>
              <Image source={{uri: product?.image}} style={styles.image} />
            </View>

            {added ? (
              <View style={styles.row}>
                <View style={styles.plusContainer}>
                  <Text style={styles.plusText}>
                    {carts.find(pr => pr.title.en === product.title.en)?.count}
                  </Text>
                </View>

                <View style={styles.countContainer}>
                  <TouchableOpacity
                    style={styles.actionContainer}
                    onPress={() => {
                      if (
                        carts.find(pr => product.name === product.name).count >
                        1
                      ) {
                        decrement();
                      } else {
                        deleteItem();
                      }
                    }}>
                    <Image source={DecrementIcon} style={styles.decrement} />
                  </TouchableOpacity>

                  <View style={styles.statusContainer}>
                    <Text style={styles.status}>
                      {translations.find(t => t?.en === 'Added')[lang]}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.actionContainer}
                    onPress={() => increment()}>
                    <Image source={IncrementIcon} style={styles.increment} />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.plusContainer}
                  onPress={() => define(product)}>
                  <Text style={styles.plusText}>+</Text>
                </TouchableOpacity>

                <View style={{flex: 0.3}}>
                  <StrokeText
                    text={`${product?.price} ${currency}`}
                    fontSize={38}
                    color={COLORS.priceTextColor}
                    strokeColor={COLORS.brown}
                    strokeWidth={3}
                    fontFamily={FONTS.blackRegular}
                    align={'right'}
                  />
                </View>
              </View>
            )}

            <View style={styles.textContainer}>
              <Text style={styles.title}>{product?.title[lang]}</Text>
              <Text style={styles.description}>{product?.desc[lang]}</Text>
            </View>
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
    flex: 1,
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    width: Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').width * 0.8,
    backgroundColor: COLORS.white,
    alignSelf: 'center',
    marginTop: Dimensions.get('window').width * 0.2,
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: COLORS.brown,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '90%',
    height: '90%',
    borderRadius: 15,
    objectFit: 'contain',
  },
  plusContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.brown,
    borderRadius: 25,
    width: 40,
    height: 40,
    marginLeft: 20,
  },
  plusText: {
    fontFamily: FONTS.blackRegular,
    color: COLORS.white,
    fontSize: 25,
    fontWeight: 'bold',
  },
  countContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  actionContainer: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  status: {
    fontSize: 25,
    fontFamily: FONTS.normal,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  statusContainer: {
    backgroundColor: COLORS.brown,
    padding: 5,
    borderRadius: 35,
  },
  increment: {
    width: 35,
    height: 35,
  },
  decrement: {
    width: 35,
    height: 35,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  textContainer: {
    position: 'absolute',
    bottom: Dimensions.get('window').width * 0.2,
    left: 0,
    right: 0,
  },
  title: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: COLORS.brown,
    lineHeight: 28,
    textAlign: 'center',
    width: '80%',
    alignSelf: 'center',
  },
  description: {
    fontSize: 15,
    fontFamily: FONTS.blackRegular,
    color: COLORS.brown,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 15,
    width: '80%',
    alignSelf: 'center',
  },
});
