import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import IndicatorsCard from '../components/IndicatorsCard';

const IndicatorsScreen = ({ route }) => {
  return (
    <SafeAreaView style={styles.container}>
      <IndicatorsCard route={route} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default IndicatorsScreen;