import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth"

const _firebase = initializeApp({
	apiKey: "AIzaSyCGhl0YmZAFC8IolBkxFGViZh0-pSkwnkA",
	authDomain: "grroom-dc.firebaseapp.com",
	projectId: "grroom-dc",
	appId: "1:723782589009:web:f391b2e2eb931f56603670",
});

const firestore = getFirestore(_firebase)
const auth = getAuth(_firebase);

export const FirebaseApp = {
	signUp: (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password),
	signIn: (email: string, password: string) => signInWithEmailAndPassword(auth, email, password),
	getUser: () => auth.currentUser,
	isSignedIn: () => FirebaseApp.getUser() !== null,
	signOut: async () => await auth.signOut(),
	getServiceStatus: async () => (await getDoc(doc(firestore, "info", "public"))).data(),
	sendPasswordEmail: async () => {
		sendPasswordResetEmail(auth, auth.currentUser?.email || "").catch(console.error)
	},
	emailErrorCodes: [
		"auth/email-already-in-use",
		"auth/invalid-email"
	],
	passwordErrorCodes: [
		"auth/invalid-password",
		"auth/wrong-password"
	]
}