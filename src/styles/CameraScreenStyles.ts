import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'lightblue', // Added background color for visibility
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  cameraButtonText: {
    color: '#ffffff',
    marginLeft: 10,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginBottom: 0,
    position: 'absolute', // Added to position the button at the bottom
    bottom: 15, // Adjust as needed
    left: 16,
    right: 16,
    backgroundColor: '#007bff', // Example color for enabled state
    padding: 6
  },
  resetButtonText: {
    color: '#ffffff',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default styles;