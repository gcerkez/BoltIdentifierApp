import 'react-native-gesture-handler'; // Add this import at the top
import React from 'react';

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCamera, faHistory, faList} from '@fortawesome/free-solid-svg-icons';
import CameraScreen from './src/screens/CameraScreen';
import ReferenceItems from './src/screens/ReferenceItems.tsx';
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
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={({route}) => ({
            tabBarIcon: ({color, size}) => {
              let icon;

              if (route.name === 'Analyze Image') {
                icon = faCamera;
              } else if (route.name === 'Reference Items') {
                icon = faList;
              } else if (route.name === 'History') {
                icon = faHistory;
              }

              return <FontAwesomeIcon icon={icon} size={size} color={color} />;
            },
          })}>
          <Tab.Screen name="Analyze Image" component={CameraScreen} />
          <Tab.Screen name="Reference Items" component={ReferenceItems} />
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
