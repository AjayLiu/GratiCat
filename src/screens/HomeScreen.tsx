import React, { useEffect, useState } from "react";
import { RouterProps } from "../types";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	Platform,
	TouchableOpacity,
} from "react-native";
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
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { getAllSelfPosts, calculateStreakCount } = usePost();
	const [mySelfPosts, setMySelfPosts] = useState<SelfPost[]>([]);
	const [forceLock, setForceLock] = useState<boolean>(false);
	useEffect(() => {
		const getPosts = async () => {
			const allPosts = await getAllSelfPosts(authUser?.uid || "");

			// CHECK WHETHER OR NOT TO LOCK USER OUT (IF THEY HAVEN'T POSTED IN 24 HOURS OR NEVER POSTED)
			if (authUser?.uid) {
				if (!allPosts || allPosts?.length == 0) {
					setForceLock(true);
				} else {
					const latestPost = allPosts[allPosts.length - 1];
					if (
						Date.now() / 1000 - latestPost.timestamp.seconds >
						60 * 60 * 24
					) {
						setForceLock(true);
					}
				}
			}

			setMySelfPosts(allPosts || []);
		};
		const getStreak = async () => {
			const streak = await calculateStreakCount();
			setStreakCount(streak);
		};

		if (
			!isLoading &&
			fireUser?.selfPostsUids &&
			fireUser.selfPostsUids.length != mySelfPosts.length
		) {
			const refresh = async () => {
				setIsLoading(true);
				await getPosts();
				await getStreak();

				setIsLoading(false);
			};
			refresh();
		}
	}, [fireUser.selfPostsUids]);

	const [streakCount, setStreakCount] = useState<number>(0);

	return (
		<View style={styles.background}>
			<View
				style={[
					styles.container,
					styles.phoneSection,
					{ marginTop: 80 },
				]}
			>
				<Text
					style={{
						fontSize: 35,
						textAlign: "center",
						color: "#1D201F",
					}}
				>
					you've loved yourself for
				</Text>
				<Text style={{ fontSize: 150, color: "#1D201F" }}>
					{streakCount}
				</Text>
				<Text
					style={{
						fontSize: 35,
						textAlign: "center",
						color: "#1D201F",
					}}
				>
					days in a row!
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
				<TouchableOpacity
					style={[styles.button, { borderRadius: 10 }]}
					onPress={() => {
						signOut(auth);
					}}
				>
					<Text style={styles.text}>Sign Out</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.footer}>
				<ProfileButton />
				<SelfPostModal forceLock={forceLock} />
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
		backgroundColor: "#E9637C",
		padding: 10,
		alignItems: "center",
	},
	footer: {
		flexDirection: "row",
		justifyContent: "space-between",
		position: "absolute",
		bottom: 0,
		width: "100%",
		padding: 25,
	},
	phoneSection: {
		flexDirection: "column",
		flex: 0.5,
		backgroundColor: "#F8F4E3",
		borderRadius: 25,
		padding: 20,
		width: "80%",
	},
	text: {
		color: "#F8F4E3",
		marginVertical: 10,
		//fontFamily: 'KALAM-REGULAR',
		fontSize: 18,
	},
});
