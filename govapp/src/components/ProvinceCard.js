import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { PROTOCAL, IP_ADDRESS, PORT } from '../utils/utils';

const ProvinceCard = ({ route }) => {
  const { indicatorId, indicatorName } = route.params;
  const [provinces, setProvinces] = useState([]);
  const [averageScores, setAverageScores] = useState({});
  const [overallAverageScore, setOverallAverageScore] = useState(0);
  const [isChartView, setIsChartView] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(`${PROTOCAL}${IP_ADDRESS}:${PORT}/api/provinces`);
        const provincesData = response.data.results || [];
        setProvinces(provincesData);

        // Fetch ward scores for each district within each province
        const fetchWardScores = async (districtId) => {
          const wardScoresResponse = await axios.get(`${PROTOCAL}${IP_ADDRESS}:${PORT}/api/districts/${districtId}/wards`);
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

        // Fetch districts for each province and calculate average scores
        const fetchDistrictsAndScores = async (provinceId) => {
          const response = await axios.get(`${PROTOCAL}${IP_ADDRESS}:${PORT}/api/provinces/${provinceId}/districts`);
          const districtsData = response.data || [];

          const districtScores = await Promise.all(districtsData.map(async (district) => {
            const avgScore = await fetchWardScores(district.id);
            return avgScore;
          }));

          // Calculate average score for the province
          const totalScore = districtScores.reduce((sum, score) => sum + score, 0);
          const avgScore = districtScores.length > 0 ? totalScore / districtScores.length : 0;
          return avgScore;
        };

        // Calculate average scores for all provinces
        const averageScoresData = {};
        let totalScore = 0;
        for (const province of provincesData) {
          const avgScore = await fetchDistrictsAndScores(province.id);
          averageScoresData[province.id] = avgScore;
          totalScore += avgScore;
        }

        setAverageScores(averageScoresData);
        setOverallAverageScore(totalScore / provincesData.length);
      } catch (error) {
        console.error('Error fetching provinces or ward scores:', error);
        Alert.alert('Error', 'Could not fetch provinces or ward scores');
      }
    };

    fetchProvinces();
  }, [indicatorId]);

  const handleDistrictPress = (provinceId, provinceName) => {
    navigation.navigate('DistrictScreen', { provinceId, provinceName });
  };

  const toggleView = () => {
    setIsChartView(!isChartView);
  };

  const chartData = provinces.map(province => ({
    value: averageScores[province.id] || 0,
    label: province.name,
    frontColor: '#177AD5',
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{indicatorName}</Text>
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
          data={provinces}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleDistrictPress(item.id, item.name)}>
              <View style={styles.provinceContainer}>
                <Text style={styles.provinceText}>{item.name}</Text>
                <Text style={styles.provinceScore}>
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

export default ProvinceCard;