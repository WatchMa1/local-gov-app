import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const DistrictCard = ({ route }) => {
  const { provinceId, provinceName } = route.params;
  const [districts, setDistricts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await axios.get(`http://192.168.191.102:8000/api/provinces/${provinceId}/districts`);
        console.log('API Response:', response.data); // Debugging: Log the API response
        setDistricts(response.data); // Ensure results is an array
      } catch (error) {
        console.error('Error fetching districts:', error);
        Alert.alert('Error', 'Could not fetch districts');
      }
    };

    fetchDistricts();
  }, [provinceId]);

  const handleDistrictPress = (districtId, districtName) => {
    navigation.navigate('ConstituencyScreen', { districtId, districtName });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{provinceName}</Text>
      {districts.length === 0 ? ( // Debugging: Check if districts array is empty
        <Text>No districts found</Text>
      ) : (
        <FlatList
          data={districts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleDistrictPress(item.id, item.name)}>
              <View style={styles.districtContainer}>
                <Text style={styles.districtText}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#070d2d',
  },
  districtContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  districtText: {
    fontSize: 16,
    color: '#3F51B5',
  },
});

export default DistrictCard;