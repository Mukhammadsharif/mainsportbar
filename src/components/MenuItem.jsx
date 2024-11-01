import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GlobalContext} from './GlobalContext';
import {currency} from '../helpers/avatars';
import {COLORS, FONTS} from '../helpers/colors';

export default function MenuItem({item, translations}) {
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
    <View style={styles.main}>
      <View style={styles.container}>
        <Image source={{uri: item?.image}} style={styles.image} />
        <View style={styles.rightContainer}>
          <View style={styles.row}>
            <Text style={styles.title}>{item?.title[lang]}</Text>
            <Text style={styles.currencyText}>
              {item?.price} {currency}
            </Text>
          </View>
          <Text style={styles.weight}>{item?.desc[lang]}</Text>
          <View style={styles.rightFooter}>
            {added ? (
              <View style={styles.countContainer}>
                <TouchableOpacity
                  style={[styles.actionContainer, {paddingHorizontal: 10}]}
                  onPress={() => {
                    if (
                      carts.find(product => product.name === item.name).count >
                      1
                    ) {
                      decrement();
                    } else {
                      deleteItem();
                    }
                  }}>
                  <Text style={styles.decrement}>-</Text>
                </TouchableOpacity>

                <Text style={styles.count}>
                  {
                    carts.find(product => product.title.en === item.title.en)
                      ?.count
                  }
                </Text>

                <TouchableOpacity
                  style={styles.actionContainer}
                  onPress={() => increment()}>
                  <Text style={styles.increment}>+</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.plusContainer}
                onPress={() => define(item)}>
                <Text style={styles.plusText}>
                  {translations.find(tr => tr?.en === 'Add')[lang]}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    width: '100%',
    backgroundColor: COLORS.card,
    borderBottomWidth: 8,
    borderColor: 'rgba(0, 0, 0, 0.3)',
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: '100%',
    borderRadius: 90,
    marginLeft: -30,
    borderWidth: 2,
    borderColor: COLORS.white,
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
  currency: {
    backgroundColor: '#FFA600',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 50,
  },
  currencyText: {
    fontSize: 20,
    fontFamily: FONTS.interBold,
    color: COLORS.black,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontFamily: FONTS.interBold,
    color: COLORS.black,
    fontWeight: 'bold',
  },
  weight: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: COLORS.main,
    marginTop: 5,
    width: '100%',
    paddingRight: 20,
  },
  plusContainer: {
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLORS.drawerText,
    borderBottomWidth: 1,
    backgroundColor: COLORS.main,
    paddingHorizontal: 6,
    borderRadius: 25,
  },
  plusText: {
    fontFamily: FONTS.interBold,
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  countContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: COLORS.main,
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 25,
  },
  actionContainer: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    marginHorizontal: 15,
    fontSize: 15,
    fontFamily: FONTS.interBold,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  increment: {
    fontFamily: FONTS.interBold,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  decrement: {
    fontFamily: FONTS.interBold,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  row: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
