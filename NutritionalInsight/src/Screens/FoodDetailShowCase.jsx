import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import macro from '../assets/macro.png';
import carbs from '../assets/carbs.png';
import protein from '../assets/protein.png';
import fat from '../assets/fat.png';
import {PieChart} from 'react-native-gifted-charts';
import RNSpeedometer from 'react-native-speedometer';
import {useRoute} from '@react-navigation/native';
const renderNutrient = (nutrient, key) => {
  console.log(nutrient);

  return (
    <View
      key={key}
      style={{flexDirection: 'row', marginTop: 10, alignItems: 'center'}}>
      <Text style={{fontSize: 14}}>{key}</Text>
      <Text style={{marginLeft: 'auto'}}>
        {nutrient.amount} {nutrient.unit}
      </Text>
    </View>
  );

  // <View  style={styles.nutrientRow}>
  //   <Text style={styles.nutrientName}>{key}</Text>
  //   <Text style={styles.nutrientValue}>{nutrient.displayText}</Text>
  // </View>
};
function FoodDetailShowCase({navigation}) {
  const route = useRoute();
  const foodData = route.params; // Received JSON object
  console.log('Received Food Data:', foodData);
  const carbKey = Object.keys(foodData?.nutrients || {}).find(key =>
    key.toLowerCase().includes('carbo'),
  );

  const proKey = Object.keys(foodData?.nutrients || {}).find(key =>
    key.toLowerCase().includes('protein'),
  );

  const fatKey = Object.keys(foodData?.nutrients || {}).find(key =>
    key.toLowerCase().includes('fat'),
  );

  const data = [
    {value: foodData.nutrients[carbKey].amount},
    {value: foodData.nutrients[proKey].amount},
    {value: foodData.nutrients[fatKey].amount},
  ];

  return (
    <ScrollView
      style={{paddingHorizontal: 10, paddingTop: 10, paddingBottom: 30}}>
      <Text style={{fontSize: 20, marginBottom: 10}}>Nutritional Content </Text>
      <Text style={{fontSize: 12}}>
        Nutritional content includes macronutrients (carbs, proteins, fats,
        water) for energy and body functions and micronutrients (vitamins,
        minerals) for growth and health. Both are vital for well-being.{' '}
      </Text>

      <View
        style={{
          marginTop: 20,
          marginHorizontal: 10,
          padding: 15,
          // borderWidth: 2,
          // borderStyle: 'dashed',
          // borderColor: 'blue',
        }}>
        <View
          style={{
            flexDirectiocarbsn: 'row',
            alignItems: 'center',
            marginBottom: 20,
          }}>
          <Image
            source={macro}
            style={{width: 40, height: 40, marginRight: 10}}></Image>
          <Text style={{fontSize: 16}}>Macros Nutritions Per Serving</Text>
        </View>
        <View
          style={{flexDirection: 'row', marginTop: 10, alignItems: 'center'}}>
          <Image
            source={carbs}
            style={{width: 30, height: 30, marginRight: 10}}></Image>
          <Text style={{fontSize: 14}}>Carbohydates</Text>
          {carbKey && (
            <Text style={{marginLeft: 'auto'}}>
              {foodData.nutrients[carbKey].amount}{' '}
              {foodData.nutrients[carbKey].unit}
            </Text>
          )}
        </View>
        <View
          style={{flexDirection: 'row', marginTop: 10, alignItems: 'center'}}>
          <Image
            source={protein}
            style={{width: 30, height: 30, marginRight: 10}}></Image>
          <Text style={{fontSize: 14}}>Protein</Text>
          {foodData?.nutrients?.[proKey] ? ( // Check if foodData.Protein exists
            <Text style={{marginLeft: 'auto'}}>
              {foodData.nutrients[proKey].amount}{' '}
              {foodData.nutrients[proKey].unit}
            </Text>
          ) : null}
        </View>
        <View
          style={{flexDirection: 'row', marginTop: 10, alignItems: 'center'}}>
          <Image
            source={fat}
            style={{width: 30, height: 30, marginRight: 10}}></Image>
          <Text style={{fontSize: 14}}>Fat</Text>
          {foodData?.nutrients[fatKey] && (
            <Text style={{marginLeft: 'auto'}}>
              {foodData.nutrients[fatKey].amount}{' '}
              {foodData.nutrients[fatKey].unit}
            </Text>
          )}
        </View>
        <View style={{elevation: 1, marginHorizontal: 'auto', marginTop: 20}}>
          <PieChart data={data} />
        </View>
      </View>
      <View
        style={{
          marginTop: 20,
          marginHorizontal: 10,
          padding: 15,
          // borderWidth: 2,
          // borderStyle: 'dashed',
          // borderColor: 'blue',
        }}>
        <View
          style={{
            flexDirectiocarbsn: 'row',
            alignItems: 'center',
            marginBottom: 20,
          }}>
          <Image
            source={macro}
            style={{width: 40, height: 40, marginRight: 10}}></Image>
          <Text style={{fontSize: 16}}>All Nutritions Per Serving</Text>
        </View>

        {Object.entries(foodData.nutrients).map(([key, nutrient]) =>
          renderNutrient(nutrient, key),
        )}
      </View>
      <View style={{marginTop: 20, marginBottom: 20}}>
        <RNSpeedometer
          style={{marginBottom: 20, marginTop: 20, backgroundColor: 'white'}}
          value={foodData.scale.overall * 10}
          size={200}
        />
        <Text style={{marginTop: 60}}>{foodData.scale.reason}</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Alternative');
        }}
        style={{
          marginBottom: 20,
          width: '80%',
          marginHorizontal: 'auto',
          backgroundColor: '#686f89',
        }}>
        <Text
          style={{
            marginHorizontal: 20,
            marginVertical: 10,
            textAlign: 'center',
            color: 'white',
          }}>
          Find Food Alternative
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default FoodDetailShowCase;
