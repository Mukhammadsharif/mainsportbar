import React, {useContext} from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {avatars} from '../helpers/avatars';
import {GlobalContext} from './GlobalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS} from '../helpers/colors';

export default function Avatars({modalVisible, setModalVisible}) {
  const {avatar, setAvatar} = useContext(GlobalContext);
  const avatarArray = [1, 4, 7, 10, 13];

  const setNewAvatar = name => {
    AsyncStorage.setItem('avatar', name).then(r => console.log(r));
    setAvatar(name);
    setModalVisible(!modalVisible);
  };

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onDismiss={() => setModalVisible(!modalVisible)}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.content}>
              <ScrollView contentContainerStyle={styles.scrollView}>
                {avatars?.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.avatarContainer}
                    onPress={() => setNewAvatar(item?.name)}>
                    <Image
                      source={item.image}
                      style={
                        avatarArray.includes(index)
                          ? styles.avatarSelectedImage
                          : styles.avatarImage
                      }
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  modalView: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    width: Dimensions.get('window').width / 3,
    objectFit: 'contain',
    alignSelf: 'center',
  },
  content: {
    width: '100%',
    height: '80%',
    alignSelf: 'center',
    backgroundColor: COLORS.card,
    zIndex: 101,
    borderRadius: 20,
    borderColor: COLORS.black,
    borderWidth: 5,
    marginTop: 20,
  },
  scrollView: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  avatarImage: {
    width: Dimensions.get('window').width / 5,
    height: Dimensions.get('window').width / 5,
    objectFit: 'contain',
  },
  avatarSelectedImage: {
    width: Dimensions.get('window').width / 3.7,
    height: Dimensions.get('window').width / 3.7,
    objectFit: 'contain',
  },
  avatarContainer: {
    margin: 5,
  },
  avatarContainerActive: {
    margin: 5,
    borderWidth: 5,
    borderColor: 'white',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  circle: {
    backgroundColor: '#870C9D',
    width: 10,
    height: 10,
    borderRadius: 50,
    position: 'absolute',
    top: -5,
    zIndex: 101,
  },
});
