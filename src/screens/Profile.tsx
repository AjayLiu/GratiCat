import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Button, Image} from "react-native";
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
import { get_summary } from "@utils/hooks/Vector";
import PieChartRatio from "@components/ProfileStats";
import { PanResponder, Animated } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import ListModal from "@components/ThankListModal";

const DraggableUpView = (props: any) => {
	if(true){
		if(Object.entries(props.category_ratio).length !== 0){
			
			const pan = useRef(new Animated.ValueXY()).current;
			
			const panResponder = PanResponder.create({
				onStartShouldSetPanResponder: () => true,
				onPanResponderMove: Animated.event([null, { dy: pan.y }], {
				useNativeDriver: false
				}),
				onPanResponderRelease: (e, gesture) => {
				if (gesture.dy > 50) {
					Animated.timing(pan, {
					toValue: { x: 0, y: 300 },
					duration: 300,
					useNativeDriver: false
					}).start();
				} else {
					Animated.spring(pan, {
					toValue: { x: 0, y: 0 },
					useNativeDriver: false
					}).start();
				}
				}
			});
			
			return (
				<View style={{ flex: 1}}>
				<Animated.View
					{...panResponder.panHandlers}
					style={[pan.getLayout(), { backgroundColor: 'white', height: 900, width: 388, borderRadius: 25 }]}
				>
					<View style = {[{height: 60}]}>
						<View style = {[{backgroundColor: 'black', height: 5, top: 10, width: 270, left: 388/2 - 270 /2}]}></View>
					</View>
					<PieChartRatio ratios = {props.category_ratio}></PieChartRatio>
				</Animated.View>
				</View>
			);
		}
	}
	return(
		<View></View>
	)
	};

