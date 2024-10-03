# BoltIdentifierApp

BoltIdentifierApp is a React Native application designed to analyze bolts and determine their type, size, shape, and other dimensions. This app leverages the device's camera to capture images of bolts and uses image processing techniques to extract measurements and other relevant data.

## Features

- Capture images of bolts using the device's camera. *(Future Goal)*
- Analyze bolt images to determine thread spacing, length, socket size, and head type. *(Future Goal)*
- Store and manage a history of analyzed bolts. *(Future Goal)*
- View and delete previously analyzed bolts. *(Future Goal)*
- Manage a list of reference items with photos and dimensions. *(Future Goal)*

## Screens

1. **Camera Screen**: Capture and analyze bolt images.
2. **Reference Items Screen**: Manage a list of reference items with photos and dimensions.
3. **History Screen**: View and manage the history of analyzed bolts.

## Development Setup

### Prerequisites

- Node.js (>= 18)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- Android SDK
   - set the ANDROID_HOME and add the following to PATH
      - %ANDROID_HOME%\platforms
      - %ANDROID_HOME%\platform-tools
      - %ANDROID_HOME%\build-tools
      - %ANDROID_HOME%\tools\bin


### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/gcerkez/BoltIdentifierApp.git
   cd BoltIdentifierApp
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Install Pods (iOS only):**
   ```sh
   cd ios
   pod install
   cd ..
   ```

### Running the App

1. **Start the Metro bundler:**
   ```sh
   npm start
   ```

2. **Run on Android:**
   - Open Android Studio and start an Android emulator.
   - In a new terminal, run:
     ```sh
     npx react-native run-android
     ```

3. **Run on iOS (macOS only):**
   - Open Xcode and start an iOS simulator.
   - In a new terminal, run:
     ```sh
     npx react-native run-ios
     ```

### Additional Setup

1. **React Native Doctor:**
   - Run the following command to ensure your development environment is set up correctly:
     ```sh
     npx react-native doctor
     ```
   - Follow the instructions provided by the doctor to fix any issues.
      - NOTE: I cannot seem to get adb or Android SDK to show in the doctor tool but they work

2. **Permissions:**
   - Ensure the app has the necessary permissions to access the camera and storage. This is typically handled by the `react-native-image-picker` library, but you may need to adjust settings in your `AndroidManifest.xml` and `Info.plist` files.

3. **Clean and Fix Libraries:**
   - If you encounter issues with new libraries or library changes, run:
     ```sh
     cd android
     ./gradlew clean
     cd ..
     ```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or suggestions, please open an issue or contact the project maintainer at gerard.cerkez@gmail.com.
