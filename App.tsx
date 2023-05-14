import React, { useState } from "react";
import { ThemeProvider } from "react-native-elements";
import "@config/firebase";
import RootNavigation from "@navigation/index";
import { NavigationContainer } from "@react-navigation/native";

import SelfPostModal from "@components/SelfPostModal";

export default function App() {
	return (
		<NavigationContainer>
			<ThemeProvider>
				<RootNavigation />
				<SelfPostModal />
			</ThemeProvider>
		</NavigationContainer>
	);
}
