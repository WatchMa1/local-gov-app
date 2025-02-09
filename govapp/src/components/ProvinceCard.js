import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const ProvinceCard = ({ route }) => {
  const { indicatorId, indicatorName } = route.params;
  const [provinces, setProvinces] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(`http://192.168.191.102:8000/api/provinces`);
        console.log('API Response:', response.data); // Debugging: Log the API response
        setProvinces(response.data.results); // Ensure results is an array
      } catch (error) {
        console.error('Error fetching provinces:', error);
        Alert.alert('Error', 'Could not fetch provinces');
      }
    };

    fetchProvinces();
  }, [indicatorId]);

  const handleDistrictPress = (provinceId, provinceName) => {
    navigation.navigate('DistrictScreen', { provinceId, provinceName });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{indicatorName}</Text>
      {provinces.length === 0 ? ( // Debugging: Check if provinces array is empty
        <Text>No provinces found</Text>
      ) : (
        <FlatList
          data={provinces}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleDistrictPress(item.id, item.name)}>
              <View style={styles.provinceContainer}>
                <Text style={styles.provinceText}>{item.name}</Text>
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
  provinceContainer: {
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
  provinceText: {
    fontSize: 16,
    color: '#3F51B5',
  },
});

export default ProvinceCard;