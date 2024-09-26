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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cameraButton: {
    flex: 0.48, // Half width with some space between
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  cameraButtonDisabled: {
    backgroundColor: '#cccccc', // Disabled state color
  },
  cameraButtonText: {
    color: '#ffffff',
    marginLeft: 10,
  },
  resetButton: {
    flex: 0.48, // Half width with some space between
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
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
    backgroundColor: '#ffffff', // White background for the table
    borderWidth: 1,
    borderColor: '#000000', // Black border for the table
    padding: 10,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#000000', // Black border for rows
    paddingVertical: 5,
  },
  metadataColumn: {
    flex: 2,
    alignItems: 'center',
  },
  metadataText: {
    width:200,
    fontSize: 18,
    flex: 2, // Increase flex to allocate more space for the text
    textAlign: 'center',
  },
  inlinePicker: {
    height: 30,
    width: 100,
  },
});

export default styles;
