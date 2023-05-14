import { useEffect, useState } from "react";

import {
	deleteUser,
	getAuth,
	onAuthStateChanged,
	signOut,
	User,
} from "firebase/auth";
import { FirestoreUser } from "src/types";
import { getDoc, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@config/firebase";

const auth = getAuth();

export function useUser() {
	const [authUser, setAuthUser] = useState<User>();
	const [fireUser, setFireUser] = useState<FirestoreUser>();

	// Auth changes
	useEffect(() => {
		const unsubscribeFromAuthStatusChanged = onAuthStateChanged(
			auth,
			(user) => {
				if (user) {
					// User is signed in, see docs for a list of available properties
					// https://firebase.google.com/docs/reference/js/firebase.User
					setAuthUser(user);
				} else {
					// User is signed out
					setAuthUser(undefined);
				}
			},
		);

		return unsubscribeFromAuthStatusChanged;
	}, []);

	const isSignedIn = authUser !== undefined;
	const createUser = async () => {
		// Some default user values
		const defaultProfilePic =
			"https://img.freepik.com/free-icon/user_318-864557.jpg?w=2000";

		const defaultDisplayName = "User";

		await writeToUserFirestore({
			uid: authUser?.uid || "ERROR",
			displayName: defaultDisplayName,
			photoUrl: defaultProfilePic,
			friendsUids: [],
			selfPostsUids: [],
			socialPostsUids: [],
			phoneNumber: authUser?.phoneNumber || "ERROR",
		});
		console.log("User created successfully.");
	};

	const writeToUserFirestore = async (user: FirestoreUser) => {
		try {
			console.log(user);
			const docRef = await setDoc(doc(db, "users", user.uid), user);
			console.log("User written: ", docRef);
		} catch (e) {
			console.error("Error writing user: ", e);
		}
	};

	const updateUserFirestore = async (userUid: string, data: any) => {
		try {
			const docRef = await updateDoc(doc(db, "users", userUid), data);
			console.log("User updated: ", docRef);
		} catch (e) {
			console.error("Error updating user: ", e);
		}
	};

	const getUserFromFirestore = async (uid: string) => {
		const docSnap = await getDoc(doc(db, "users", uid));
		if (docSnap.exists()) {
			// console.log("User data:", docSnap.data());
		} else {
			// doc.data() will be undefined in this case
			console.log("Can't find user data!");
			return -1;
		}

		return docSnap.data() as FirestoreUser;
	};

	const fetchFireUser = async () => {
		if (authUser) {
			const user = await getUserFromFirestore(authUser.uid);
			if (user != -1) setFireUser(user);
		}
	};
	useEffect(() => {
		fetchFireUser();
	}, [authUser]);

	const deleteUserFromFirestore = async (uid: string) => {
		try {
			const deleteUserRef = await deleteDoc(doc(db, "users", uid));
			console.log("User deleted: ", deleteUserRef);

			signOut(auth);
		} catch (e) {
			console.error("Error deleting user: ", e);
		}

		// Delete user's account (has to be logged in recently)
		// TODO: ASK USER TO SIGN IN AGAIN
		if (authUser) deleteUser(authUser);
	};

	return {
		authUser,
		isSignedIn,
		createUser,
		writeToUserFirestore,
		getUserFromFirestore,
		updateUserFirestore,
		deleteUserFromFirestore,
		fireUser,
		fetchFireUser,
	};
}
