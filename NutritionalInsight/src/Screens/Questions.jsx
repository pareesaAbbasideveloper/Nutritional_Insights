import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
  Modal,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Field, Formik} from 'formik';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import {BASE_URL} from '../API/API';
import Loading from '../components/Loading';
import {TagSelect} from 'react-native-tag-select';

const Questions = ({navigation, route}) => {
  const [suger, setsuger] = useState(true);
  const [bloodPressure, setbloodPressure] = useState(true);
  const [overWeight, setOverWeight] = useState(true);
  const [loading, setLoading] = useState(false);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const tagsData = ['Diabetes', 'Blood Pressure', 'High Cholesterol'];
  const [selectedReligiousTags, setSelectedReligiousTags] = useState([]);
  const [selectedDietaryTags, setSelectedDietaryTags] = useState([]);
  const [selectedPurposeTags, setSelectedPurposeTags] = useState([]);
  const [age, setAge] = useState();
  const [gender, setGender] = useState();
  const [selectedTags, setSelectedTags] = useState([]);
  const PurposeData = [
    'Fitness Tracking',
    'Health Monitoring',
    'Diet/Nutrional Planning',
    'Weight Management',
    'Medical Condition Management',
    'Physical Activity Motivation',
    'Reseacrh Purposes',
  ];
  const ReligiousData = [
    'Halal',
    'Kosher',
    'No Pork',
    'No Beef',
    'Vegitarian (Religious)',
    'None',
  ];
  const DietaryData = [
    'Vegatarian',
    'Vegan',
    'Pescatarian',
    'Omnivore',
    'Keto',
    'Paleo',
    'None',
  ];
  const toggleTag = tag => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag],
    );
    console.log(selectedTags);
  };

  const toggleReligiousTag = tag => {
    setSelectedReligiousTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag],
    );
    console.log(selectedTags);
  };
  const toggleDietaryTag = tag => {
    setSelectedDietaryTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag],
    );
    console.log(selectedTags);
  };

  const togglePurposeTag = tag => {
    setSelectedPurposeTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag],
    );
  };

  const [allergies, setAllergies] = useState([
    'Albumin',
    'Almonds',
    'Anchovies',
    'Anise',
    'Apple',
    'Aspartame',
    'Avocado',
    'Banana',
    'Barley',
    'Bee pollen',
    'Benzoates',
    'Black beans',
    'Blackberries',
    'Blueberries',
    'Brazil nuts',
    'Broad beans',
    'Buckwheat',
    'Buffalo milk',
    'Butter',
    'Caffeine',
    'Caraway',
    'Casein',
    'Cashews',
    'Celery',
    'Cheese',
    'Cherry',
    'Chia seeds',
    'Chicken',
    'Chicken eggs',
    'Chickpeas',
    'Chocolate (Cocoa)',
    'Clams',
    'Cod',
    'Coconut',
    'Corn',
    'Coriander',
    "Cow's milk",
    'Crab',
    'Crayfish',
    'Cream',
    'Crustaceans',
    'Duck',
    'Duck eggs',
    'Durum wheat',
    'Edamame',
    'Egg white',
    'Egg yolk',
    'Eggs',
    'Einkorn',
    'Emmer',
    'Fava beans',
    'Fennel',
    'Fenugreek',
    'Fish',
    'Flaxseeds',
    'Garlic',
    'Game meat (Venison, Rabbit, Boar)',
    'Gelatin',
    'Gelatin (Animal-based)',
    'Ginkgo nuts',
    'Gluten',
    "Goat's milk",
    'Green peas',
    'Haddock',
    'Hazelnuts',
    'Herring',
    'Kidney beans',
    'Kiwi',
    'Kamut',
    'Lactose',
    'Lentils',
    'Lobster',
    'Lupin',
    'Macadamia nuts',
    'Mango',
    'Melons',
    'Milk',
    'Miso',
    'Mollusks',
    'MSG (Monosodium Glutamate)',
    'Mung beans',
    'Mustard seeds',
    'Mussels',
    'Nitrates and nitrites',
    'Octopus',
    'Oats',
    'Onions',
    'Oysters',
    'Papaya',
    'Paprika',
    'Peach',
    'Peanut butter',
    'Peanut flour',
    'Peanut oil',
    'Peanuts',
    'Pecans',
    'Pear',
    'Pine nuts',
    'Pineapple',
    'Pistachios',
    'Plum',
    'Poppy seeds',
    'Propolis',
    'Pumpkin seeds',
    'Prawns',
    'Quail eggs',
    'Quinoa',
    'Red meat (Beef, Pork, Lamb)',
    'Raspberries',
    'Royal jelly',
    'Rye',
    'Salmon',
    'Sardines',
    'Scallops',
    'Semolina',
    'Sesame seeds',
    "Sheep's milk",
    'Shrimp',
    'Snails',
    'Sorghum',
    'Soy flour',
    'Soy lecithin',
    'Soy milk',
    'Soy protein',
    'Soybeans',
    'Spelt',
    'Strawberries',
    'Sulfur dioxide and sulfites',
    'Sunflower seeds',
    'Tartrazine (Yellow 5)',
    'Tempeh',
    'Tilapia',
    'Tofu',
    'Trout',
    'Triticale',
    'Tuna',
    'Turkey',
    'Walnuts',
    'Wheat',
    'Whey',
    'Yeast',
    'Yogurt',
  ]);

  const [bmi, setBmi] = useState(null);
  const [cholesterol, setCholesterol] = useState(false);

  function switchScreen(location) {
    navigation.navigate(location);
  }
  const calculateBMI = () => {
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100;
      const calculatedBmi =
        parseFloat(weight) / (heightInMeters * heightInMeters);
      setBmi(calculatedBmi.toFixed(2));
      if (calculatedBmi < 18.5) setOverWeight(false); // Lean
      else if (calculatedBmi >= 18.5 && calculatedBmi <= 24.9)
        setOverWeight(false); // Fit
      else setOverWeight(true); // Overweight
    }
  };
  const SavedQuestion = async () => {
    setLoading(true);
    const token = route.params.token;
    calculateBMI();

    if (!token) return;
    console.log(token);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/handleAddQuestion`, // URL
        {
          selectedDiseases: selectedTags,
          overWeight: overWeight,
          height: height,
          weight: weight,
          gender: gender,
          age: age,
          bmi: bmi,
          religious: selectedReligiousTags,
          dietary: selectedDietaryTags,
          purpose: selectedPurposeTags,
          allergies: selectedAllergies,
        }, // Body (empty object for this request)
        {
          // Configuration object for headers
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status == 200) {
        switchScreen('InformationSaved');
        setLoading(false);
      } else {
        console.log(response);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setLoading(false);
    }
  };
  useEffect(() => {
    // Listener for preventing back navigation on this screen
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      // Prevent the back navigation (either swipe or hardware button press)
      e.preventDefault();
    });

    return unsubscribe; // Cleanup listener on unmount
  }, [navigation]);

  const [modalVisible, setModalVisible] = useState(false);
  const [fetchedAllergies, setFetchedAllergies] = useState(false);

  const fetchAllergies = async () => {
    setModalVisible(true);
    return;
  };

  const toggleSelection = allergy => {
    setSelectedAllergies(prevSelected =>
      prevSelected.includes(allergy)
        ? prevSelected.filter(item => item !== allergy)
        : [...prevSelected, allergy],
    );
  };

  const [searchQuery, setSearchQuery] = useState('');

  // Filter allergies based on search input
  const filteredAllergies = allergies.filter(allergy =>
    allergy.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Fill The Health Form</Text>
      <Text style={styles.subheaderText}>
        Fill this form soo that we can judge the item as per your health
      </Text>

      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={values => {
          // Handle form submission (e.g., call CreateAccount)
          SavedQuestion();
        }}>
        {({handleChange, handleBlur, handleSubmit, values}) => (
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <View
                style={{
                  borderTopWidth: 1,
                  borderBottomWidth: 1,
                  borderColor: '#000',
                  borderStyle: 'dashed',
                  paddingBottom: 10,
                  marginBottom: 20,
                }}>
                <Text
                  style={[
                    styles.headerText,
                    {marginBottom: 20, marginTop: 10},
                  ]}>
                  BMI CALCULATOR
                </Text>
                <View style={styles.textheaderContainer}>
                  <Text style={styles.textQuestion}>Age</Text>
                </View>
                <TextInput
                  style={[
                    styles.picker,
                    {marginBottom: 20, fontSize: 14, borderRadius: 0},
                  ]}
                  keyboardType="numeric"
                  value={age}
                  onChangeText={setAge}
                />
                <View style={styles.textheaderContainer}>
                  <Text style={styles.textQuestion}>Gender</Text>
                </View>
                <View
                  style={[
                    styles.pickerWrapper,
                    {marginBottom: 20, fontSize: 14, borderRadius: 0},
                  ]}>
                  <Picker
                    selectedValue={gender}
                    onValueChange={itemValue => setGender(itemValue)}
                    style={styles.picker}>
                    <Picker.Item label="Select Gender" value="" />
                    <Picker.Item label="Male" value="male" />
                    <Picker.Item label="Female" value="female" />
                  </Picker>
                </View>
                <View style={styles.textheaderContainer}>
                  <Text style={styles.textQuestion}>Height (cm)</Text>
                </View>
                <TextInput
                  style={[
                    styles.picker,
                    {marginBottom: 20, fontSize: 14, borderRadius: 0},
                  ]}
                  keyboardType="numeric"
                  value={height}
                  onChangeText={setHeight}
                />
                <View style={styles.textheaderContainer}>
                  <Text style={styles.textQuestion}>Weight (kg)</Text>
                </View>
                <TextInput
                  style={[
                    styles.picker,
                    {marginBottom: 20, fontSize: 14, borderRadius: 0},
                  ]}
                  keyboardType="numeric"
                  value={weight}
                  onChangeText={setWeight}
                  onBlur={calculateBMI}
                />

                {bmi && (
                  <View style={{marginVertical: 10}}>
                    <Text>Your BMI: {bmi}</Text>
                    {overWeight && (
                      <Text style={{color: 'red', fontWeight: 'bold'}}>
                        Overweight
                      </Text>
                    )}
                  </View>
                )}
                <TouchableOpacity
                  onPress={calculateBMI}
                  style={{
                    backgroundColor: '#6F70FF',
                    paddingVertical: 10,
                    marginBottom: 2,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: 'white',
                      fontWeight: 600,
                    }}>
                    FIND YOUR BMI
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.tagHeadline}>Diseases</Text>

              <View style={styles.tagWrapper}>
                {tagsData.map(tag => (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.tag,
                      selectedTags.includes(tag) && styles.selectedTag,
                    ]}
                    onPress={() => toggleTag(tag)}>
                    <Text
                      style={[
                        styles.tagText,
                        selectedTags.includes(tag) && styles.selectedText,
                      ]}>
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.tagHeadline}>
                Religious Dietary Restrictions
              </Text>

              <View style={styles.tagWrapper}>
                {ReligiousData.map(tag => (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.tag,
                      selectedReligiousTags.includes(tag) && styles.selectedTag,
                    ]}
                    onPress={() => toggleReligiousTag(tag)}>
                    <Text
                      style={[
                        styles.tagText,
                        selectedReligiousTags.includes(tag) &&
                          styles.selectedText,
                      ]}>
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.tagHeadline}>Dietary Preferences</Text>

              <View style={styles.tagWrapper}>
                {DietaryData.map(tag => (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.tag,
                      selectedDietaryTags.includes(tag) && styles.selectedTag,
                    ]}
                    onPress={() => toggleDietaryTag(tag)}>
                    <Text
                      style={[
                        styles.tagText,
                        selectedDietaryTags.includes(tag) &&
                          styles.selectedText,
                      ]}>
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.tagHeadline}>Purpose of Using Our App</Text>

              <View style={styles.tagWrapper}>
                {PurposeData.map(tag => (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.tag,
                      selectedPurposeTags.includes(tag) && styles.selectedTag,
                    ]}
                    onPress={() => togglePurposeTag(tag)}>
                    <Text
                      style={[
                        styles.tagText,
                        selectedPurposeTags.includes(tag) &&
                          styles.selectedText,
                      ]}>
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Button
                title="Select Allergens"
                onPress={fetchAllergies}
                color="#6F70FF"
              />
            </View>
            <Button
              style={styles.submitButton}
              color="#6F70FF"
              onPress={handleSubmit}
              title="Submit Health Information"
            />
          </View>
        )}
      </Formik>
      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <View style={[styles.overlay]}>
          <View style={[styles.popup, {marginVertical: 80}]}>
            <Text style={styles.headerText}>Select Allergies</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search allergies..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <ScrollView>
              {filteredAllergies.map(allergy => (
                <TouchableOpacity
                  key={allergy}
                  style={[
                    styles.allergyItem,
                    selectedAllergies.includes(allergy) && styles.selected,
                  ]}
                  onPress={() => toggleSelection(allergy)}>
                  <Text style={styles.allergyText}>{allergy}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Button
              style={{marginTop: 20}}
              title="Close"
              onPress={() => setModalVisible(false)}
              color="#FF0000"
            />
          </View>
        </View>
      </Modal>
      <Modal transparent={true} visible={loading} animationType="fade">
        <View style={styles.overlay}>
          <Loading />
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Questions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#edf1f5', // Background color of the screen
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'light',
    marginBottom: 3,
    marginTop: 20,
    textAlign: 'center',
    color: '#000000',
  },
  subheaderText: {
    color: '#000000',
  },
  textQuestion: {
    color: '#000000',
    textAlign: 'center',
  },
  formContainer: {
    marginTop: 15,
  },
  inputContainer: {
    marginBottom: 20,
  },
  textheaderContainer: {
    backgroundColor: 'white',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  textInputContainer: {
    borderRadius: 5, // Use borderRadius instead of borderCurve
    backgroundColor: '#c6c6c6',
  },
  input: {
    padding: 10,
    fontSize: 16,
    borderRadius: 2,
    paddingVertical: 30,
  },
  picker: {
    backgroundColor: 'white',
    borderRadius: 10,
    fontSize: 10,
  },
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
  selected: {
    backgroundColor: '#6F70FF',
  },
  allergyItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  selected: {
    backgroundColor: '#6F70FF',
  },
  allergyText: {
    textAlign: 'center',
    color: '#000',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  labelText: {
    color: '#333',
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 15,
  },
  item: {
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#FFF',
  },
  label: {
    color: '#333',
  },
  itemSelected: {
    backgroundColor: '#333',
  },
  labelSelected: {
    color: '#FFF',
  },
  tagWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10, // You can replace with margin if `gap` doesn’t work in older RN versions
  },
  tag: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: 'white',
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  selectedTag: {
    backgroundColor: '#4a90e2',
  },
  tagText: {
    color: '#333',
  },
  selectedText: {
    color: '#fff',
  },
  tagHeadline: {
    fontSize: 20,
    color: 'black',
    fontWeight: '600',
    marginBottom: 20,
  },
});
