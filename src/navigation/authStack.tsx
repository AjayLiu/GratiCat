import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import SignInScreen from "@screens/SignInScreen";

const Stack = createStackNavigator();

export default function AuthStack() {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
			}}
			// screenOptions={{ headerStyle: { backgroundColor: 'papayawhip' } }}
		>
			<Stack.Screen name="Sign In" component={SignInScreen} />
		</Stack.Navigator>
	);
}
