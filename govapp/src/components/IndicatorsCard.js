import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const IndicatorsCard = ({ route }) => {
  const { outcomeId } = route.params;
  const [indicators, setIndicators] = useState([]);

  useEffect(() => {
    const fetchIndicators = async () => {
      try {
        const response = await axios.get(`http://192.168.17.102:8000/api/outcomes/${outcomeId}/indicators`);
        setIndicators(response.data.results); // Extract only the results array
      } catch (error) {
        console.error('Error fetching indicators:', error);
        Alert.alert('Error', 'Could not fetch indicators');
      }
    };

    fetchIndicators();
  }, [outcomeId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Indicators</Text>
      <FlatList
        data={indicators}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.indicatorContainer}>
            <Text style={styles.indicatorText}>{item.name}</Text>
          </View>
        )}
      />
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
  indicatorContainer: {
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
  indicatorText: {
    fontSize: 16,
    color: '#3F51B5',
  },
});

export default IndicatorsCard;