import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { BarChart } from 'react-native-gifted-charts';
import { PROTOCAL, IP_ADDRESS, PORT } from '../utils/utils';

const IndicatorsCard = ({ route }) => {
  const { outcomeId, outcomeName } = route.params;
  const [indicators, setIndicators] = useState([]);
  const [averageScores, setAverageScores] = useState({});
  const [overallAverageScore, setOverallAverageScore] = useState(0);
  const [isChartView, setIsChartView] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchIndicators = async () => {
      try {
        const response = await axios.get(`${PROTOCAL}${IP_ADDRESS}:${PORT}/api/outcomes/${outcomeId}/indicators`);
        const indicatorsData = response.data;
        setIndicators(indicatorsData);

        // Fetch ward scores for each indicator
        const fetchWardScores = async (indicatorId) => {
          const wardScoresResponse = await axios.get(`${PROTOCAL}${IP_ADDRESS}:${PORT}/api/indicators/${indicatorId}/wards`);
          const wardsData = wardScoresResponse.data;
          const wardScores = await axios.get(`${PROTOCAL}${IP_ADDRESS}:${PORT}/api/wardIndicators`);
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

        // Calculate average scores for all indicators
        const averageScoresData = {};
        let totalScore = 0;
        for (const indicator of indicatorsData) {
          const avgScore = await fetchWardScores(indicator.id);
          averageScoresData[indicator.id] = avgScore;
          totalScore += avgScore;
        }

        setAverageScores(averageScoresData);
        setOverallAverageScore(totalScore / indicatorsData.length);
      } catch (error) {
        console.error('Error fetching indicators or ward scores:', error);
        Alert.alert('Error', 'Could not fetch indicators or ward scores');
      }
    };

    fetchIndicators();
  }, [outcomeId]);

  const handleIndicatorPress = (indicatorId, indicatorName) => {
    navigation.navigate('ProvincesScreen', { indicatorId, indicatorName });
  };

  const toggleView = () => {
    setIsChartView(!isChartView);
  };

  const chartData = indicators.map(indicator => ({
    value: averageScores[indicator.id] || 0,
    label: indicator.name,
    frontColor: '#177AD5',
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{outcomeName}</Text>
      <Text style={styles.averageScore}>Overall Average Score: {overallAverageScore.toFixed(1)}%</Text>
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
          data={indicators}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleIndicatorPress(item.id, item.name)}>
              <View style={styles.indicatorContainer}>
                <Text style={styles.indicatorText}>{item.name}</Text>
                <Text style={styles.indicatorScore}>
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
    color: '##1b2c00',
  },
  averageScore: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#070d2d',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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

export default IndicatorsCard;