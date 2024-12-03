import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const CustomHeader = ({ title }) => {
  const navigation = useNavigation();
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => setIsMenuVisible(!isMenuVisible)}
        style={styles.menuButton}
      >
        <Ionicons name="menu" size={24} color="#1b2c00" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.rightContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Entertainment')}
          style={styles.entertainmentButton}
        >
          <MaterialCommunityIcons name="movie-open" size={24} color="#1b2c00" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={isMenuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setIsMenuVisible(false)}
        >
          <View style={styles.menuModal}>



            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Profile Not Found",
                  "Please create an account to view your Profile.",
                  [
                    {
                      text: "OK",
                      onPress: () => {
                        Alert.alert(
                          "Create Account",
                          "Would you like to create an account?",
                          [
                            {
                              text: "Yes",
                              onPress: () => {
                                setIsMenuVisible(false);
                              },
                            },
                            {
                              text: "No",
                              onPress: () => console.log("User choose not to create an account"),
                              style: "cancel",
                            },
                          ],
                          { cancelable: true }
                        );
                      },
                    },
                  ],
                  { cancelable: true }
                );
              }}
              style={styles.menuItem}
            >
              <Ionicons name="person" size={24} color="#FFA500" />
              <Text style={styles.menuItemText}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('CreateOutcome')} cstyle={styles.menuItem}>
              <Ionicons name="cloud-upload" size={24} color="#FFA500" />
              <Text style={styles.menuItemText}> Create Development Outcome</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setIsMenuVisible(false);
                navigation.navigate('About');
              }}
              style={styles.menuItem}
            >
              <Ionicons name="information-circle" size={24} color="#FFA500" />
              <Text style={styles.menuItemText}>About</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="log-out" size={24} color="#FFA500" />
              <Text style={styles.menuItemText}>Sign Out</Text>
            </TouchableOpacity>

          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f4f0f4',
    paddingVertical: 10,
    paddingTop: 40,
    paddingHorizontal: 25,
  },
  menuButton: {
    marginRight: 15,
  },
  myListingsButton: {
    marginRight: 15,
  },
  title: {
    color: '#1b2c00',
    fontSize: 20,
    fontWeight: 'bold',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  menuModal: {
    backgroundColor: '#1b2c00',
    padding: 15,
    width: '70%',
    borderRadius: 5,
    elevation: 10,
    marginTop: 100,
    marginLeft: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuItemText: {
    color: '#f46500',
    fontSize: 18,
    marginLeft: 10,
  },
  entertainmentButton:{
    color: '#1b2c00',
  }
});

export default CustomHeader;