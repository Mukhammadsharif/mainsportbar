import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
  ImageBackground,
} from 'react-native';
import {GlobalContext} from './components/GlobalContext';
import {useGetRequest} from './helpers/hooks';
import {COLORS, FONTS} from './helpers/colors';
import {TRANSLATE} from './helpers/urls';
import BackgroundImage from './images/backgrounds/account.png';
import HeaderImage from './images/others/logo.png';
import CloseIcon from './images/others/close_icon.png';
import Main from './pages/Main';
import LinearGradient from 'react-native-linear-gradient';
import Cart from './pages/Cart';
import Account from './pages/Account';
import CartConfirm from './pages/CartConfirm';
import Translations from './pages/Translations';
import Reserve from './pages/Reserve';
import ReserveConfirm from './pages/ReserveConfirm';
import Events from './pages/Events';
import Meal from './pages/Meal';
import Ice from './pages/Ice';
import Football from './pages/Football';
import Basketball from './pages/Basketball';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const {width, height} = Dimensions.get('window');

export default function Navigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen component={DrawerNavigator} name="DrawerNavigator" />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          width: width,
        },
        headerShown: false,
      }}
      drawerContent={props => <CustomDrawerNavigator {...props} />}>
      <Drawer.Screen name="Main" component={Main} />
      <Drawer.Screen name="Cart" component={Cart} />
      <Drawer.Screen name="Account" component={Account} />
      <Drawer.Screen name="CartConfirm" component={CartConfirm} />
      <Drawer.Screen name="Translations" component={Translations} />
      <Drawer.Screen name="Reserve" component={Reserve} />
      <Drawer.Screen name="ReserveConfirm" component={ReserveConfirm} />
      <Drawer.Screen name="Events" component={Events} />
      <Drawer.Screen name="Meal" component={Meal} />
      <Drawer.Screen name="Ice" component={Ice} />
      <Drawer.Screen name="Football" component={Football} />
      <Drawer.Screen name="Basketball" component={Basketball} />
    </Drawer.Navigator>
  );
}

function CustomDrawerNavigator(props) {
  const navigation = useNavigation();
  const {lang} = useContext(GlobalContext);
  const [translations, setTranslations] = useState([]);
  const getLanguagesRequest = useGetRequest({url: TRANSLATE});

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
    <DrawerContentScrollView {...props} scrollEnabled={false}>
      {translations.length ? (
        <ImageBackground source={BackgroundImage} style={styles.container}>
          <View style={styles.closeIconContainer}>
            <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
              <Image source={CloseIcon} style={styles.close} />
            </TouchableOpacity>
          </View>

          <View style={styles.header}>
            <Image source={HeaderImage} style={styles.drawerLogo} />
          </View>

          <View style={styles.mainContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Main')}
              style={styles.drawerItem}>
              <LinearGradient
                colors={['#0099FF', '#0C033A']}
                locations={[0, 0.94]}
                style={styles.gradient}>
                <Text style={styles.itemText}>
                  {translations.find(item => item?.en === 'Home')[lang]}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Reserve')}
              style={styles.drawerItem}>
              <LinearGradient
                colors={['#0099FF', '#0C033A']}
                locations={[0, 0.94]}
                style={styles.gradient}>
                <Text style={styles.itemText}>
                  {translations.find(item => item?.en === 'Booking')[lang]}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Events')}
              style={styles.drawerItem}>
              <LinearGradient
                colors={['#0099FF', '#0C033A']}
                locations={[0, 0.94]}
                style={styles.gradient}>
                <Text style={styles.itemText}>
                  {translations.find(item => item?.en === 'Events')[lang]}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Translations')}
              style={styles.drawerItem}>
              <LinearGradient
                colors={['#0099FF', '#0C033A']}
                locations={[0, 0.94]}
                style={styles.gradient}>
                <Text style={styles.itemText}>
                  {translations.find(item => item?.en === 'Broadcasts')[lang]}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Cart')}
              style={styles.drawerItem}>
              <LinearGradient
                colors={['#0099FF', '#0C033A']}
                locations={[0, 0.94]}
                style={styles.gradient}>
                <Text style={styles.itemText}>
                  {translations.find(item => item?.en === 'Cart')[lang]}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Account')}
              style={styles.drawerItem}>
              <LinearGradient
                colors={['#0099FF', '#0C033A']}
                locations={[0, 0.94]}
                style={styles.gradient}>
                <Text style={styles.itemText}>
                  {translations.find(item => item?.en === 'Account')[lang]}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      ) : (
        ''
      )}
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
    alignItems: 'center',
  },
  drawerLogo: {
    width: width / 2,
    height: width / 2.7,
    marginBottom: 20,
  },
  mainContainer: {
    marginTop: 30,
    width: width,
    alignItems: 'center',
  },
  drawerItem: {
    height: 60,
    marginTop: 15,
    width: '60%',
  },
  itemText: {
    fontSize: 25,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  closeIconContainer: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  close: {
    width: 40,
    height: 40,
  },
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
});
