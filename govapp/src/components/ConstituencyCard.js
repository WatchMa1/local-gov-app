import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const ConstituencyCard = ({ route }) => {
  const { districtId, districtName } = route.params;
  const [constituencies, setConstituencies] = useState([]);
  const [averageScores, setAverageScores] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    const fetchConstituencies = async () => {
      try {
        const response = await axios.get(`http://192.168.191.102:8000/api/districts/${districtId}/constituencies`);
        const constituenciesData = response.data;
        console.log('Constituencies API Response:', constituenciesData); // Debugging: Log the API response

        // Fetch ward scores for each constituency
        const fetchWardScores = async (constituencyId) => {
          const wardScoresResponse = await axios.get(`http://192.168.191.102:8000/api/constituencies/${constituencyId}/wards`);
          const wardsData = wardScoresResponse.data;
          const wardScores = await axios.get('http://192.168.191.102:8000/api/wardIndicators');
          const wardScoresData = wardScores.data.results;

          // Merge ward scores with ward data
          const wardsWithScores = wardsData.map(ward => {
            const wardScore = wardScoresData.find(score => score.ward === ward.id);
            return {
              ...ward,
              score: wardScore && wardScore.score ? parseFloat(wardScore.score) : 0, // Default to 0 if no score found
            };
          });

          // Calculate average score
          const totalScore = wardsWithScores.reduce((sum, ward) => sum + ward.score, 0);
          const avgScore = wardsWithScores.length > 0 ? totalScore / wardsWithScores.length : 0;
          return avgScore;
        };

        // Calculate average scores for all constituencies
        const averageScoresData = {};
        for (const constituency of constituenciesData) {
          const avgScore = await fetchWardScores(constituency.id);
          averageScoresData[constituency.id] = avgScore;
        }

        setConstituencies(constituenciesData);
        setAverageScores(averageScoresData);
      } catch (error) {
        console.error('Error fetching constituencies or ward scores:', error);
        Alert.alert('Error', 'Could not fetch constituencies or ward scores');
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
      {constituencies.length === 0 ? (
        <Text>No constituencies found</Text>
      ) : (
        <FlatList
          data={constituencies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleConstituencyPress(item.id, item.name)}>
              <View style={styles.constituencyContainer}>
                <Text style={styles.constituencyText}>{item.name}</Text>
                <Text style={styles.constituencyScore}>
                  {averageScores[item.id] ? averageScores[item.id].toFixed(1) : 'N/A'}%
                </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  constituencyText: {
    fontSize: 16,
    color: '#3F51B5',
  },
  constituencyScore: {
    fontSize: 16,
    color: '#3F51B5',
  },
});

export default ConstituencyCard;