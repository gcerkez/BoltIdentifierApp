import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'lightblue', // Added background color for visibility
  },
  pickerContainer: {
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  required: {
    color: 'red',
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#ffffff',
    borderRadius: 5,
    elevation: 2, // Add elevation for Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
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
  cameraButtonDisabled: {
    backgroundColor: '#cccccc', // Disabled state color
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
    position: 'absolute', // Added to position the button at the bottom
    bottom: 15, // Adjust as needed
    left: 16,
    right: 16,
    backgroundColor: '#007bff', // Example color for enabled state
    padding: 10,
  },
  resetButtonText: {
    color: '#ffffff',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
  },
  metadataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  metadataText: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default styles;
