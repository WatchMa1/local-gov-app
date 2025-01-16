import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import ProvincesCard from '../components/ProvinceCard';
import WardCard from '../components/WardCard';

const WardsScreen = ({ route }) => {
  return (
    <SafeAreaView style={styles.container}>
      <WardCard route={route} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default WardsScreen;