import { createContext } from "react";
import { FirestoreUser } from "../types/index";

const FireUserContext = createContext({
	fireUser: {} as FirestoreUser,
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	setFireUser: (newVal: FirestoreUser) => {},
});

export default FireUserContext;
