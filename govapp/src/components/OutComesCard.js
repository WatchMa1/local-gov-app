import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const DashboardCards = () => {
    const navigation = useNavigation();
    const [outcomes, setOutcomes] = useState([]);

    useEffect(() => {
        const fetchOutcomes = async () => {
            try {
                const response = await axios.get('http://192.168.17.102:8000/api/outcomes');
                setOutcomes(response.data.results); // Extract only the results array
            } catch (error) {
                console.error('Error fetching outcomes:', error);
                Alert.alert('Error', 'Could not fetch outcomes');
            }
        };

        fetchOutcomes();
    }, []);

    const handleCardPress = (outcomeId) => {
        navigation.navigate('IndicatorsScreen', { outcomeId });
    };

    const colors = ['#3F51B5'];

    return (
        <View style={{ padding: 20 }}>
            <FlatList
                data={outcomes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => {
                    const color = colors[index % colors.length]; // Cycle through colors
                    return (
                        <TouchableOpacity onPress={() => handleCardPress(item.id)}>
                            <Card containerStyle={[styles.card, { borderColor: color }]}>
                                <View style={styles.cardHeader}>
                                    <Icon name="trending-up" type="material" size={28} color={color} />
                                    <Text style={[styles.title, { color }]} numberOfLines={2} ellipsizeMode="tail">{item.name}</Text>
                                </View>
                                <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">{item.description}</Text>
                            </Card>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
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
        flexShrink: 1,
    },
    description: {
        fontSize: 14,
        color: '#555',
        flexShrink: 1,
        flexWrap: 'wrap',
    },
});

export default DashboardCards;