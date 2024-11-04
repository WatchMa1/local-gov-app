import React, { useState, useCallback } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import {IP_ADDRESS, PORT, PROTOCAL} from '../utils';

const CreateOutcomeScreen = () => {
    const [outcomeName, setOutcomeName] = useState('');

    // Wrap createOutcome with useCallback to prevent it from re-creating on every render
    const createOutcome = useCallback(async () => {
        try {
            const response = await axios.post(PROTOCAL+IP_ADDRESS+PORT+'/outcomes', { 
                name: outcomeName,
            });
            Alert.alert('Success', `Outcome created with ID: ${response.data.id}`);
            setOutcomeName(''); // Clear the input after success
        } catch (error) {
            console.error('Error creating outcome:', error);
            Alert.alert('Error', 'Could not create outcome');
        }
    }, [outcomeName]);

    return (
        <View style={{ padding: 20 }}>
            <TextInput
                placeholder="Enter outcome name"
                value={outcomeName}
                onChangeText={setOutcomeName}
                style={{
                    height: 40,
                    borderColor: 'gray',
                    borderWidth: 1,
                    marginBottom: 12,
                    paddingHorizontal: 8,
                }}
            />
            <Button title="Create Outcome" onPress={createOutcome} />
        </View>
    );
};

export default CreateOutcomeScreen;
