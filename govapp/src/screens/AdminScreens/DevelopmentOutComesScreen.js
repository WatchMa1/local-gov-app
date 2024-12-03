import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';

const DevelopmentOutcomesScreen = () => {
  const [outcomes, setOutcomes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentOutcome, setCurrentOutcome] = useState(null);
  const [outcomeTitle, setOutcomeTitle] = useState('');

  const API_URL = 'http://10.10.30.188:3000/outcomes'; // Replace with your actual API URL

  useEffect(() => {
    fetchOutcomes();
  }, []);

  const fetchOutcomes = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setOutcomes(data);
    } catch (error) {
      console.error('Error fetching outcomes:', error);
    }
  };

  const handleCreateOutcome = async () => {
    if (!outcomeTitle) {
      Alert.alert('Validation Error', 'Outcome title is required.');
      return;
    }
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: outcomeTitle }),
      });
      if (response.ok) {
        const newOutcome = await response.json();
        setOutcomes([...outcomes, newOutcome]);
        setModalVisible(false);
        setOutcomeTitle('');
      } else {
        Alert.alert('Error', 'Failed to create outcome.');
      }
    } catch (error) {
      console.error('Error creating outcome:', error);
    }
  };

  const handleEditOutcome = (outcome) => {
    setCurrentOutcome(outcome);
    setOutcomeTitle(outcome.title);
    setModalVisible(true);
  };

  const handleUpdateOutcome = async () => {
    if (!outcomeTitle) {
      Alert.alert('Validation Error', 'Outcome title is required.');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/${currentOutcome.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: outcomeTitle }),
      });
      if (response.ok) {
        const updatedOutcomes = outcomes.map((item) =>
          item.id === currentOutcome.id ? { ...item, title: outcomeTitle } : item
        );
        setOutcomes(updatedOutcomes);
        setModalVisible(false);
        setOutcomeTitle('');
        setCurrentOutcome(null);
      } else {
        Alert.alert('Error', 'Failed to update outcome.');
      }
    } catch (error) {
      console.error('Error updating outcome:', error);
    }
  };

  const handleDeleteOutcome = (id) => {
    Alert.alert(
      'Delete Outcome',
      'Are you sure you want to delete this outcome?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
              });
              if (response.ok) {
                setOutcomes(outcomes.filter((item) => item.id !== id));
              } else {
                Alert.alert('Error', 'Failed to delete outcome.');
              }
            } catch (error) {
              console.error('Error deleting outcome:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderOutcome = ({ item }) => (
    <View style={styles.outcomeContainer}>
      <Text style={styles.outcomeText}>{item.title}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleEditOutcome(item)} style={[styles.button, styles.editButton]}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteOutcome(item.id)} style={[styles.button, styles.deleteButton]}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Development Outcomes</Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => {
          setCurrentOutcome(null);
          setOutcomeTitle('');
          setModalVisible(true);
        }}
      >
        <Text style={styles.createButtonText}>Create Outcome</Text>
      </TouchableOpacity>
      <FlatList
        data={outcomes}
        renderItem={renderOutcome}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
      <Modal visible={modalVisible} animationType="slide" transparent>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>{currentOutcome ? 'Edit Outcome' : 'Create Outcome'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Outcome Title"
        value={outcomeTitle}
        onChangeText={setOutcomeTitle}
      />
      <View style={styles.modalActions}>
        <TouchableOpacity
          style={[styles.modalButton, styles.cancelButton]}
          onPress={() => {
            setModalVisible(false);
            setOutcomeTitle('');
            setCurrentOutcome(null);
          }}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modalButton, styles.saveButton]}
          onPress={currentOutcome ? handleUpdateOutcome : handleCreateOutcome}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#070d2d',
  },
  createButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 20,
  },
  outcomeContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  outcomeText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
  },
  button: {
    padding: 8,
    borderRadius: 5,
    marginLeft: 5,
  },
  editButton: {
    backgroundColor: '#3F51B5',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    minWidth: '40%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default DevelopmentOutcomesScreen;
