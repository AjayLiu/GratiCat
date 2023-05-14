import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "@screens/HomeScreen";
import ProfileScreen from "@screens/Profile";
import { useUser } from "@utils/hooks/useUser";

import FireUserContext from "../contexts/fireUser";
import { FirestoreUser } from "src/types";

const Stack = createStackNavigator();

export default function UserStack() {
	const { authUser, getUserFromFirestore, createUser } = useUser();
	const [fireUser, setFireUser] = useState({} as FirestoreUser);

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
		<FireUserContext.Provider value={{ fireUser, setFireUser }}>
			<Stack.Navigator
				screenOptions={{
					headerShown: false,
					headerBackTitleVisible: false,
				}}
			>
				<Stack.Screen name="Home" component={HomeScreen} />
				<Stack.Screen
					name="Profile"
					component={ProfileScreen}
					options={{ gestureDirection: "horizontal-inverted" }}
				/>
			</Stack.Navigator>
		</FireUserContext.Provider>
	);
}
