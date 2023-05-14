import {
	View,
	Text,
	StyleSheet,
	TextInput,
	Button,
	Platform,
	TouchableOpacity,
	Image,
} from "react-native";
import { useState, useRef } from "react";
import { getApp, initializeApp } from "firebase/app";
import {
	FirebaseRecaptchaVerifierModal,
	FirebaseRecaptchaBanner,
} from "expo-firebase-recaptcha";
import {
	getAuth,
	PhoneAuthProvider,
	signInWithCredential,
} from "firebase/auth";
import fbConfig from "../config/firebase";
import firebase from "firebase/app";
import { RouterProps } from "src/types";
import { useUser } from "@utils/hooks/useUser";
import logo from "../assets/images/GratiCatLogo.png";

// try { firebase.initializeApp(fbConfig.options);
// } catch (error) {
// 	console.log("Initializing error ", error);
// }

const app = getApp();
const auth = getAuth(app);
// if (!app?.options || Platform.OS === "web") {
// 	throw new Error(
// 		"This example only works on Android or iOS, and requires a valid Firebase config.",
// 	);
// }

export default function SignInScreen({ navigation }: RouterProps) {
	const { createUser } = useUser();
	const recaptchaVerifier = useRef(null);

	const [phoneNumber, setPhoneNumber] = useState("");
	const [verificationId, setVerificationID] = useState("");
	const [verificationCode, setVerificationCode] = useState("");

	const firebaseConfig = app ? app.options : undefined;
	const [info, setInfo] = useState("");
	const attemptInvisibleVerification = false;
	const handleSendVerificationCode = async () => {
		try {
			const phoneProvider = new PhoneAuthProvider(auth); // initialize the phone provider.
			const verificationId = await phoneProvider.verifyPhoneNumber(
				phoneNumber,
				// @ts-ignore
				recaptchaVerifier.current,
			); // get the verification id
			setVerificationID(verificationId); // set the verification id
			setInfo("Success : Verification code has been sent to your phone"); // If Ok, show message.
		} catch (error) {
			setInfo(`Error : ${error}`); // show the error
		}
	};
	const handleVerifyVerificationCode = async () => {
		try {
			const credential = PhoneAuthProvider.credential(
				verificationId,
				verificationCode,
			); // get the credential
			await signInWithCredential(auth, credential); // verify the credential
			setInfo("Success: Phone authentication successful"); // if OK, set the message

			// navigation.navigate("Home"); // navigate to the welcome screen
		} catch (error) {
			setInfo(`Error : ${error}`); // show the error.
		}
	};
	return (
		<View style={styles.container}>
			<Image source={logo} style={{width: 100, height: 100}} />
			<FirebaseRecaptchaVerifierModal
				ref={recaptchaVerifier}
				firebaseConfig={firebaseConfig}
			/>

			{info && <Text style={styles.text}>{info}</Text>}

			{
				// show the phone number input field when verification id is not set.
				!verificationId && (
					<View style={styles.container}>
						<Text style={styles.text}>Phone Number</Text>

						<TextInput
							placeholder="+2547000000"
							autoFocus
							autoComplete="tel"
							keyboardType="phone-pad"
							textContentType="telephoneNumber"
							onChangeText={(phoneNumber) =>
								setPhoneNumber(phoneNumber)
							}
						/>

						<TouchableOpacity
							style={styles.button}
							onPress={() => handleSendVerificationCode()}
							disabled={!phoneNumber}
						>
							<Text style={styles.text}>
								Send Verification Code
							</Text>
						</TouchableOpacity>
					</View>
				)
			}

			{
				// if verification id exists show the confirm code input field.
				verificationId && (
					<View>
						<Text style={styles.text}>
							Enter the verification code
						</Text>

						<TextInput
							editable={!!verificationId}
							placeholder="123456"
							onChangeText={setVerificationCode}
						/>

						<Button
							title="Confirm Verification Code"
							disabled={!verificationCode}
							onPress={() => handleVerifyVerificationCode()}
						/>
					</View>
				)
			}

			{attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
		</View>
	);
}

const styles = StyleSheet.create({
	text: {
		color: "#1D201F",
	},
	container: {
		flex: 1,
		backgroundColor: "#846C5B",
		alignItems: "center",
		justifyContent: "center",
	},
	button: {
		backgroundColor: '#E9637C',
		padding: 10,
		alignItems: 'center',
	  },
});
