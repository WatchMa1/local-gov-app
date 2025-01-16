import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const ConstituencyCard = ({ route }) => {
  const { districtId, districtName } = route.params;
  const [constituencies, setConstituencies] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchConstituencies = async () => {
      try {
        const response = await axios.get(`http://192.168.17.102:8000/api/districts/${districtId}/constituencies`);
        console.log('API Response:', response.data); // Debugging: Log the API response
        setConstituencies(response.data); // Ensure results is an array
      } catch (error) {
        console.error('Error fetching constituencies:', error);
        Alert.alert('Error', 'Could not fetch constituencies');
      }
    };

    fetchConstituencies();
  }, [districtId]);

  const handleConstituencyPress = (constituencyId, constituencyName) => {
    navigation.navigate('WardsScreen', { constituencyId, constituencyName });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{districtName}</Text>
      {constituencies.length === 0 ? ( // Debugging: Check if constituencies array is empty
        <Text>No constituencies found</Text>
      ) : (
        <FlatList
          data={constituencies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleConstituencyPress(item.id, item.name)}>
              <View style={styles.constituencyContainer}>
                <Text style={styles.constituencyText}>{item.name}</Text>
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
  constituencyContainer: {
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
  constituencyText: {
    fontSize: 16,
    color: '#3F51B5',
  },
});

export default ConstituencyCard;