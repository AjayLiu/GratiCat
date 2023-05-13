import React from "react";
import { StyleSheet, View } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "@screens/HomeScreen";

const Stack = createStackNavigator();

export default function UserStack() {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
				headerBackTitleVisible: false,
			}}
		>
			<Stack.Screen name="Home" component={HomeScreen} />
		</Stack.Navigator>
	);
}
