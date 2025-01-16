import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const WardCard = ({ route }) => {
  const { constituencyId, constituencyName } = route.params;
  const [wards, setWards] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchWards = async () => {
      try {
        const response = await axios.get(`http://192.168.17.102:8000/api/constituencies/${constituencyId}/wards`);
        console.log('API Response:', response.data); // Debugging: Log the API response
        setWards(response.data); // Ensure results is an array
      } catch (error) {
        console.error('Error fetching wards:', error);
        Alert.alert('Error', 'Could not fetch wards');
      }
    };

    fetchWards();
  }, [constituencyId]);

  const handleWardPress = (wardId, wardName) => {
    navigation.navigate('WardDetailScreen', { wardId, wardName });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{constituencyName}</Text>
      {wards.length === 0 ? ( // Debugging: Check if wards array is empty
        <Text>No wards found</Text>
      ) : (
        <FlatList
          data={wards}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleWardPress(item.id, item.ward_name)}>
              <View style={styles.wardContainer}>
                <Text style={styles.wardText}>{item.ward_name}</Text>
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
  wardContainer: {
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
  wardText: {
    fontSize: 16,
    color: '#3F51B5',
  },
});

export default WardCard;