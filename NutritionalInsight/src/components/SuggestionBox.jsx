import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import Entypo from 'react-native-vector-icons/Entypo';
// No longer directly using 'makingReady' image here as it's a display component
// import makingReady from '../assets/makingReady.png';

const SuggestionBox = ({callFunction, nutrimentdata}) => {
  // console.log("Nutriment Data received in SuggestionBox:", nutrimentdata);

  function handleClick() {
    callFunction(false);
  }

  const renderNutrimentDetails = () => {
    if (!nutrimentdata) {
      return <Text style={styles.noDataText}>No detailed nutrient data available.</Text>;
    }

    // Define the specific nutrients we want to display and their display names
    const nutrientsToDisplay = [
      { key: 'protein_g', label: 'Protein' },
      { key: 'carbohydrates_g', label: 'Carbohydrates' },
      { key: 'fat_g', label: 'Fat' },
      // Add other nutrients if Gemini starts providing them and you want to display
      // { key: 'sugars_g', label: 'Sugars' },
      // { key: 'energy_kcal', label: 'Energy (kcal)' },
    ];

    return (
      <View style={styles.nutrientsContainer}>
        <Text style={styles.sectionTitle}>Key Nutrients (per 100g)</Text>
        {nutrientsToDisplay.map(nutrient => {
          const value = nutrimentdata[nutrient.key];
          // Ensure value is a number and format it
          const displayValue = typeof value === 'number'
            ? `${value.toFixed(1)}g` // Format to 1 decimal place and add 'g'
            : 'N/A'; // Not available

          return (
            <View key={nutrient.key} style={styles.nutrientRow}>
              <Text style={styles.keyText}>{nutrient.label}:</Text>
              <Text style={styles.valueText}>{displayValue}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.centeredView}>
      <View style={styles.popupView}>
        <View style={styles.headerContainer}>
          <FontAwesome
            style={styles.foodIcon}
            name="bowl-food"
            size={40}
          />
          <TouchableOpacity
            onPress={handleClick}
            style={styles.closeButton}>
            <Entypo name="cross" size={30} color="#687089" />
          </TouchableOpacity>
        </View>

        <Text style={styles.popupTitle}>Nutritional Information</Text>

        <ScrollView style={styles.scrollViewContent}>
          {renderNutrimentDetails()}
          {/* You can add more sections here, e.g., for detailed ingredients if available */}
        </ScrollView>

        <TouchableOpacity
          style={styles.okButton}
          onPress={handleClick}>
          <Text style={styles.okButtonText}>Okay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SuggestionBox;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim background
  },
  popupView: {
    backgroundColor: 'white',
    marginHorizontal: 20, // Reduced from 10 to 20 for more space
    padding: 25, // Increased padding
    borderRadius: 15, // More rounded corners
    width: '90%', // Occupy more width
    maxHeight: '70%', // Limit height for scrolling
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  foodIcon: {
    color: '#368A8F', // A more prominent color for the icon
    // Adjust position if needed, but flex takes care of it
  },
  closeButton: {
    // Positioning handled by flex in headerContainer
    padding: 5, // Make it easier to tap
  },
  popupTitle: {
    fontSize: 22, // Larger title
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20, // More space after title
  },
  scrollViewContent: {
    width: '100%',
    maxHeight: 250, // Constrain scroll view height
  },
  nutrientsContainer: {
    width: '100%',
    paddingBottom: 10,
    borderBottomWidth: 1, // Separator line
    borderBottomColor: '#eee',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 10,
    textAlign: 'center',
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 6, // Increased vertical margin
    paddingHorizontal: 15, // More padding
    backgroundColor: '#f9f9f9', // Slightly different background for rows
    borderRadius: 8,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  keyText: {
    fontSize: 15, // Slightly larger font
    fontWeight: '600', // Semibold
    color: '#333',
    flex: 1, // Allow text to wrap if long
  },
  valueText: {
    fontSize: 15,
    color: '#555',
    fontWeight: 'bold', // Make value stand out
  },
  noDataText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    paddingVertical: 20,
  },
  okButton: {
    backgroundColor: '#368A8F', // Consistent button color with your app
    width: 100,
    paddingVertical: 15, // More vertical padding
    borderRadius: 10,
    marginTop: 20, // More space above the button
  },
  okButtonText: {
    textAlign: 'center',
    fontFamily: 'Poppins-light', // Assuming this font is loaded
    color: 'white',
    fontSize: 16, // Larger font size
  },
});