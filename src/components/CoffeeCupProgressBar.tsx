import React, { useState } from "react";
import { Image, View, StyleSheet, ImageBackground } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SelfPost } from "src/types";

const calculateProgress = (posts: SelfPost[]) => {
	const progress = posts.length % 5;
	return progress === 0 ? 1 : progress / 5;
};

const CoffeeCupProgressBar = ({ posts }: { posts: SelfPost[] }) => {
	const progress = calculateProgress(posts);

	return (
		<View style={styles.container}>
			<View style={styles.coffeeCup}>
				<View
					style={{
						position: "absolute",
						bottom: 0,
						height: `${progress * 100}%`,
						width: "100%",
						backgroundColor: "#1d201f",
						borderColor: "#1d201f",
						borderWidth: 7,
						borderBottomLeftRadius: 5,
						borderBottomRightRadius: 5,
						borderBottomStartRadius: 10,
						borderBottomEndRadius: 10,
						overflow: "hidden",
					}}
				></View>
			</View>
			<View style={styles.handle}></View>
			<View style={styles.plate}></View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		justifyContent: "center",
		alignItems: "center",
	},
	coffeeCup: {
		position: "relative",
		width: 100,
		height: 80,
		borderWidth: 7,
		borderColor: "#1d201f",
		borderBottomLeftRadius: 5,
		borderBottomRightRadius: 5,
		borderBottomStartRadius: 40,
		borderBottomEndRadius: 40,
		overflow: "hidden",
	},
	handle: {
		position: "absolute",
		top: 8,
		left: 95,
		width: 30,
		height: 40,
		borderWidth: 6,
		borderColor: "#1d201f",
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 10,
		borderBottomStartRadius: 0,
		borderBottomEndRadius: 25,
	},
	plate: {
		width: "100%",
		height: 12,
		backgroundColor: "#1d201f",
		borderRadius: 20,
	},
});

export default CoffeeCupProgressBar;
