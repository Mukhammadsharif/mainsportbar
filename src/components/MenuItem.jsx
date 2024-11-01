import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GlobalContext} from './GlobalContext';
import {currency} from '../helpers/avatars';
import {COLORS, FONTS} from '../helpers/colors';
import {StrokeText} from '@charmy.tech/react-native-stroke-text';
import IncrementIcon from '../assets/icon/increment_icon.png';
import DecrementIcon from '../assets/icon/decrement_icon.png';
import {useNavigation} from '@react-navigation/native';

export default function MenuItem({item, translations}) {
  const navigation = useNavigation();
  const {refresh, setRefresh, lang} = useContext(GlobalContext);
  const [added, setAdded] = useState(false);
  const [carts, setCarts] = useState([]);

  const add = async product => {
    const cartList = await AsyncStorage.getItem('cartList');
    if (cartList) {
      const cartArray = JSON.parse(cartList);
      const existProduct = cartArray.find(
        cart => cart.title.en === product.title.en,
      );
      if (!existProduct) {
        cartArray.push({...product, count: 1});
        await AsyncStorage.setItem('cartList', JSON.stringify(cartArray));
      }
    } else {
      const cartArray = [];
      cartArray.push({...product, count: 1});
      await AsyncStorage.setItem('cartList', JSON.stringify(cartArray));
    }
    await setRefresh(!refresh);
  };

  const trash = async product => {
    const cartList = await AsyncStorage.getItem('cartList');
    if (cartList) {
      const cartArray = JSON.parse(cartList);
      const existProduct = cartArray.find(
        cart => cart.title.en === product.title.en,
      );
      if (existProduct) {
        const newArray = cartArray.filter(
          cart => cart.title.en !== product.title.en,
        );
        await AsyncStorage.setItem('cartList', JSON.stringify(newArray));
      }
    }
    await setRefresh(!refresh);
  };

  const define = async product => {
    const cartList = await AsyncStorage.getItem('cartList');
    if (cartList) {
      const cartArray = JSON.parse(cartList);
      const existProduct = cartArray.find(
        cart => cart.title.en === product.title.en,
      );
      if (existProduct) {
        await trash(product);
      } else {
        await add(product);
      }
    } else {
      await add(product);
    }
  };

  useEffect(() => {
    const getProduct = async () => {
      const cartList = await AsyncStorage.getItem('cartList');
      if (cartList) {
        const cartArray = JSON.parse(cartList);
        const existProduct = cartArray.find(
          cart => cart.title.en === item.title.en,
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
      const updatedCarts = carts.map(product => {
        if (product.title.en === item.title.en) {
          return {...product, count: product.count + 1}; // Increment count
        }
        return product;
      });
      await AsyncStorage.setItem('cartList', JSON.stringify(updatedCarts));
      await setRefresh(!refresh); // Trigger refresh
    }
  };

  const decrement = async () => {
    if (carts?.length) {
      const updatedCarts = carts.map(product => {
        if (product.title.en === item.title.en && product.count > 0) {
          return {...product, count: product.count - 1}; // Decrease count
        }
        return product;
      });
      await AsyncStorage.setItem('cartList', JSON.stringify(updatedCarts));
      await setRefresh(!refresh); // Trigger refresh
    }
  };

  const deleteItem = async () => {
    if (carts?.length) {
      const newArray = carts.filter(
        product => product.title.en !== item.title.en,
      );
      await setCarts(newArray);
      await AsyncStorage.setItem('cartList', JSON.stringify(newArray));
      await setRefresh(!refresh);
    }
  };

  return (
    <TouchableOpacity
      style={styles.main}
      onPress={() => {
        setRefresh(!refresh);
        navigation.navigate('ProductDetail', {product: item});
      }}>
      <View style={styles.container}>
        <Image source={{uri: item?.image}} style={styles.image} />

        <Text style={styles.title}>{item?.title[lang]}</Text>
        {added ? (
          <View style={styles.row}>
            <View style={styles.plusContainer}>
              <Text style={styles.plusText}>
                {
                  carts.find(product => product.title.en === item.title.en)
                    ?.count
                }
              </Text>
            </View>

            <View style={styles.countContainer}>
              <TouchableOpacity
                style={styles.actionContainer}
                onPress={() => {
                  if (
                    carts.find(product => product.name === item.name).count > 1
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
              onPress={() => define(item)}>
              <Text style={styles.plusText}>+</Text>
            </TouchableOpacity>

            <View style={{flex: 0.4}}>
              <StrokeText
                text={`${item?.price} ${currency}`}
                fontSize={20}
                color={COLORS.priceTextColor}
                strokeColor={COLORS.brown}
                strokeWidth={3}
                fontFamily={FONTS.blackRegular}
              />
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  main: {
    width: '48%',
    height: 200,
    backgroundColor: COLORS.brownFill,
    marginTop: 40,
    borderRadius: 12,
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginTop: -20,
  },
  rightContainer: {
    marginLeft: 10,
    width: '80%',
    paddingVertical: 15,
  },
  rightFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    width: '90%',
  },
  currencyText: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.priceTextColor,
    borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 5,
  },
  title: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: COLORS.brown,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 18,
    paddingHorizontal: 5,
    height: 40,
  },
  plusContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.brown,
    borderRadius: 25,
    width: 25,
    height: 25,
  },
  plusText: {
    fontFamily: FONTS.blackRegular,
    color: COLORS.white,
    fontSize: 14,
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
    fontSize: 12,
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
    width: 22,
    height: 22,
  },
  decrement: {
    width: 22,
    height: 22,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
});
