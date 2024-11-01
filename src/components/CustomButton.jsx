import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {COLORS, FONTS} from '../helpers/colors';

export default function CustomButton({text, onPress}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text style={styles.text}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 50,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 25,
    width: '80%',
    backgroundColor: '#1854AC',
    alignSelf: 'center',
  },
  text: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
  },
  image: {
    height: 60,
    objectFit: 'contain',
    position: 'absolute',
    right: -20,
  },
});
