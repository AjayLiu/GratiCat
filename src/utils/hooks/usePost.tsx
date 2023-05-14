import { useEffect, useState } from "react";

import {
	deleteUser,
	getAuth,
	onAuthStateChanged,
	signOut,
	User,
} from "firebase/auth";
import { FirestoreUser, SelfPost, SocialPost } from "src/types";
import {
	getDoc,
	doc,
	setDoc,
	updateDoc,
	deleteDoc,
	getDocs,
	Timestamp,
	arrayUnion,
} from "firebase/firestore";
import { db } from "@config/firebase";
import { uuidv4 } from "@firebase/util";
const auth = getAuth();
import { useUser } from "./useUser";
import { useLinkBuilder } from "@react-navigation/native";

export function usePost() {
	const { fireUser, fetchFireUser, authUser } = useUser();

	const getMySelfPosts = async () => {
		// first get user's list of self posts' uids
		await fetchFireUser();
		const listOfSelfPostUids = fireUser?.selfPostsUids;
		if (!listOfSelfPostUids) return [];

		// then get the self posts from the list of uids
		const selfPosts: SelfPost[] = [];
		for (const uid of listOfSelfPostUids) {
			const snapshot = await getDoc(doc(db, "selfPosts", uid));
			const thisPost = snapshot.data() as SelfPost;
			selfPosts.push(thisPost);
		}

		return selfPosts;
	};

	const makeSelfPost = async (content: string) => {
		await fetchFireUser();
		if (!fireUser) return;

		const selfPost: SelfPost = {
			uid: uuidv4(),
			authorUid: fireUser?.uid,
			timestamp: Timestamp.now(),
			content: content,
		};

		// add self post to self posts collection
		setDoc(doc(db, "selfPosts", selfPost.uid), selfPost);

		// add self post to user's list of self posts
		updateDoc(doc(db, "users", fireUser.uid), {
			selfPostsUids: arrayUnion(selfPost.uid),
		});
	};
	return { getMySelfPosts, makeSelfPost };
}