export default function Profile({ navigation }: RouterProps) {
	const { fireUser, authUser, fetchFireUser } = useUser();
	const { getAllSelfPosts, calculateStreakCount } = usePost();
	const [category_ratio, setCategoryRatio] = useState({});
	const [posts, setPosts] = useState<SelfPost[]>([]);
	const [daily_summary, changeDailySummary] = useState('');
	const [rawposts, setRawPosts] = useState<string[]>([]);
	const [shown, setShown] = useState(false);
	const [beenPressed, setBeenPressed] = useState(false);
	const [startedAnimation, setAnim] = useState(false);
	const [queryText, changeQueryText] = useState("want a review...?");
	const [readyGuard, changeReady] = useState(false);
	const [listModalVisible, setListModVis] = useState(false);
	const [thankListString, changeThankListString] = useState("");
	const [day, setDay] = useState<DateData>({
		year: new Date().getFullYear(),
		month: new Date().getMonth() + 1,
		day: new Date().getDate(),
		timestamp: new Date().getTime(),
		dateString: getCalendarDateString(new Date()),
	});
	const animation = useRef(new Animated.Value(0)).current;
	const animation2 = useRef(new Animated.Value(0)).current;

	const [refreshing, setRefreshing] = React.useState(false);
	

	const onRefresh = useCallback(async () => {
		await fetchAllPosts();
		await fetchFireUser();
		setRefreshing(false);
	}, []);

	const fetchAllPosts = async () => {
		const allPosts = await getAllSelfPosts(authUser?.uid || "");
		if (allPosts) setPosts(allPosts);
		
		// console.log(category_ratio);
		console.log("YAY\n")
		
	};

	const animateFade = () => {
		Animated.timing(animation2, {
			toValue: 1,
			duration: 1000,
			useNativeDriver: false,
		}).start();
	}

	const retrieveExperiemental = async () => {
		if(readyGuard){
			if(!beenPressed){
				changeQueryText("finding your gratitude...")
				setBeenPressed(true);
				const data = getContentOnly(posts);
				
				if(!daily_summary){	
					const api_summary = await get_summary(data);
					changeDailySummary(api_summary);
					console.log(data);
					setRawPosts(data);
					setCategoryRatio(getRatios(posts));
					animateFade();
					changeQueryText("^ w ^");
				}
				setShown(true);
				//
				console.log("sus");
			}
		}
	}


	const getRatios = (data: any) => {
		const max_len = data.length;
		let ratios: any = {};
		for(let i = 0; i < data.length; ++i){
			let word = data[i].category;
	
			if(ratios[word]){
				ratios[word]++;
			} else {
				ratios[word] = 1;
			}
		}
		const keys = Object.keys(ratios);
		for(let i = 0; i < keys.length; ++i){
		
			ratios[keys[i]] /= max_len;
		}
		console.log(ratios);
	
		return ratios;
	}
	const getContentOnly = (data: any) => {
		let ans = [];
		for(let i = 0; i < data.length; ++i){
			
			ans.push(data[i].content);
		}
		
		return ans;
	}

	useEffect(() => {
		fetchAllPosts();
		
		
		const animateGradient = () => {
			if(!startedAnimation){
				setAnim(true);
				Animated.timing(animation, {
				toValue: 1,
				duration: 1600,
				useNativeDriver: false,
				}).start(() => {
				// Reset the animation
				animation.setValue(0);
				animateGradient();
				
				});
			}
		  };
		  animateGradient();
	}, [fireUser?.selfPostsUids]);

	
	

	const interpolateColors = animation.interpolate({
		inputRange: [0, 0.25, 0.75, 1],
		outputRange: ['#e96e7c', '#84DCCF', '#947BD3', '#e96e7c'], // Example gradient colors
	  });

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
	const closeModal = () => {
		setListModVis(false);
	  };

	function dayPress(date: DateData) {
		getPostsForDay(date);
		setDay(date);
		let ans = "";
		for(let i = 0 ; i < postsToDisplay.length; ++i){
			ans += postsToDisplay + '\n';
		}
		changeThankListString(ans);
		setListModVis(true);
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
			changeReady(true);
		};
		getStreak();
		console.log(listModalVisible);
	}, []);
	const [streak, setStreak] = useState<number>(0);

	return (
		<View style={{ flex: 1 }}>
			<ListModal seeable = {listModalVisible} onClose = {closeModal} reading = {postsToDisplay}></ListModal>
			<View
				style={[
					styles.height100,
					colors.offBlackBG,
					flexbox.column,
					flexbox.alignCenter,
					flexbox.justifyStart,
				]}
			>
				<View style = {[{height: 20}]}></View>
				<Text
					style={[
						font.fontBold,
						font.sizeXL,
						styles.marT,
						styles.marB,
						colors.offWhite,
					]}
				>
			
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
					{/* <Text>
						On {dateToString(day)}, you were grateful for...
					</Text>
					{postsToDisplay.map((post) => {
						return (
							<View key={post.uid}>
								<Text>{post.content}</Text>
							</View>
						);
					})} */}
					<View style = {[{height: 300, width: 364, backgroundColor: '#515052', borderRadius: 25, marginBottom: 20}]}>
					<TouchableOpacity onPress = {retrieveExperiemental} >
						<View style = {[{width: 350, backgroundColor: '#706F6F', left: 7, borderRadius: 20, top: 10, height: 36}]}>
					<View style={[{
							left: 20,
							top: 8,
							width: 20,
							height: 20,
							borderRadius: 0,
							overflow: 'hidden',
							transform: [{ rotate: '45deg'}],
						}]}>
							<Animated.View style = {[{backgroundColor: interpolateColors,
							flex: 1,
							justifyContent: 'center',
							alignItems: 'center'}]}></Animated.View>
						
					</View>
						<Text style = {[{left: 50, top: -16, fontSize: 24, color: 'white', fontStyle:"italic"}]}>{queryText}</Text>
						</View>
					</TouchableOpacity>
					<Text style = {[{height: 300, width: 310, left: 20, color: "white", top: 20, fontSize: 18}]}>
						{daily_summary}
					</Text>
					</View>
					
				</View>
				<Animated.View style = {[{opacity: animation2}]}>
					<DraggableUpView category_ratio= {category_ratio}></DraggableUpView>
					</Animated.View>
				
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
	height800: {
		height: "800px"
	}
});
