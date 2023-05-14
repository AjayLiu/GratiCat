import React, { useEffect, useState } from "react";
import { RouterProps } from "../types";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	Platform,
} from "react-native";
import { usePost } from "@utils/hooks/usePost";
import { Button } from "react-native-elements";
import { SelfPost } from "../types";
import { getAuth, signOut } from "firebase/auth";
import { useUser } from "@utils/hooks/useUser";
import SelfPostModal from "@components/SelfPostModal";

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
		<View>
			{mySelfPosts.map((post) => {
				return (
					<View key={post.uid}>
						<Text>{post.content}</Text>
					</View>
				);
			})}
			<View>
				<Button
					onPress={() => {
						signOut(auth);
					}}
					title="Sign out"
				></Button>
			</View>
			<SelfPostModal />
		</View>
	);
}
