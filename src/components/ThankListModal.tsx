import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const ListModal = ({ seeable, onClose, reading }) => {

    if(!seeable){
        return null;
    }
    let obj: any = {};
    for(let i = 0; i < reading.length; ++i){
        obj[reading[i].uid] = reading[i].content;
    }
  return (
    <Modal visible={seeable} animationType="fade" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <ScrollView contentContainerStyle={styles.modalTextContainer}>
            <Text style = {[{fontSize: 20,
    textAlign: 'left',
    marginVertical: 5,
    fontWeight:"bold"}]}>I am thankful for: </Text>
          {Object.entries(obj).map(([key, value]) => (
                <View key={key}>
                <Text style={styles.modalText}>{value}</Text>
                </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    maxWidth: 500, // Maximum width of the modal
    maxHeight: 600, // Maximum height of the modal
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalText: {
    fontSize: 20,
    textAlign: 'left',
    marginVertical: 5,
  },
});

export default ListModal;
