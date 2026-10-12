/* eslint-env jest */
require('react-native-gesture-handler/jestSetup');

const RN = require('react-native');

// Mock Keyboard
if (RN.Keyboard) {
  RN.Keyboard.addListener = jest.fn(() => ({ remove: jest.fn() }));
  RN.Keyboard.removeListener = jest.fn();
  RN.Keyboard.removeAllListeners = jest.fn();
}

// Mock BackHandler
jest.mock('react-native/Libraries/Utilities/BackHandler', () => ({
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  removeEventListener: jest.fn(),
  exitApp: jest.fn(),
}));

// Mock Linking
jest.mock('react-native/Libraries/Linking/Linking', () => {
  const mockLinking = {
    addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    removeEventListener: jest.fn(),
    openURL: jest.fn(),
    canOpenURL: jest.fn(() => Promise.resolve(true)),
    getInitialURL: jest.fn(() => Promise.resolve(null)),
    sendIntent: jest.fn(),
  };
  return {
    __esModule: true,
    default: mockLinking,
    ...mockLinking,
  };
});
if (RN.Linking) {
  RN.Linking.addEventListener = jest.fn(() => ({ remove: jest.fn() }));
  RN.Linking.removeEventListener = jest.fn();
}

// Mock useBackButton for React Navigation
try {
  jest.mock('@react-navigation/native/lib/commonjs/useBackButton.native', () => () => {});
  jest.mock('@react-navigation/native/src/useBackButton', () => () => {});
  jest.mock('@react-navigation/native/lib/commonjs/useLinking.native', () => () => ({
    getInitialState: () => Promise.resolve(undefined),
  }));
  jest.mock('@react-navigation/native/src/useLinking', () => () => ({
    getInitialState: () => Promise.resolve(undefined),
  }));
} catch (e) {}

// Mock @react-navigation/bottom-tabs
jest.mock('@react-navigation/bottom-tabs', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    createBottomTabNavigator: () => ({
      Navigator: ({ children }) => React.createElement(View, { testID: 'tab-navigator' }, children),
      Screen: ({ component: Component, children }) =>
        Component ? React.createElement(Component) : children || null,
    }),
  };
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Mock react-native-fs
jest.mock('react-native-fs', () => ({
  readFile: jest.fn().mockResolvedValue('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='),
  writeFile: jest.fn().mockResolvedValue(undefined),
  unlink: jest.fn().mockResolvedValue(undefined),
  exists: jest.fn().mockResolvedValue(true),
  DocumentDirectoryPath: '/mock/documents',
}));

// Mock react-native-image-resizer
jest.mock('@bam.tech/react-native-image-resizer', () => ({
  default: {
    createResizedImage: jest.fn().mockResolvedValue({
      uri: 'file://mock-resized.jpg',
      width: 600,
      height: 600,
      size: 2048,
      name: 'mock-resized.jpg',
    }),
  },
  createResizedImage: jest.fn().mockResolvedValue({
    uri: 'file://mock-resized.jpg',
    width: 600,
    height: 600,
    size: 2048,
    name: 'mock-resized.jpg',
  }),
}));

// Mock react-native-image-picker
jest.mock('react-native-image-picker', () => ({
  launchCamera: jest.fn(),
  launchImageLibrary: jest.fn(),
}));

// Mock @fortawesome/react-native-fontawesome
jest.mock('@fortawesome/react-native-fontawesome', () => ({
  FontAwesomeIcon: 'FontAwesomeIcon',
}));

// Mock @react-native-picker/picker
jest.mock('@react-native-picker/picker', () => {
  const React = require('react');
  const { View } = require('react-native');
  const Picker = (props) => React.createElement(View, props, props.children);
  Picker.Item = (props) => React.createElement(View, props);
  return { Picker };
});

// Mock @react-native-community/checkbox
jest.mock('@react-native-community/checkbox', () => {
  const React = require('react');
  const { View } = require('react-native');
  return (props) => React.createElement(View, props);
});
