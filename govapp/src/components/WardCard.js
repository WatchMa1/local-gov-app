import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { PROTOCAL, IP_ADDRESS, PORT } from '../utils/utils';

const WardCard = ({ route }) => {
  const { constituencyId, constituencyName } = route.params;
  const [wards, setWards] = useState([]);
  const [averageScore, setAverageScore] = useState(0);
  const [isChartView, setIsChartView] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    const fetchWards = async () => {
      try {
        const response = await axios.get(`${PROTOCAL}${IP_ADDRESS}:${PORT}/api/constituencies/${constituencyId}/wards`);
        const wardsData = response.data;

        // Fetch ward scores
        const wardScoresResponse = await axios.get(`${PROTOCAL}${IP_ADDRESS}:${PORT}/api/wardIndicators`);
        const wardScoresData = wardScoresResponse.data.results;

        // Merge ward scores with ward data
        const wardsWithScores = wardsData.map(ward => {
          const wardScore = wardScoresData.find(score => score.ward === ward.id);
          return {
            ...ward,
            score: wardScore && wardScore.score ? parseFloat(wardScore.score) : 0, // Default to 0 if no score found
          };
        });

        setWards(wardsWithScores);
        // Calculate average score
        const totalScore = wardsWithScores.reduce((sum, ward) => sum + ward.score, 0);
        const avgScore = wardsWithScores.length > 0 ? totalScore / wardsWithScores.length : 0;
        setAverageScore(avgScore);
      } catch (error) {
        console.error('Error fetching wards or ward scores:', error);
        Alert.alert('Error', 'Could not fetch wards or ward scores');
      }
    };

    fetchWards();
  }, [constituencyId]);

  const handleWardPress = (wardId, wardName) => {
    navigation.navigate('WardDetailScreen', { wardId, wardName });
  };

  const toggleView = () => {
    setIsChartView(!isChartView);
  };

  const chartData = wards.map(ward => ({
    value: ward.score,
    label: ward.ward_name,
    frontColor: '#177AD5',
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{constituencyName} Constituency</Text>
      <Text style={styles.averageScore}>Average Score: {averageScore.toFixed(2)}%</Text>
      <View style={styles.toggleContainer}>
        <Text>List View</Text>
        <Switch value={isChartView} onValueChange={toggleView} />
        <Text>Chart View</Text>
      </View>
      {isChartView ? (
        <BarChart
          horizontal
          yAxisAtTop 
          intactTopLabel
          shiftX= {0}
          barWidth={50}
          barGap={5}
          frontColor="lightgray"
          data={chartData}
          xAxisThickness={3}
          xAxisColor="darkgray"

        />
      ) : (
        <FlatList
          data={wards}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            
              <View style={styles.wardContainer}>
                <Text style={styles.wardText}>{item.ward_name}</Text>
                <Text style={styles.wardScore}>{item.score}%</Text>
              </View>
           
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingInline: 10,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'start',
    color: '#070d2d',
  },
  averageScore: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#070d2d',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  indicatorText: {
    fontSize: 16,
    color: '#1b2c00',
  },
  indicatorScore: {
    fontSize: 16,
    color: '#1b2c00',
  },
});

export default WardCard;