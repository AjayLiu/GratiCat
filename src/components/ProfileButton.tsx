import React from "react";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import { IconType } from "react-icons";
import { useNavigation } from "@react-navigation/native";
import profile from "../assets/images/GratiCatLogo.png";
import { Image } from "react-native-elements";
import { useUser } from "@utils/hooks/useUser";

const ProfileButton = ({}) => {
	const { authUser } = useUser();
	const navigation = useNavigation();

	return (
		<TouchableOpacity
			onPress={() => navigation.navigate("Profile")}
			style={styles.container}
		>
			<View style={styles.profileIconContainer}>
				<Image source={{ uri: authUser?.photoURL }} />
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 10,
		paddingHorizontal: 15,
		backgroundColor: "#e9637c",
		borderRadius: 20,
	},
	profileIconContainer: {
		backgroundColor: "#fff",
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: "center",
		alignItems: "center",
	},
	profileIcon: {
		color: "#000",
		fontSize: 20,
	},
	text: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
	image: {
		width: 100,
		height: 100,
		resizeMode: "cover",
	},
});

export default ProfileButton;
