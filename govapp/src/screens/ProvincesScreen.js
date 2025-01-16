import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import ProvincesCard from '../components/ProvinceCard';

const ProvincesScreen = ({ route }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ProvincesCard route={route} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ProvincesScreen;