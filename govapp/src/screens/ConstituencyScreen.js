import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import ConstituencyCard from '../components/ConstituencyCard';

const ConstituencyScreen = ({ route }) => {
  return (
    <SafeAreaView style={styles.container}>
      < ConstituencyCard route={route} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ConstituencyScreen;