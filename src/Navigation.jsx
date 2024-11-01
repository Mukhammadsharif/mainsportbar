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
import Main from './screens/Main';
import CloseIcon from './assets/icon/close.png';
import BackgroundImage from './assets/image/main_background.png';
import HeaderImage from './assets/image/header_image.png';
import MenuBackgroundImage from './assets/image/inactive_menu.png';
import Menu from './screens/Menu';
import ProductDetail from './screens/ProductDetail';
import Profile from './screens/Profile';
import Cart from './screens/Cart';
import CartSuccess from './screens/CartSuccess';
import Reserve from './screens/Reserve';
import ReserveSuccess from './screens/ReserveSuccess';
import Translations from './screens/Translations';
import Events from './screens/Events';
import India from './screens/India';
import Football from './screens/Football';
import Kinder from './screens/Kinder';
import Party from './screens/Party';

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
      <Drawer.Screen name="Menu" component={Menu} />
      <Drawer.Screen name="ProductDetail" component={ProductDetail} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Cart" component={Cart} />
      <Drawer.Screen name="CartSuccess" component={CartSuccess} />
      <Drawer.Screen name="Reserve" component={Reserve} />
      <Drawer.Screen name="ReserveSuccess" component={ReserveSuccess} />
      <Drawer.Screen name="Translations" component={Translations} />
      <Drawer.Screen name="Events" component={Events} />
      <Drawer.Screen name="India" component={India} />
      <Drawer.Screen name="Football" component={Football} />
      <Drawer.Screen name="Kinder" component={Kinder} />
      <Drawer.Screen name="Party" component={Party} />
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
              <ImageBackground
                source={MenuBackgroundImage}
                style={styles.drawerImage}
                imageStyle={styles.drawerImageStyle}>
                <Text style={styles.itemText}>
                  {translations.find(item => item?.en === 'Home')[lang]}
                </Text>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Reserve')}
              style={styles.drawerItem}>
              <ImageBackground
                source={MenuBackgroundImage}
                style={styles.drawerImage}
                imageStyle={styles.drawerImageStyle}>
                <Text style={styles.itemText}>
                  {translations.find(item => item?.en === 'Booking')[lang]}
                </Text>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Events')}
              style={styles.drawerItem}>
              <ImageBackground
                source={MenuBackgroundImage}
                style={styles.drawerImage}
                imageStyle={styles.drawerImageStyle}>
                <Text style={styles.itemText}>
                  {translations.find(item => item?.en === 'Events')[lang]}
                </Text>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Translations')}
              style={styles.drawerItem}>
              <ImageBackground
                source={MenuBackgroundImage}
                style={styles.drawerImage}
                imageStyle={styles.drawerImageStyle}>
                <Text style={styles.itemText}>
                  {translations.find(item => item?.en === 'Broadcasts')[lang]}
                </Text>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Cart')}
              style={styles.drawerItem}>
              <ImageBackground
                source={MenuBackgroundImage}
                style={styles.drawerImage}
                imageStyle={styles.drawerImageStyle}>
                <Text style={styles.itemText}>
                  {translations.find(item => item?.en === 'Cart')[lang]}
                </Text>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Profile')}
              style={styles.drawerItem}>
              <ImageBackground
                source={MenuBackgroundImage}
                style={styles.drawerImage}
                imageStyle={styles.drawerImageStyle}>
                <Text style={styles.itemText}>
                  {translations.find(item => item?.en === 'Account')[lang]}
                </Text>
              </ImageBackground>
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
  },
  drawerLogo: {
    width: width / 1.5,
    height: width / 1.5,
    objectFit: 'contain',
    alignSelf: 'flex-end',
  },
  mainContainer: {
    marginTop: 30,
    width: width,
    alignItems: 'center',
  },
  drawerItem: {
    height: 50,
    marginTop: 15,
    width: '60%',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.brown,
  },
  itemText: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: COLORS.brown,
    lineHeight: 28,
  },
  closeIconContainer: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  close: {
    width: 30,
    height: 30,
  },
  drawerImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerImageStyle: {
    borderRadius: 12,
  },
});
