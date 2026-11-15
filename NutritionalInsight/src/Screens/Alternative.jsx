import React, {useCallback, useEffect, useState} from 'react';
import BottomBar from '../components/BottomBar';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert, // Make sure Alert is imported
  ActivityIndicator, // Make sure ActivityIndicator is imported
} from 'react-native';
import makingReady from '../assets/makingReady.png';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../components/Loading'; // Your custom Loading component
import axios from 'axios';
import {BASE_URL} from '../API/API';
import SuggestionBox from '../components/SuggestionBox';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';

function Alternative({navigation}) {
  const [token, setToken] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState(null); // Will be an array of product objects
  const [suggestionBoxTrigger, setSuggestionBoxTrigger] = useState(false);
  const [nutrimentData, setNutrimentData] = useState(null); // Holds the selected nutriment data for the modal

  const toggleSuggestionBox = alertstate => {
    setSuggestionBoxTrigger(alertstate);
  };

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
        } else {
          console.warn('No token found in AsyncStorage.');
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to retrieve token:', error);
        Alert.alert('Error', 'Failed to load user session. Please try again.');
        setLoading(false);
      }
    };

    fetchToken();
  }, []);

  const selectFoodSuggestion = data => {
    // Renamed for consistency
    setNutrimentData(data);
    setSuggestionBoxTrigger(true);
  };

  const fetchProfileData = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}/api/v1/viewProfile`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200 && response.data?.user?.questions?.[0]) {
        console.log('Profile data fetched successfully.');
        setProfileData(response.data);
      } else {
        console.error(
          'Failed to fetch profile data or data structure invalid:',
          response.status,
          response.data,
        );
        Alert.alert(
          'Error',
          'Could not load your profile preferences. Please try again.',
        );
      }
    } catch (error) {
      console.error(
        'Error fetching profile data:',
        error.response?.data || error.message,
      );
      Alert.alert('Error', 'Failed to connect to the server to load profile.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProfileData();
  }, [token, fetchProfileData]);

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert(
        'Input Required',
        'Please enter a food name to search for alternatives.',
      );
      return;
    }
    if (
      !profileData ||
      !profileData.user ||
      !profileData.user.questions ||
      !profileData.user.questions[0]
    ) {
      Alert.alert(
        'Error',
        'User profile data is not loaded. Cannot search for alternatives.',
      );
      return;
    }

    setLoading(true);
    setSuggestions(null); // Clear previous suggestions

    try {
      const questions = profileData.user.questions[0];
      const additionalInfo = Object.entries(questions)
        .filter(([key, value]) => key !== '_id' && value === true)
        .map(([key]) => key.replace(/([A-Z])/g, ' $1').trim())
        .join(', ');

      const allergies = questions.allergies
        ? questions.allergies.join(', ')
        : '';

      console.log('Sending to backend:', {
        additionalInfo,
        text: searchQuery,
        allergies,
      });

      // --- CRITICAL CHANGE HERE: DIRECTLY CONSUME THE RESPONSE ---
      const response = await axios.post(
        `${BASE_URL}/sendDataForRecommendation`,
        {
          additionalInfo: additionalInfo,
          text: searchQuery,
          allergies: allergies,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      // Assuming the backend now returns { products: [...] } directly
      // as per the last backend modification for Gemini direct output
      if (
        response.status === 200 &&
        response.data &&
        Array.isArray(response.data.products)
      ) {
        if (response.data.products.length > 0) {
          console.log(
            '✅ Gemini alternatives received:',
            response.data.products[0].product_name,
          );
          setSuggestions(response.data.products);
        } else {
          Alert.alert(
            'No Alternatives Found',
            'Gemini could not find any suitable alternatives for your search. Try a different food item or broaden your criteria.',
          );
          setSuggestions([]); // Set to empty array to show "No Results" message
        }
      } else {
        // Handle unexpected response format from the backend
        throw new Error(
          'Unexpected response format from the alternative recommendation service.',
        );
      }
    } catch (error) {
      console.error(
        'Search failed:',
        error.response?.data || error.message || error,
      );
      let errorMessage = 'An unexpected error occurred during search.';
      if (error.message.includes('Network Error')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.message.includes('Invalid JSON format')) {
        errorMessage =
          'There was an issue processing the AI response format. Please try again later.';
      } else if (error.message.includes('Unexpected response format')) {
        errorMessage =
          'The server returned data in an unexpected format. This might be a server issue.';
      } else {
        errorMessage = error.response?.data?.error || error.message; // Use backend error if available
      }
      Alert.alert('Search Error', errorMessage);
      setSuggestions([]); // Clear suggestions on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScrollView style={{marginHorizontal: 10}}>
        <View
          style={{
            borderWidth: 1,
            borderColor: 'grey',
            borderStyle: 'solid',
            marginTop: 10,
            borderRadius: 30,
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Icon
            name="search"
            size={20}
            color="#687089"
            style={{marginRight: 10}}
          />
          <TextInput
            placeholder="Product Name"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{flex: 1}}
            onSubmitEditing={handleSearch}
            editable={!loading && !suggestionBoxTrigger}
          />
          <TouchableOpacity
            onPress={handleSearch}
            disabled={loading || suggestionBoxTrigger}>
            <Text style={{color: '#687089', marginLeft: 10}}>Search</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View
            style={{
              height: 200,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size="large" color="#368A8F" />
            <Text style={{marginTop: 10}}>Searching for alternatives...</Text>
          </View>
        ) : suggestions === null ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 50,
            }}>
            <Image source={makingReady} style={{width: 200, height: 200}} />
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 20,
              }}>
              <Text style={{fontSize: 20, marginBottom: 10, color: '#687089'}}>
                FIND THE ALTERNATIVE FOOD
              </Text>
              <Text style={{textAlign: 'center', fontSize: 14}}>
                We are here to help you find the healthy food option according
                to your profile with the same taste of the product you enter
                above
              </Text>
            </View>
          </View>
        ) : suggestions.length > 0 ? (
          <View style={{marginTop: 20, width: '100%'}}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: '#687089',
                marginBottom: 10,
              }}>
              Alternative Products
            </Text>
            {/* Iterating through the 'products' array directly */}
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                onPress={() => {
                  // Pass the entire nutriments object
                  selectFoodSuggestion(suggestion.nutriments);
                }}
                key={index} // Use a unique ID if available from the data instead of index for better performance
                style={styles.suggestionContainer}>
                <FontAwesome
                  style={styles.foodIcon}
                  name="bowl-food"
                  size={40}
                />
                <View style={styles.suggestionTextContent}>
                  <Text style={styles.suggestionProductName}>
                    {suggestion.product_name || 'Unknown Product'}
                  </Text>
                  <Text style={styles.suggestionReason}>
                    {/* Display the reason for the suggestion */}
                    **Reason:**{' '}
                    {suggestion.reason || 'No specific reason provided.'}
                  </Text>
                  <Text style={styles.suggestionIngredients}>
                    {/* Display ingredients, truncate if too long */}
                    **Ingredients:**{' '}
                    {(
                      suggestion.ingredients_text_en || 'No ingredients listed'
                    ).substring(0, 100)}
                    {suggestion.ingredients_text_en &&
                    suggestion.ingredients_text_en.length > 100
                      ? '...'
                      : ''}
                  </Text>
                  {/* You can add a summary of nutrients here if needed */}
                  <Text style={styles.suggestionNutrientsSummary}>
                    **Nutrients (per 100g):** Protein:{' '}
                    {suggestion.nutriments?.protein_g || 'N/A'}g, Carbs:{' '}
                    {suggestion.nutriments?.carbohydrates_g || 'N/A'}g, Fat:{' '}
                    {suggestion.nutriments?.fat_g || 'N/A'}g
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          // If suggestions is an empty array (no results found)
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 50,
            }}>
            <Icon name="frown-open" size={60} color="#687089" />
            <Text style={{fontSize: 20, marginTop: 10, color: '#687089'}}>
              No Alternatives Found
            </Text>
            <Text style={{textAlign: 'center', fontSize: 14, marginTop: 5}}>
              Try searching for a different food item or broaden your criteria.
            </Text>
          </View>
        )}
        <Modal
          transparent={true}
          visible={suggestionBoxTrigger}
          animationType="fade"
          onRequestClose={() => setSuggestionBoxTrigger(false)}>
          <View style={styles.overlay}>
            <SuggestionBox
              nutrimentdata={nutrimentData}
              callFunction={toggleSuggestionBox}
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
}

export default Alternative;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    width: '80%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  suggestionContainer: {
    flexDirection: 'row', // Arrange image and text side-by-side
    alignItems: 'center', // Vertically center items
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10, // Space between suggestion cards
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3, // For Android shadow
  },
  suggestionImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
    resizeMode: 'cover', // Ensure image covers the area
  },
  suggestionTextContent: {
    flex: 1, // Allow text content to take up remaining space
  },
  suggestionProductName: {
    fontSize: 16,
    fontWeight: 'bold', // Use string 'bold' for fontWeight
    color: '#333',
    marginBottom: 4,
  },
  suggestionReason: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  suggestionIngredients: {
    fontSize: 10,
    color: '#888',
    marginBottom: 2,
  },
  suggestionNutrientsSummary: {
    fontSize: 11,
    color: '#555',
    fontStyle: 'italic',
  },
  foodIcon: {
    color: '#368A8F', // A more prominent color for the icon
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
    resizeMode: 'cover', // Ensure image covers the area
    // Adjust position if needed, but flex takes care of it
  },
  // ... other existing styles
});
