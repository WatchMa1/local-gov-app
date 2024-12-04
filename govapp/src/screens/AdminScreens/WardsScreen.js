import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  StyleSheet, 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';


const Wards = () => {
  const [wards, setWards] = useState([]);
  const [indicators, setIndicators] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentWard, setCurrentWard] = useState(null);
  const [wardName, setWardName] = useState('');
  const [selectedIndicator, setSelectedIndicator] = useState(null);

  const WARDS_API_URL = 'http://10.10.30.188:3000/wards'; // Replace with your actual Wards API URL
  const INDICATORS_API_URL = 'http://10.10.30.188:3000/indicators'; // Replace with your actual Indicators API URL

  useEffect(() => {
    fetchWards();
    fetchIndicators();
  }, []);

  const fetchWards = async () => {
    try {
      const response = await fetch(WARDS_API_URL);
      const data = await response.json();
      setWards(data);
    } catch (error) {
      console.error('Error fetching wards:', error);
    }
  };

  const fetchIndicators = async () => {
    try {
      const response = await fetch(INDICATORS_API_URL);
      const data = await response.json();
      setIndicators(data);
    } catch (error) {
      console.error('Error fetching indicators:', error);
    }
  };

  const handleCreateWard = async () => {
    if (!wardName || !selectedIndicator) {
      Alert.alert('Validation Error', 'Both Ward name and Indicator are required.');
      return;
    }
    try {
      console.log('Request body:', { name: wardName, indicator_id: selectedIndicator})
      const response = await fetch(WARDS_API_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: wardName, indicator_id: selectedIndicator }),
      });

      if (response.ok) {
        const newWard = await response.json();
        setWards([...wards, newWard]);
        setModalVisible(false);
        setWardName('');
        setSelectedIndicator(null);
      } else {
        Alert.alert('Error', 'Failed to create ward.');
      }
    } catch (error) {
      console.error('Error creating ward:', error);
    }
  };

  const handleEditWard = (ward) => {
    setCurrentWard(ward);
    setWardName(ward.name);
    setSelectedIndicator(ward.indicator_id);
    setModalVisible(true);
  };

  const handleUpdateWard = async () => {
    if (!wardName || !selectedIndicator) {
      Alert.alert('Validation Error', 'Both Ward name and Indicator are required.');
      return;
    }
    try {
      const response = await fetch(`${WARDS_API_URL}/${currentWard.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: wardName, indicator_id: selectedIndicator }),
      });

      if (response.ok) {
        const updatedWards = wards.map((item) =>
          item.id === currentWard.id ? { ...item, name: wardName, indicator_id: selectedIndicator } : item
        );
        setWards(updatedWards);
        setModalVisible(false);
        setWardName('');
        setSelectedIndicator(null);
        setCurrentWard(null);
      } else {
        Alert.alert('Error', 'Failed to update ward.');
      }
    } catch (error) {
      console.error('Error updating ward:', error);
    }
  };

  const handleDeleteWard = (id) => {
    Alert.alert(
      'Delete Ward',
      'Are you sure you want to delete this ward?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${WARDS_API_URL}/${id}`, {
                method: 'DELETE',
              });
              if (response.ok) {
                setWards(wards.filter((item) => item.id !== id));
              } else {
                Alert.alert('Error', 'Failed to delete ward.');
              }
            } catch (error) {
              console.error('Error deleting ward:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderWard = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.name}</Text>
      <Text style={styles.itemSubText}>
         {indicators.find((ind) => ind.id === item.indicator_id)?.name || 'Unknown'}
      </Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleEditWard(item)} style={[styles.button, styles.editButton]}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteWard(item.id)} style={[styles.button, styles.deleteButton]}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wards</Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => {
          setCurrentWard(null);
          setWardName('');
          setSelectedIndicator(null);
          setModalVisible(true);
        }}
      >
        <Text style={styles.createButtonText}>Create Ward</Text>
      </TouchableOpacity>
      <FlatList
        data={wards}
        renderItem={renderWard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.popupContent}>
            <Text style={styles.modalTitle}>{currentWard ? 'Edit Ward' : 'Create Ward'}</Text>
            <Picker
              selectedValue={selectedIndicator}
              onValueChange={(value) => setSelectedIndicator(value)}
              style={styles.picker}
            >
              <Picker.Item label="Select Indicator" value={null} />
              {indicators.map((indicator) => (
                <Picker.Item key={indicator.id} label={indicator.name} value={indicator.id} />
              ))}
            </Picker>
            <TextInput
              style={styles.input}
              placeholder="Ward Name"
              value={wardName}
              onChangeText={setWardName}
            />
          
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setWardName('');
                  setSelectedIndicator(null);
                  setCurrentWard(null);
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={currentWard ? handleUpdateWard : handleCreateWard}
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

export default Wards;
