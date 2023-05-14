import React, { useEffect, useState } from "react";
import { RouterProps } from "../types";
import { View, Text, StyleSheet, TextInput, Platform, Modal, Animated, TouchableOpacity, ScrollView } from "react-native";
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
	const [currCat, changeCCat] = useState("");
	const [visible, setVisible] = useState(false);

	const fadeAnim = new Animated.Value(1);
	
	const reset = () => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 0,
			useNativeDriver: false,
		}).start();
	}
	const fade = () => {
		Animated.timing(fadeAnim, {
			toValue : 0,
			duration: 1200,
			useNativeDriver: false,
		}).start(()=>{
			setVisible(false);
		});
	}

	const SlideOutModal = ({text}) => {
		
		
		
		  if (!visible) {
			return null;
		  }
		
		  return (
			<Animated.View style={[styles.modalContainer, { opacity: fadeAnim  }]}>
			  <Text style={styles.modalText}>{text}</Text>
			</Animated.View>
		  );
		};

	const jumpChangeCCat = (newCat) => {
		reset();
		console.log(newCat);
		changeCCat(newCat);
		setVisible(true);
		fade();
	}
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
			<View style={[styles.container, { marginTop: 80 }]}>
				<Text style={{ fontSize: 150 }}>{streakCount}</Text>
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
		fontFamily: 'KALAM-REGULAR',
	},
	modalContainer: {
		position: 'absolute',
		top: 20,
		right: 20,
		width: 200,
		height: 100,
		backgroundColor: 'white',
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
		elevation: 4,
	},
	modalText: {
		fontSize: 20,
		fontWeight: 'bold',
	},
});
