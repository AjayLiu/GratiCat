import React, { useState } from "react";

import {
	Alert,
	Modal,
	StyleSheet,
	Text,
	Pressable,
	View,
	TextInput,
} from "react-native";

const SelfPostModal = () => {
	const [modalVisible, setModalVisible] = useState(false);
	const [text, onChangeText] = React.useState("");
	return (
		<View style={styles.centeredView}>
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					Alert.alert("Modal has been closed.");
					setModalVisible(!modalVisible);
				}}
			>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<Pressable
							style={[styles.button, styles.buttonClose]}
							onPress={() => setModalVisible(!modalVisible)}
						>
							<Text> Close </Text>
						</Pressable>
						<Text style={styles.modalText}>
							I'm thankful for...
						</Text>
						<TextInput
							style={styles.input}
							onChangeText={onChangeText}
							value={text}
							placeholder="Write text here"
							placeholderTextColor={"#846c5b"}
						/>
					</View>
				</View>
			</Modal>
			<Pressable
				style={[styles.button, styles.buttonOpen]}
				onPress={() => setModalVisible(true)}
			>
				<Text style={styles.textStyle}>Show Modal</Text>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 22,
	},
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
	buttonOpen: {
		backgroundColor: "#F194FF",
	},
	buttonClose: {
		backgroundColor: "#2196F3",
	},
	input: {
		height: 40,
		margin: 12,
		borderWidth: 0.5,
		borderRadius: 20,
		padding: 10,
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
	modalText: {
		marginBottom: 15,
		textAlign: "center",
	},
});

export default SelfPostModal;
