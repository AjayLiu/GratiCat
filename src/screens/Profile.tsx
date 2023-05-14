import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SelfPost, RouterProps } from "src/types";
import { useUser } from "@utils/hooks/useUser";
import Ionicons from "@expo/vector-icons/Ionicons";
import UserCalendar from "@components/UserCalendar";
import { usePost } from "@utils/hooks/usePost";
import { DateData } from "react-native-calendars";
import { getCalendarDateString } from "react-native-calendars/src/services";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { useCallback } from "react";
import ProfilePicture from "@components/ProfilePicture";
import colors from "@styles/colors";
import flexbox from "@styles/flexbox";
import font from "@styles/font";

export default function Profile({ navigation }: RouterProps) {
	const { fireUser, authUser, fetchFireUser } = useUser();
	const { getAllSelfPosts, calculateStreakCount } = usePost();
	const [posts, setPosts] = useState<SelfPost[]>([]);
	const [day, setDay] = useState<DateData>({
		year: new Date().getFullYear(),
		month: new Date().getMonth() + 1,
		day: new Date().getDate(),
		timestamp: new Date().getTime(),
		dateString: getCalendarDateString(new Date()),
	});

	const [refreshing, setRefreshing] = React.useState(false);

	const onRefresh = useCallback(async () => {
		await fetchAllPosts();
		await fetchFireUser();
		setRefreshing(false);
	}, []);

	const fetchAllPosts = async () => {
		const allPosts = await getAllSelfPosts(authUser?.uid || "");
		if (allPosts) setPosts(allPosts);
	};

	useEffect(() => {
		fetchAllPosts();
	}, [fireUser?.selfPostsUids]);

	const [postsToDisplay, setPostsToDisplay] = useState<SelfPost[]>([]);

	const getPostsForDay = async (day: DateData) => {
		const postsToShow: SelfPost[] = [];
		posts.forEach((post) => {
			const timestamp = post.timestamp.toDate();
			const date: string = getCalendarDateString(timestamp);
			if (date === day.dateString && post.authorUid == fireUser?.uid) {
				postsToShow.push(post);
			}
		});
		setPostsToDisplay(postsToShow);
	};

	function dayPress(date: DateData) {
		getPostsForDay(date);
		setDay(date);
	}

	function dateToString(day: DateData) {
		const date = new Date(day.year, day.month - 1, day.day);
		const dayOfWeek = date.getDay();
		const days = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		];

		return (
			days[dayOfWeek] +
			", " +
			date.toLocaleString("en-US", { month: "long", day: "numeric" })
		);
	}

	useEffect(() => {
		const getStreak = async () => {
			const streak = await calculateStreakCount();
			setStreak(streak);
		};
		getStreak();
	}, []);
	const [streak, setStreak] = useState<number>(0);

	return (
		<View style={{ flex: 1 }}>
			<View
				style={[
					styles.height100,
					colors.offBlackBG,
					flexbox.column,
					flexbox.alignCenter,
					flexbox.justifyStart,
				]}
			>
				<ProfilePicture
					size={100}
					style={[styles.marB, styles.marT]}
					image={authUser?.photoURL || ""}
				/>
				<Text
					style={[
						font.fontBold,
						font.sizeXL,
						styles.marT,
						styles.marB,
						colors.offWhite,
					]}
				>
					{fireUser.displayName}
				</Text>

				<View
					style={[
						styles.width100,
						flexbox.row,
						flexbox.justifyEvenly,
						styles.marT,
					]}
				>
					<View style={flexbox.column}>
						<Text
							style={[
								font.textCenter,
								font.sizeXL,
								colors.offWhite,
							]}
						>
							{streak}
						</Text>
						<Text style={[font.sizeL, colors.offWhite]}>
							day streak
						</Text>
					</View>
					<View style={flexbox.column}>
						<Text
							style={[
								font.textCenter,
								font.sizeXL,
								colors.offWhite,
							]}
						>
							{posts.length}
						</Text>
						<Text style={[font.sizeL, colors.offWhite]}>
							{posts.length == 1 ? "post" : "posts"}
						</Text>
					</View>
				</View>
				<View style={[styles.width100, styles.marT]}>
					<UserCalendar
						posts={posts}
						dayPress={dayPress}
						selected={day}
					/>
				</View>
				<View style={{ marginTop: 0 }}>
					<Text>
						On {dateToString(day)}, you were grateful for...
					</Text>
					{postsToDisplay.map((post) => {
						return (
							<View key={post.uid}>
								<Text>{post.content}</Text>
							</View>
						);
					})}
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	marB: {
		marginBottom: 5,
	},
	marT: {
		marginTop: 5,
	},
	marR: {
		marginRight: 15,
	},
	marL: {
		marginLeft: 15,
	},
	width100: {
		width: "100%",
	},
	width90: {
		width: "90%",
	},
	height100: {
		height: "100%",
	},
});
