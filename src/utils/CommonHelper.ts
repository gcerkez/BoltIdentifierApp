// Interface for custom items
export interface CustomItem {
    id: string;
    name: string;
    width: string;
    height: string;
    unit: string;
    photoUris?: (string | number)[];
  }

// Predefined items with static data
export const predefinedItems: CustomItem[] = [
  {
    id: '1',
    name: 'US Quarter',
    width: '24.26',
    height: '24.26',
    unit: 'mm',
    photoUris: [
      require('../../assets/predefinedItems/us-quarter/us-quarter-front.jpg'),
      require('../../assets/predefinedItems/us-quarter/us-quarter-back.jpg'),
    ],
  },
  {
    id: '2',
    name: 'US Penny',
    width: '19.05',
    height: '19.05',
    unit: 'mm',
    photoUris: [
      require('../../assets/predefinedItems/us-penny/us-penny-front.jpg'),
      require('../../assets/predefinedItems/us-penny/us-penny-back.jpg'),
    ],
  },
];