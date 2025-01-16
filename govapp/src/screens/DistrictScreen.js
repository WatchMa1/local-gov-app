import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import DistrictCard from '../components/DistrictCard';

const DistrictScreen = ({ route }) => {
  return (
    <SafeAreaView style={styles.container}>
      < DistrictCard route={route} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default DistrictScreen;