import React, { useState } from "react";
import { ThemeProvider } from "react-native-elements";
import "@config/firebase";
import RootNavigation from "@navigation/index";
import { NavigationContainer } from "@react-navigation/native";
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

export default function App() {
	return (
		<NavigationContainer>
			<ThemeProvider>
				<RootNavigation />
			</ThemeProvider>
		</NavigationContainer>
	);
}
