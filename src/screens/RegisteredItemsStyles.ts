import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'lightyellow', // Added background color for visibility
  },
  item: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'column', // Change to column for vertical layout
    alignItems: 'flex-start', // Align items to the start
    borderWidth: 1, // Add thin border
    borderColor: '#ccc', // Border color
    borderRadius: 4, // Ensure rounded corners
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8, // Add margin to separate header from images
  },
  itemTextContainer: {
    flex: 1,
    marginBottom: 8, // Add margin to separate text from images
  },
  predefinedItem: {
    backgroundColor: '#e0e0e0', // Special background for predefined items
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
    backgroundColor: '#d0f0c0', // Highlight color for selected item
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
    marginBottom: 12,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8, // Add margin to separate images from buttons
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 8,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'column', // Change to column for vertical layout
    justifyContent: 'space-between',
    marginTop: 8,
  },
  itemButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', // Ensure buttons take full width
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
    shadowOffset: { width: 0, height: 2 },
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
    marginBottom: 2, // Add a 2-pixel gap
  },
  smallButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#ff0000', // Red background for delete button
    borderRadius: 4,
  },
  smallButtonText: {
    fontSize: 12, // Smaller font size
    color: '#ffffff', // White text color
  },
  roundedCorners: {
    borderRadius: 4, // Same border radius as the delete button
  },
  itemName: {
    fontSize: 16, // 1 size larger than the default
    fontWeight: 'bold',
  },
});

export default styles;