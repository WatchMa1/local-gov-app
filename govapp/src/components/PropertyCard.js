
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Card, Icon } from '@rneui/themed';

const data = [
  {
    id: 1,
    title: 'Development Outcomes',
    description: 'Overview of project results.',
    icon: 'trending-up',
    color: '#4CAF50',
  },
  {
    id: 2,
    title: 'Indicators',
    description: 'Measure progress with key metrics.',
    icon: 'assessment',
    color: '#3F51B5',
  },
  {
    id: 3,
    title: 'Wards',
    description: 'List of administrative areas.',
    icon: 'location-on',
    color: '#FF9800',
  },
  {
    id: 4,
    title: 'Users',
    description: 'Manage system users.',
    icon: 'people',
    color: '#673AB7',
  },
  {
    id: 5,
    title: 'Roles',
    description: 'Define user permissions.',
    icon: 'security',
    color: '#F44336',
  },
];

const DashboardCards = () => {
  const renderItem = ({ item }) => (
    <TouchableOpacity>
      <Card containerStyle={[styles.card, { borderColor: item.color }]}>
        <View style={styles.cardHeader}>
          <Icon
            name={item.icon}
            type="material"
            size={28}
            color={item.color}
            containerStyle={styles.icon}
          />
          <Text style={[styles.title, { color: item.color }]}>{item.title}</Text>
        </View>
        <Text style={styles.description}>{item.description}</Text>
      </Card>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
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
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
});

export default DashboardCards;
