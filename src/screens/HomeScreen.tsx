import React, { useEffect, useState } from "react";
import { RouterProps } from "../types";
import { View, Text, StyleSheet, TextInput, Platform } from "react-native";
import { usePost } from "@utils/hooks/usePost";
import { Button } from "react-native-elements";
import { SelfPost } from "../types";
import { getAuth, signOut } from "firebase/auth";
import { useUser } from "@utils/hooks/useUser";
import SelfPostModal from "@components/SelfPostModal";
import logo from "../assets/images/GratiCatLogo.png";
import ProfileButton from "@components/ProfileButton";

const auth = getAuth();

export default function Home({ navigation }: RouterProps) {
	const { authUser, fireUser } = useUser();
	const { getAllSelfPosts } = usePost();
	const [mySelfPosts, setMySelfPosts] = useState<SelfPost[]>([]);
	useEffect(() => {
		const getPosts = async () => {
			setMySelfPosts((await getAllSelfPosts(authUser?.uid || "")) || []);
		};

		if (authUser) {
			// console.log("authUser found.");
			getPosts();
		}
	}, [fireUser.selfPostsUids]);
	return (
		<View style={styles.background}>
			<View style={[styles.container, { marginTop: 80 }]}>
				<Text style={{ fontSize: 150 }}>12</Text>
				<Text style={{ fontSize: 30, textAlign: "center" }}>
					consecutive days you've loved yourself!
				</Text>
				{mySelfPosts.map((post) => {
					return (
						<View key={post.uid}>
							<Text>{post.content}</Text>
						</View>
					);
				})}
			</View>
			<View style={styles.container}>
				<SelfPostModal />
				<Button
					style={styles.button}
					onPress={() => {
						signOut(auth);
					}}
					title="Sign out"
				></Button>
			</View>
			<View style={styles.footer}>
				<ProfileButton />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	background: {
		backgroundColor: "#846c5b",
		flex: 1,
	},
	container: {
		justifyContent: "center",
		alignItems: "center",
		margin: 40,
	},
	button: {
		backgroundColor: "#e9637c",
	},
	footer: {
		flexDirection: "row",
		justifyContent: "space-between",
		position: "absolute",
		bottom: 0,
		width: "100%",
		padding: 25,
	},
});
