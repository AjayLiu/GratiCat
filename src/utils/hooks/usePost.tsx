import { useEffect, useState } from "react";
import categorise_vector, {get_closest_category} from "./Vector";
import word_embeddings from "./word_embeddings.json";

import {} from "firebase/auth";
import { FirestoreUser, SelfPost, SocialPost } from "src/types";
import {
	getDoc,
	doc,
	setDoc,
	updateDoc,
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
		const embedding = await categorise_vector(content);
		const category = await get_closest_category(embedding, word_embeddings);

		const selfPost: SelfPost = {
			uid: uuidv4(),
			authorUid: fireUser?.uid,
			timestamp: Timestamp.now(),
			content: content,
			category: category,
		};

		// add self post to self posts collection
		await setDoc(doc(db, "selfPosts", selfPost.uid), selfPost);

		// add self post to user's list of self posts
		await updateDoc(doc(db, "users", fireUser.uid), {
			selfPostsUids: arrayUnion(selfPost.uid),
		});
		await fetchFireUser();
	};

	const calculateStreakCount = async () => {
		const posts = await getAllSelfPosts(fireUser?.uid || "");
		if (!posts || posts.length === 0) {
			return 0;
		}

		let streakEndDate = posts[posts.length - 1].timestamp.toDate();
		let i = posts.length - 1;
		while (i > 0) {
			const post = posts[i];
			const prevPost = posts[i - 1];
			const postDate = post.timestamp.toDate();
			const prevPostDate = prevPost.timestamp.toDate();
			const diff = postDate.getTime() - prevPostDate.getTime();
			const diffInDays = diff / (1000 * 3600 * 24);
			if (diffInDays > 1.5) {
				break;
			}
			streakEndDate = postDate;
			i--;
		}
		const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

		const currentTime = Date.now(); // Current time in milliseconds
		const timeDifference = currentTime - streakEndDate?.getTime(); // Difference in milliseconds

		// Calculate the difference in days
		const differenceDays = Math.round(timeDifference / oneDay);

		return differenceDays + 1;
	};

	return { getAllSelfPosts, makeSelfPost, calculateStreakCount };
}
