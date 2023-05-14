import { NavigationProp } from "@react-navigation/native";
import { Timestamp } from "firebase/firestore";

export interface RouterProps {
	route?: any;
	navigation: NavigationProp<any>;
}

export interface FirestoreUser {
	uid: string;
	displayName: string;
	photoUrl: string;
	phoneNumber: string;
	selfPostsUids: string[];
	socialPostsUids: string[];
	friendsUids: string[];
}

export interface SelfPost {
	uid: string;
	authorUid: string;
	timestamp: Timestamp;
	content: string;
	category: string;
}

export interface SocialPost {
	uid: string;
	authorUid: string;
	recipientUid: string;
	timestamp: Timestamp;
	content: string;
}
