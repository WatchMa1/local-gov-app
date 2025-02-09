import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const WardCard = ({ route }) => {
  const { constituencyId, constituencyName } = route.params;
  const [wards, setWards] = useState([]);
  const [averageScore, setAverageScore] = useState(0);
  const [isChartView, setIsChartView] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchWards = async () => {
      try {
        const response = await axios.get(`http://192.168.191.102:8000/api/constituencies/${constituencyId}/wards`);
        const wardsData = response.data;
        console.log('Wards API Response:', wardsData); // Debugging: Log the API response

        // Fetch ward scores
        const wardScoresResponse = await axios.get('http://192.168.191.102:8000/api/wardIndicators');
        const wardScoresData = wardScoresResponse.data.results;
        console.log('Ward Scores API Response:', wardScoresData); // Debugging: Log the API response

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

  const chartData = {
    labels: wards.map(ward => ward.ward_name),
    datasets: [
      {
        data: wards.map(ward => ward.score),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{constituencyName}</Text>
      <Text style={styles.averageScore}>Average Score: {averageScore.toFixed(2)}%</Text>
      <View style={styles.toggleContainer}>
        <Text>List View</Text>
        <Switch value={isChartView} onValueChange={toggleView} />
        <Text>Chart View</Text>
      </View>
      {isChartView ? (
        <BarChart
          data={chartData}
          width={Dimensions.get('window').width - 40} // from react-native
          height={220}
          yAxisLabel=""
          yAxisSuffix="%"
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      ) : (
        <FlatList
          data={wards}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleWardPress(item.id, item.ward_name)}>
              <View style={styles.wardContainer}>
                <Text style={styles.wardText}>{item.ward_name}</Text>
                <Text style={styles.wardScore}>{item.score}%</Text>
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
  wardText: {
    fontSize: 16,
    color: '#070d2d',
  },
  wardScore: {
    fontSize: 16,
    color: '#070d2d',
  },
});

export default WardCard;