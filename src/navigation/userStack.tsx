import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "@screens/HomeScreen";
import { useUser } from "@utils/hooks/useUser";

const Stack = createStackNavigator();

export default function UserStack() {
	const { authUser, getUserFromFirestore, createUser } = useUser();
	useEffect(() => {
		const checkIfUserCreated = async () => {
			if (!authUser) return;

			const fireUser = await getUserFromFirestore(authUser?.uid || "");
			if (fireUser == -1) {
				await createUser();
			}
		};
		checkIfUserCreated();
	}, [authUser]);
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
