import React, { useState, useCallback, useEffect } from 'react';
import { View, TextInput, Button, Alert, Text, FlatList } from 'react-native';
import axios from 'axios';
//import { IP_ADDRESS, PORT, PROTOCAL } from '../utils';

const CreateOutcomeScreen = () => {
    const [outcomeName, setOutcomeName] = useState('');
    const [outcomes, setOutcomes] = useState([]);

    useEffect(() => {
        const fetchOutcomes = async () => {
            try {
                const response = await axios.get('http://10.10.30.188:8000/outcomes');
                setOutcomes(response.data);
            } catch (error) {
                console.error('Error fetching outcomes:', error);
                Alert.alert('Error', 'Could not fetch outcomes');
            }
        };

        fetchOutcomes();
    }, []);

    return (
        <View style={{ padding: 20 }}>
            <FlatList
                data={outcomes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: 'gray' }}>
                        <Text>{item.name}</Text>
                    </View>
                )}
            />
        </View>
    );
};

export default CreateOutcomeScreen;
