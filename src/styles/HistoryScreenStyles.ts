import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'lightgreen',
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    padding: 8,
  },
  selectedItem: {
    backgroundColor: '#d0f0c0',
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnail: {
    width: 100,
    height: 100,
    marginRight: 16,
    borderRadius: 4,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff0000',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  clearHistoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginBottom: 0,
    position: 'absolute', // Added to position the button at the bottom
    bottom: 15, // Adjust as needed
    left: 16,
    right: 16,
    backgroundColor: '#ff0000', // Example color for enabled state
    padding: 6
  },
  clearHistoryButtonText: {
    color: '#ffffff',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;