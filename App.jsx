import React from 'react';
import {StatusBar} from 'react-native';
import Navigation from './src/Navigation';
import {GlobalProvider} from './src/components/GlobalContext';

export default function App() {
  return (
    <GlobalProvider>
      <StatusBar />
      <Navigation />
    </GlobalProvider>
  );
}
