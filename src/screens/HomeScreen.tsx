import React, { useEffect, useState } from "react";
import { RouterProps } from "../types";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	Platform,
	Modal,
	Animated,
	TouchableOpacity,
	ScrollView,
	ImageBackground,
} from "react-native";
import { usePost } from "@utils/hooks/usePost";
import { Button } from "react-native-elements";
import { SelfPost } from "../types";
import { getAuth, signOut } from "firebase/auth";
import { useUser } from "@utils/hooks/useUser";
import SelfPostModal from "@components/SelfPostModal";
import logo from "../assets/images/GratiCatLogo.png";
import ProfileButton from "@components/ProfileButton";
import CoffeeCupProgressBar from "@components/CoffeeCupProgressBar";

const auth = getAuth();

export default function Home({ navigation }: RouterProps) {
	const { authUser, fireUser } = useUser();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
	const { getAllSelfPosts, calculateStreakCount } = usePost();
	const [mySelfPosts, setMySelfPosts] = useState<SelfPost[]>([]);
	const [currCat, changeCCat] = useState("");
	const [visible, setVisible] = useState(false);

	const fadeAnim = new Animated.Value(1);

	const reset = () => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 0,
			useNativeDriver: false,
		}).start();
	};
	const fade = () => {
		Animated.timing(fadeAnim, {
			toValue: 0,
			duration: 1200,
			useNativeDriver: false,
		}).start(() => {
			setVisible(false);
		});
	};
	const resetForceLock = () => {
		console.log("RESET FORCE LOCK");
		setForceLock(false);
	};
	const [forceLock, setForceLock] = useState<boolean>(false);
	useEffect(() => {
		const getPosts = async () => {
			const allPosts = await getAllSelfPosts(authUser?.uid || "");

			// CHECK WHETHER OR NOT TO LOCK USER OUT (IF THEY HAVEN'T POSTED IN 24 HOURS OR NEVER POSTED)
			if (allPosts && allPosts?.length == 0) {
				setForceLock(true);
			}
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
			isFirstLoad ||
			(!isLoading &&
				fireUser?.selfPostsUids &&
				fireUser.selfPostsUids.length != mySelfPosts.length)
		) {
			const refresh = async () => {
				await getPosts();
				await getStreak();

				setIsLoading(false);
				setIsFirstLoad(false);
			};
			refresh();
		}
	}, [fireUser.selfPostsUids]);

	const [streakCount, setStreakCount] = useState<number>(0);
	let progress = mySelfPosts.length > 0 ? (mySelfPosts.length % 5) / 5 : 0;
	progress =
		mySelfPosts.length > 0 && (mySelfPosts.length % 5) / 5 === 0
			? 1
			: (mySelfPosts.length % 5) / 5;

	return (
		<View style={styles.background}>
			<View style={[styles.container, { marginTop: 80 }]}>
				<Text style={{ fontSize: 150, color: "#1d201f" }}>
					{streakCount}
				</Text>
				<Text
					style={{
						fontSize: 30,
						textAlign: "center",
						color: "#1d201f",
					}}
				>
					consecutive days you've loved yourself!
				</Text>
				<ImageBackground
					source={logo}
					style={{
						flex: 0.4,
						width: "100%",
						height: 175,
						marginTop: 50,
						marginBottom: 175,
					}}
					resizeMode="contain"
				/>
			</View>
			<View style={styles.container}>
				<CoffeeCupProgressBar posts={mySelfPosts} />
			</View>
			<View style={styles.container}>
				<Text style={{ fontSize: 30, color: "#1d201f" }}>
					Gratitude Level: {progress * 100}%
				</Text>
			</View>
			<View style={styles.footer}>
				<ProfileButton />
				<SelfPostModal
					forceLock={forceLock}
					resetForceLock={resetForceLock}
				/>
				<TouchableOpacity
					style={[styles.button, { borderRadius: 10 }]}
					onPress={() => {
						signOut(auth);
					}}
				>
					<Text style={styles.text}>Sign Out</Text>
				</TouchableOpacity>
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
		fontFamily: "KALAM-REGULAR",
	},
	modalContainer: {
		position: "absolute",
		top: 20,
		right: 20,
		width: 200,
		height: 100,
		backgroundColor: "white",
		borderRadius: 8,
		justifyContent: "center",
		alignItems: "center",
		elevation: 4,
	},
	modalText: {
		fontSize: 20,
		fontWeight: "bold",
	},
});
