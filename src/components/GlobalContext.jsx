import React, {createContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const GlobalContext = createContext({});

export function GlobalProvider({children}) {
  const [refresh, setRefresh] = useState(false);
  const [lang, setLang] = useState('ru');
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState('');

  const getLocale = async () => {
    const language = await AsyncStorage.getItem('language');
    const localAvatar = await AsyncStorage.getItem('avatar');
    const localName = await AsyncStorage.getItem('name');
    if (language) {
      setLang(language);
    }

    if (localAvatar) {
      setAvatar(localAvatar);
    }

    if (localName) {
      setName(localName);
    }
  };

  useEffect(() => {
    getLocale();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        refresh,
        setRefresh,
        lang,
        setLang,
        avatar,
        setAvatar,
        name,
        setName,
      }}>
      {children}
    </GlobalContext.Provider>
  );
}
