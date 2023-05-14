import { usePost } from "@utils/hooks/usePost";
import { useUser } from "@utils/hooks/useUser";
import React, { useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

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
	const { makeSelfPost } = usePost();
	const [modalVisible, setModalVisible] = useState(false);
	const [text, onChangeText] = React.useState("");
	return (
		<View>
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
							<Ionicons name="close-circle-outline" size={20} />
						</Pressable>
						<View style={styles.note}>
							<TextInput
								style={styles.input}
								onChangeText={onChangeText}
								value={text}
								multiline={true}
								placeholder="I'm thankful for..."
								placeholderTextColor={"#846c5b"}
							/>
							<Pressable
								style={[styles.button, styles.buttonSubmit]}
								onPress={async () => {
									await makeSelfPost(text);
								}}
							>
								<Ionicons name="send-outline" color={"white"} />
							</Pressable>
						</View>
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
		marginTop: 10,
	},
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 30,
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
		padding: 5,
		elevation: 2,
	},
	buttonOpen: {
		backgroundColor: "#e9637c",
	},
	buttonClose: {
		backgroundColor: "#e9637c",
		position: "absolute",
		top: 5,
		right: 5,
	},
	buttonSubmit: {
		backgroundColor: "#1d201f",
		borderRadius: 5,
		padding: 5,
	},
	input: {
		flex: 1,
		marginRight: 10,
		padding: 5,
		backgroundColor: "white",
		borderRadius: 5,
	},
	note: {
		marginTop: 20,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: "#d5d0cd",
		padding: 10,
		borderRadius: 10,
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
});

export default SelfPostModal;
