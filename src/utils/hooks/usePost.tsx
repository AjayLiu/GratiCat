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
import { useUser } from "./useUser";

export function usePost() {
	const { fireUser, fetchFireUser, getUserFromFirestore } = useUser();

	const getAllSelfPosts = async (uid: string) => {
		// first get user's list of self posts' uids
		const fetchedUser = await getUserFromFirestore(uid);
		if (fetchedUser == -1) {
			console.log("No user found.");
			return;
		}

		if (!fetchedUser.selfPostsUids) {
			console.log("No self posts found.");
			return [];
		}

		// then get the self posts from the list of uids
		const selfPosts: SelfPost[] = [];
		for (const uid of fetchedUser.selfPostsUids) {
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
		await setDoc(doc(db, "selfPosts", selfPost.uid), selfPost);

		// add self post to user's list of self posts
		await updateDoc(doc(db, "users", fireUser.uid), {
			selfPostsUids: arrayUnion(selfPost.uid),
		});
		await fetchFireUser();
	};
	return { getAllSelfPosts, makeSelfPost };
}
