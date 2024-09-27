import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'lightyellow',
  },
  item: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  itemTextContainer: {
    flex: 1,
    marginBottom: 8,
  },
  predefinedItem: {
    backgroundColor: '#e0e0e0',
  },
  predefinedSubscript: {
    fontSize: 10,
    color: 'red',
  },
  customSubscript: {
    fontSize: 10,
    color: 'blue',
  },
  selectedItem: {
    backgroundColor: '#d0f0c0',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  required: {
    borderColor: 'red',
  },
  picker: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#ffffff',
    borderRadius: 5,
    marginBottom: 20,
    elevation: 2, // Add elevation for Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 8,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  itemButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: 16,
  },
  formContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  inlineButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  halfButton: {
    flex: 1,
  },
  buttonGap: {
    width: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageButtonGap: {
    marginBottom: 2,
  },
  smallButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#ff0000',
    borderRadius: 4,
  },
  smallButtonText: {
    fontSize: 12,
    color: '#ffffff',
  },
  roundedCorners: {
    borderRadius: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addItemButtonText: {
    color: '#ffffff',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff', // Example color for enabled state
    padding: 6,
    borderRadius: 5,
    marginBottom: 0,
  },
  addItemButtonDisabled: {
    backgroundColor: '#cccccc', // Example color for disabled state
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
  cameraButtonDisabled: {
    backgroundColor: '#cccccc',
  },
});

export default styles;
