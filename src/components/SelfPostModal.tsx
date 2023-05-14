import { usePost } from "@utils/hooks/usePost";
import { useUser } from "@utils/hooks/useUser";
import React, { useState, useEffect } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

import {
	Alert,
	Modal,
	StyleSheet,
	Text,
	Pressable,
	View,
	TextInput,
	Animated,
} from "react-native";

import { SelfPost } from "src/types";
import { AuthErrorCode } from "@firebase/auth/dist/rn/src/core/errors";

interface Props {
	forceLock: boolean;
	resetForceLock: () => void;
}
const SelfPostModal = (props: Props) => {
	const { makeSelfPost } = usePost();
	const [modalVisible, setModalVisible] = useState(false);
	const [xButtonVisible, setXButtonVisible] = useState(true);
	const [text, onChangeText] = React.useState("");
	const forceLock = async () => {
		setModalVisible(true);
		setXButtonVisible(false);
	};
	useEffect(() => {
		console.log(props.forceLock);
		if (props.forceLock) {
			forceLock();
		} else {
			setXButtonVisible(true);
		}
	}, [props.forceLock]);
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
						{xButtonVisible && (
							<Pressable
								style={[styles.button, styles.buttonClose]}
								onPress={() => setModalVisible(!modalVisible)}
							>
								<Ionicons
									name="close-circle-outline"
									size={20}
								/>
							</Pressable>
						)}
						<View style={styles.note}>
							<TextInput
								style={styles.input}
								onChangeText={onChangeText}
								value={text}
								multiline={true}
								placeholder="I'm Grateful for..."
								placeholderTextColor={"#846c5b"}
							/>
							<Pressable
								style={[styles.button, styles.buttonSubmit]}
								onPress={async () => {
									const cat = await makeSelfPost(text);
									setModalVisible(!modalVisible);
									props.resetForceLock();
									alert(cat);
								}}
							>
								<Ionicons name="send-outline" color={"#f8f4e3"}/>
							</Pressable>
						</View>
					</View>
				</View>
			</Modal>
			<Pressable
				style={[styles.button, styles.buttonOpen]}
				onPress={() => setModalVisible(true)}
			>
				<Ionicons
					name="add-circle-outline"
					color={"#f8f4e3"}
					size={55}
				/>
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
		backgroundColor: "rgba(0,0,0,0.9)",
	},
	modalView: {
		margin: 20,
		backgroundColor: "#f8f4e3",
		borderRadius: 20,
		padding: 10,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
		height: 130,
	},
	button: {
		borderRadius: 20,
		paddingTop: 5,
		paddingBottom: 5,
		paddingLeft: 8,
		paddingRight: 5,
		elevation: 2,
		justifyContent: "center",
		alignItems: "center",
	},
	buttonOpen: {
		backgroundColor: "#e9637c",
		justifyContent: "center",
		alignItems: "center",
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
		padding: 10,
	},
	input: {
		flex: 1,
		marginRight: 10,
		padding: 5,
		backgroundColor: "white",
		borderRadius: 5,
	},
	note: {
		marginTop: 36,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: "#d5d0cd",
		padding: 10,
		borderRadius: 10,
		height: 70,
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
});

export default SelfPostModal;
