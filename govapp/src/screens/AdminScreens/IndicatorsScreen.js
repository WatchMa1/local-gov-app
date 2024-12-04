import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';

const Indicators = () => {
  const [indicators, setIndicators] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentIndicator, setCurrentIndicator] = useState(null);
  const [indicatorTitle, setIndicatorTitle] = useState('');

  const API_URL = 'http://10.10.30.188:3000/indicators'; // Replace with your actual API URL

  useEffect(() => {
    fetchIndicators();
  }, []);

  const fetchIndicators = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setIndicators(data);
    } catch (error) {
      console.error('Error fetching indicators:', error);
    }
  };

  const handleCreateIndicator = async () => {
    if (!indicatorTitle) {
      Alert.alert('Validation Error', 'Indicator title is required.');
      return;
    }
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: indicatorTitle }),
      });

      if (response.ok) {
        const newIndicator = await response.json();
        setIndicators([...indicators, newIndicator]);
        setModalVisible(false);
        setIndicatorTitle('');
      } else {
        Alert.alert('Error', 'Failed to create indicator.');
      }
    } catch (error) {
      console.error('Error creating indicator:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  const handleEditIndicator = (indicator) => {
    setCurrentIndicator(indicator);
    setIndicatorTitle(indicator.name);
    setModalVisible(true);
  };

  const handleUpdateIndicator = async () => {
    if (!indicatorTitle) {
      Alert.alert('Validation Error', 'Indicator title is required.');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/${currentIndicator.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: indicatorTitle }),
      });

      if (response.ok) {
        const updatedIndicators = indicators.map((item) =>
          item.id === currentIndicator.id ? { ...item, name: indicatorTitle } : item
        );
        setIndicators(updatedIndicators);
        setModalVisible(false);
        setIndicatorTitle('');
        setCurrentIndicator(null);
      } else {
        Alert.alert('Error', 'Failed to update indicator.');
      }
    } catch (error) {
      console.error('Error updating indicator:', error);
    }
  };

  const handleDeleteIndicator = (id) => {
    Alert.alert(
      'Delete Indicator',
      'Are you sure you want to delete this indicator?',
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
                setIndicators(indicators.filter((item) => item.id !== id));
              } else {
                Alert.alert('Error', 'Failed to delete indicator.');
              }
            } catch (error) {
              console.error('Error deleting indicator:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderIndicator = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.name}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleEditIndicator(item)} style={[styles.button, styles.editButton]}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteIndicator(item.id)} style={[styles.button, styles.deleteButton]}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Indicators</Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => {
          setCurrentIndicator(null);
          setIndicatorTitle('');
          setModalVisible(true);
        }}
      >
        <Text style={styles.createButtonText}>Create Indicator</Text>
      </TouchableOpacity>
      <FlatList
        data={indicators}
        renderItem={renderIndicator}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.popupContent}>
            <Text style={styles.modalTitle}>{currentIndicator ? 'Edit Indicator' : 'Create Indicator'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Indicator Title"
              value={indicatorTitle}
              onChangeText={setIndicatorTitle}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setIndicatorTitle('');
                  setCurrentIndicator(null);
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={currentIndicator ? handleUpdateIndicator : handleCreateIndicator}
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
  itemContainer: {
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
  itemText: {
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
  popupContent: {
    width: '80%', // Adjust width as needed
    padding: 20,
    backgroundColor: '#fff', // White background for the popup
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
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
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#d9534f', // Red color for cancel
  },
  saveButton: {
    backgroundColor: '#5cb85c', // Green color for save
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Indicators;
