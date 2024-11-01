import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GlobalContext} from './GlobalContext';
import {currency} from '../helpers/avatars';
import {COLORS, FONTS} from '../helpers/colors';

export default function CartItem({item}) {
  const {refresh, lang} = useContext(GlobalContext);
  const [carts, setCarts] = useState([]);

  useEffect(() => {
    const getCartList = async () => {
      const cartList = await AsyncStorage.getItem('cartList');
      if (cartList?.length) {
        setCarts(JSON.parse(cartList));
      }
    };

    getCartList();
  }, [refresh]);

  const countTranslation = {
    de: 'stk.',
    en: 'pcs.',
    es: 'uds.',
    fr: 'pcs',
    it: 'pz',
    pl: 'szt.',
    ru: 'шт.',
    sw: 'st.',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item?.title[lang]}</Text>
      <View style={styles.row}>
        <Text style={styles.count}>
          {carts.find(product => product.title.en === item.title.en)?.count}{' '}
          {countTranslation[lang]}
        </Text>

        <Text style={styles.currencyText}>
          {item?.price} {currency}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 15,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 12,
  },
  currencyText: {
    fontFamily: FONTS.bold,
    color: COLORS.green,
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  title: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.green,
    lineHeight: 24,
  },
  count: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: COLORS.priceTextColor,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
