import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import snack from '../assets/snack.png';
import photo from '../assets/photo.png';
import camera from '../assets/camera.png';
import BottomBar from '../components/BottomBar';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import axios from 'axios';
import {BASE_URL, OCR_BASE_URL} from '../API/API';
import Loading from '../components/Loading';
import AlertBox from '../components/AlertBox';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ScanNow = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [token, setToken] = useState(null);
  const [data, setData] = useState();
  const toggleShowAlert = alertstate => {
    setShowAlert(alertstate);
  };

  const switchScreen = (screenName, params = {}) => {
    navigation.navigate(screenName, params); // Assuming you're using React Navigation
  };
  useEffect(() => {
    // Listener for preventing back navigation on this screen
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      // Prevent the back navigation (either swipe or hardware button press)
      e.preventDefault();
    });

    return unsubscribe; // Cleanup listener on unmount
  }, [navigation]);
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        setToken(storedToken);
      } catch (error) {
        console.error('Failed to retrieve token:', error);
      }
    };

    fetchToken();
  }, []);

  const fetchProfileData = useCallback(async () => {
    if (!token) return;
    console.log(token);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/viewProfile`, // URL
        {}, // Body (empty object for this request)
        {
          // Configuration object for headers
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('this is response ', response.data.user.name);

      if (response.status == 200) {
        console.log(
          'this is the data coming here from where',
          response.data.user.questions[0],
        );

        setData(response.data);
        setLoading(false);
      } else {
        console.error('Failed to fetch profile data:', response.status);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  }, [token]);
  useEffect(() => {
    fetchProfileData();
  }, [token]);

  const captureImage = async () => {
    // const hasPermission = await requestCameraPermission();
    // if (!hasPermission) return;
    setLoading(true);

    const options = {
      mediaType: 'photo', // Ensure it's a photo capture
      cameraType: 'back', // Use back camera
      saveToPhotos: true, // Save photo to the gallery
    };
    // console.log('launchCamera:', launchCamera());

    try {
      const result = await launchCamera(options);
      console.log(result);
      if (result.didCancel) {
        console.log('User canceled camera operation');
        setLoading(false);
      } else if (result.errorCode) {
        console.error('Camera error: ', result.errorCode, result.errorMessage);
        setLoading(false);
      } else if (result.assets && result.assets.length > 0) {
        console.log(result.assets[0].uri);
        // setUploadedImage(result.assets[0].uri); // Save the image URI to state

        // Create FormData object
        const formData = new FormData();
        formData.append('file', {
          uri: result.assets[0].uri,
          type: result.assets[0].type, // Ensure to include the file type (e.g., image/jpeg)
          name: result.assets[0].fileName, // Provide the file name
        });
       

        // Send image to the backend using Axios
        try {
          //  generateContent()
          const response = await axios.post(`${OCR_BASE_URL}/ocr/`, formData, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data', // Required for file uploads
            },
          });
          const text = Object.entries(data.user.questions[0])
            .filter(([key, value]) => key !== '_id' && value === true) // Exclude `_id` and only keep `true` values
            .map(([key]) => key.replace(/([A-Z])/g, ' $1').trim()) // Convert camelCase to readable format
            .join(', ');
          const text2 = data.user.questions[0].allergies.join(', ');

          if (response.status == 200) {
            const GPTResponse = await axios.post(
              `${BASE_URL}/sendDataToGPT`,
              {
                text: response.data.text_1,
                additionalInfo: text,
                allergies: text2,
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              },
            );

            console.log('✅ Upload successful:', GPTResponse.data.message);
            const jsonString = GPTResponse.data.message
              .trim()
              .replace(/^`{3}(json)?\n?|`{3}$/g, '')
              .replace(/`/g, '')
              .replace(/[`\/]/g, '');
            const jsonObject = JSON.parse(jsonString); // The magic happens here
            setLoading(false);
            // Pass jsonObject as a parameter to the next screen
            switchScreen('FoodDetailShowCase', jsonObject);
          }
        } catch (error) {
          setLoading(false);
          setShowAlert(true);
          console.error('Image upload failed:', error.response || error);
          if (error.response) {
            console.log('Response error data:', error.response.data);
            console.log('Response error status:', error.response.status);
          }
        }
      } else {
        setLoading(false);

        console.log('Unexpected result:', result);
      }
    } catch (error) {
      setLoading(false);
      setShowAlert(true);
      console.error('launchCamera failed:', error);
    }
  };
  const uploadImage = async () => {
    console.log(data.user.questions[0]);
    const text = Object.entries(data.user.questions[0])
      .filter(([key, value]) => key !== '_id' && value === true) // Exclude `_id` and only keep `true` values
      .map(([key]) => key.replace(/([A-Z])/g, ' $1').trim()) // Convert camelCase to readable format
      .join(', ');
    console.log('me with this', text);

    setLoading(true);
    const options = {
      mediaType: 'photo',
    };
    try {
      const result = await launchImageLibrary(options);

      if (result.didCancel) {
        console.log('User canceled image picker');
        setLoading(false);
      } else if (result.errorCode) {
        console.error(
          'Image picker error: ',
          result.errorCode,
          result.errorMessage,
        );
        setLoading(false);
      } else if (result.assets && result.assets.length > 0) {
        console.log(result.assets[0].uri);
        // setUploadedImage(result.assets[0].uri); // Save the image URI to state

        // Create FormData object
        const formData = new FormData();
        formData.append('file', {
          uri: result.assets[0].uri,
          type: result.assets[0].type, // Ensure to include the file type (e.g., image/jpeg)
          name: result.assets[0].fileName, // Provide the file name
        });

        // Send image to the backend using Axios
        try {
          //  generateContent()
          const response = await axios.post(`${OCR_BASE_URL}/ocr/`, formData, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data', // Required for file uploads
            },
          });
          const text = Object.entries(data.user.questions[0])
            .filter(([key, value]) => key !== '_id' && value === true) // Exclude `_id` and only keep `true` values
            .map(([key]) => key.replace(/([A-Z])/g, ' $1').trim()) // Convert camelCase to readable format
            .join(', ');
          const text2 = data.user.questions[0].allergies.join(', ');

          if (response.status == 200) {
            const GPTResponse = await axios.post(
              `${BASE_URL}/sendDataToGPT`,
              {
                text: response.data.text_1,
                additionalInfo: text,
                allergies: text2,
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              },
            );

            console.log('✅ Upload successful:', GPTResponse.data.message);
            const jsonString = GPTResponse.data.message
              .trim()
              .replace(/^`{3}(json)?\n?|`{3}$/g, '')
              .replace(/`/g, '')
              .replace(/[`\/]/g, '');
            const jsonObject = JSON.parse(jsonString); // The magic happens here
            setLoading(false);
            // Pass jsonObject as a parameter to the next screen
            switchScreen('FoodDetailShowCase', jsonObject);
          }
        } catch (error) {
          setLoading(false);
          setShowAlert(true);
          console.error('Image upload failed:', error.response || error);
          if (error.response) {
            console.log('Response error data:', error.response.data);
            console.log('Response error status:', error.response.status);
          }
        }
      } else {
        setLoading(false);
        console.log('Unexpected result:', result);
      }
    } catch (error) {
      setLoading(false);
      setShowAlert(true);
      console.error('launchImageLibrary failed:', error);
    }
  };

  return (
    <>
      <ScrollView>
        <View>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Image
              style={{width: 180, height: 180, marginTop: 80}}
              source={snack}></Image>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                paddingHorizontal: 15,
                marginTop: 20,
              }}>
              Scan your product to view detailed information, allowing you to
              easily review and verify its specifics. You can capture a new
              image or upload an existing one, giving you full flexibility to
              edit and update the details as needed.
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 40,
            }}>
            <TouchableOpacity
              onPress={captureImage}
              style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image source={camera} style={{width: 100, height: 100}}></Image>
              <Text>Capture Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={uploadImage}
              style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image source={photo} style={{width: 100, height: 100}}></Image>
              <Text>Upload Now</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Modal
          transparent={true}
          visible={showAlert}
          animationType="fade"
          onRequestClose={() => setIsPopupVisible(false)}>
          <View style={styles.overlay}>
            <AlertBox
              title="OOPS! OPERATION FAILED "
              description="Something went wrong why you don't try again sorry for inconvinence"
              callFunction={toggleShowAlert}
              style={styles.popup}
            />
          </View>
        </Modal>
        <Modal transparent={true} visible={loading} animationType="fade">
          <View style={styles.overlay}>
            <Loading />
          </View>
        </Modal>
      </ScrollView>
      <BottomBar navigation={navigation} />
    </>
  );
};

export default ScanNow;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
  },
  popup: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
});
