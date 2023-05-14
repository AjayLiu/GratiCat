import React, { useEffect } from "react";
import { RouterProps } from "../types";
import { View, Text } from "react-native";
import { usePost } from "@utils/hooks/usePost";
import { Button } from "react-native-elements";
import { SelfPost } from "../types";
import { getAuth, signOut } from "firebase/auth";

const auth = getAuth();

export default function Home({ navigation }: RouterProps) {
	const { getMySelfPosts, makeSelfPost } = usePost();
	let mySelfPosts: SelfPost[] = [];
	useEffect(() => {
		const getPosts = async () => {
			mySelfPosts = await getMySelfPosts();
			console.log(mySelfPosts);
		};
		getPosts();
	}, []);
	return (
		<View>
			<Button
				style={{ marginTop: 100, width: 100, height: 100 }}
				onPress={() => {
					makeSelfPost("hello");
				}}
				title="POST!"
			></Button>
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
		</View>
	);
}
