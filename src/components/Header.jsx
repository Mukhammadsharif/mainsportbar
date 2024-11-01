import React, {useContext} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  Platform,
} from 'react-native';
import DrawerIcon from '../assets/icon/drawer_icon.png';
import {useNavigation} from '@react-navigation/native';
import {GlobalContext} from './GlobalContext';
import {COLORS, FONTS} from '../helpers/colors';

export default function Header({
  background,
  back = true,
  drawer = true,
  route = null,
}) {
  const navigation = useNavigation();
  const {lang} = useContext(GlobalContext);
  const translations = {
    de: 'Zurück',
    en: 'Back',
    es: 'Atrás',
    fr: 'Retour',
    it: 'Indietro',
    pl: 'Wstecz',
    ru: 'Назад',
    sw: 'Tillbaka',
  };

  return (
    <View style={[styles.container, {backgroundColor: background}]}>
      {back ? (
        <TouchableOpacity
          onPress={() => {
            if (route) {
              navigation.navigate(route);
            } else {
              navigation.goBack();
            }
          }}
          style={styles.backContainer}>
          <Text style={styles.backText}>{translations[lang]}</Text>
        </TouchableOpacity>
      ) : (
        <View />
      )}

      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        {drawer ? <Image source={DrawerIcon} style={styles.drawerIcon} /> : ''}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: Platform.OS === 'ios' ? 45 : 20,
  },
  backIcon: {
    width: 25,
    height: 25,
    objectFit: 'contain',
  },
  drawerIcon: {
    width: 25,
    height: 25,
    objectFit: 'contain',
  },
  backContainer: {
    marginLeft: '10%',
    backgroundColor: COLORS.brownFill,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.brown,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backText: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: COLORS.brown,
    lineHeight: 28,
  },
});
