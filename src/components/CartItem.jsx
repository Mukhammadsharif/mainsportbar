import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GlobalContext} from './GlobalContext';
import {currency} from '../helpers/avatars';
import {COLORS, FONTS} from '../helpers/colors';
import LinearGradient from 'react-native-linear-gradient';
import DeleteIcon from '../images/others/delete_icon.png';

export default function CartItem({item}) {
  const {refresh, setRefresh, lang} = useContext(GlobalContext);
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

  const increment = async () => {
    if (carts?.length) {
      const updatedCarts = carts.map(product => {
        if (product.title.en === item.title.en) {
          return {...product, count: product.count + 1};
        }
        return product;
      });
      await AsyncStorage.setItem('cartList', JSON.stringify(updatedCarts));
      await setRefresh(!refresh);
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
    <LinearGradient
      colors={['#FFFFFF', '#0099FF']}
      locations={[0, 0.7]}
      style={styles.main}>
      <View style={styles.container}>
        <View style={styles.rightContainer}>
          <View style={styles.row}>
            <Text style={styles.title}>{item?.title[lang]}</Text>

            <TouchableOpacity onPress={() => deleteItem()}>
              <Image source={DeleteIcon} style={styles.deleteIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.rightFooter}>
            <View style={styles.countContainer}>
              <TouchableOpacity
                style={[styles.actionContainer, {paddingHorizontal: 10}]}
                onPress={() => {
                  if (
                    carts.find(product => product.title.en === item.title.en)
                      .count > 1
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

            <View>
              <Text style={styles.currencyText}>
                {item?.price} {currency}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  main: {
    width: '100%',
    alignSelf: 'center',
  },
  container: {
    width: '100%',
    marginTop: 15,
    flexDirection: 'row',
  },
  image: {
    width: 120,
    height: 120,
  },
  rightContainer: {
    paddingHorizontal: 15,
  },
  rightFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
    width: '100%',
  },
  currency: {
    backgroundColor: '#0D1771',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currencyText: {
    fontFamily: FONTS.interBold,
    color: COLORS.main,
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontFamily: FONTS.regular,
    color: COLORS.black,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.main,
    width: '50%',
    paddingBottom: 10,
  },
  weight: {
    fontSize: 12,
    fontFamily: 'DaysOne-Regular',
    marginTop: 10,
    opacity: 0.5,
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
  line: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: COLORS.drawerText,
    height: 1.5,
    marginTop: 10,
  },
  deleteIcon: {
    width: 10,
    height: 10,
    zIndex: 101,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
