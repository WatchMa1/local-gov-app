import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

const DashboardCards = () => {
  const navigation = useNavigation();

  const handleCardPress = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handleCardPress('DevelopmentOutcomes')}>
        <Card containerStyle={[styles.card, { borderColor: '#4CAF50' }]}>
          <View style={styles.cardHeader}>
            <Icon name="trending-up" type="material" size={28} color="#4CAF50" />
            <Text style={[styles.title, { color: '#4CAF50' }]}>
              Development Outcomes
            </Text>
          </View>
          <Text style={styles.description}>Overview of project results.</Text>
        </Card>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleCardPress('Indicators')}>
        <Card containerStyle={[styles.card, { borderColor: '#3F51B5' }]}>
          <View style={styles.cardHeader}>
            <Icon name="assessment" type="material" size={28} color="#3F51B5" />
            <Text style={[styles.title, { color: '#3F51B5' }]}>Indicators</Text>
          </View>
          <Text style={styles.description}>Measure progress with key metrics.</Text>
        </Card>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleCardPress('Wards')}>
        <Card containerStyle={[styles.card, { borderColor: '#FF9800' }]}>
          <View style={styles.cardHeader}>
            <Icon name="location-on" type="material" size={28} color="#FF9800" />
            <Text style={[styles.title, { color: '#FF9800' }]}>Wards</Text>
          </View>
          <Text style={styles.description}>List of administrative areas.</Text>
        </Card>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleCardPress('Users')}>
        <Card containerStyle={[styles.card, { borderColor: '#673AB7' }]}>
          <View style={styles.cardHeader}>
            <Icon name="people" type="material" size={28} color="#673AB7" />
            <Text style={[styles.title, { color: '#673AB7' }]}>Users</Text>
          </View>
          <Text style={styles.description}>Manage system users.</Text>
        </Card>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleCardPress('Roles')}>
        <Card containerStyle={[styles.card, { borderColor: '#F44336' }]}>
          <View style={styles.cardHeader}>
            <Icon name="security" type="material" size={28} color="#F44336" />
            <Text style={[styles.title, { color: '#F44336' }]}>Roles</Text>
          </View>
          <Text style={styles.description}>Define user permissions.</Text>
        </Card>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
});

export default DashboardCards;
