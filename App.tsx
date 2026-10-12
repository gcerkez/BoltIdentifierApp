import 'react-native-gesture-handler';
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
import ReferenceItems from './src/screens/ReferenceItems';
import HistoryScreen from './src/screens/HistoryScreen';
import {Theme} from './src/constants/Theme';

const Tab = createBottomTabNavigator();

const renderTabBarIcon = (routeName: string, color: string, size: number) => {
  let icon = faCamera;

  if (routeName === 'Analyze Bolt') {
    icon = faCamera;
  } else if (routeName === 'Reference Items') {
    icon = faList;
  } else if (routeName === 'History') {
    icon = faHistory;
  }

  return <FontAwesomeIcon icon={icon} size={size} color={color} />;
};

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <NavigationContainer>
      <SafeAreaView style={[styles.safeArea, backgroundStyle]}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <Tab.Navigator
          initialRouteName="Analyze Bolt"
          screenOptions={({route}) => ({
            headerStyle: {
              backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
            },
            headerTintColor: isDarkMode ? '#ffffff' : '#0f172a',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            tabBarActiveTintColor: Theme.colors.primary,
            tabBarInactiveTintColor: Theme.colors.textMuted,
            tabBarStyle: {
              backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
              borderTopColor: Theme.colors.border,
            },
            tabBarIcon: ({color, size}) => renderTabBarIcon(route.name, color, size),
          })}>
          <Tab.Screen name="Analyze Bolt" component={CameraScreen} />
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
