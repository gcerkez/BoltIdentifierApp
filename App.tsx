import 'react-native-gesture-handler'; // Add this import at the top
import React from 'react';

import {SafeAreaView, StatusBar, useColorScheme, StyleSheet} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CameraScreen from './src/screens/CameraScreen';
import RegisteredItems from './src/screens/RegisteredItems';
import HistoryScreen from './src/screens/HistoryScreen';

const Tab = createBottomTabNavigator();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  console.log('Rendering App');

  return (
    <NavigationContainer>
      <SafeAreaView style={[styles.safeArea, backgroundStyle]}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <Tab.Navigator initialRouteName="Home">
          <Tab.Screen name="Camera" component={CameraScreen} />
          <Tab.Screen name="Registered Items" component={RegisteredItems} />
          <Tab.Screen name="History" component={HistoryScreen} />
        </Tab.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});

export default App;