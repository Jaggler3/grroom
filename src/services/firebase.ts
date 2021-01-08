import firebase from 'firebase'

const config = {
	apiKey: "AIzaSyCGhl0YmZAFC8IolBkxFGViZh0-pSkwnkA",
	authDomain: "grroom-dc.firebaseapp.com",
	projectId: "grroom-dc",
	appId: "1:723782589009:web:f391b2e2eb931f56603670"
};
const _firebase = firebase.initializeApp(config);

const firestore = firebase.firestore(_firebase)
const auth = firebase.auth(_firebase);
const db = firebase.database(_firebase)

firestore.enablePersistence()

export const FirebaseApp = {
	signUp: (email: string, password: string) => auth.createUserWithEmailAndPassword(email, password),
	signIn: (email: string, password: string) => auth.signInWithEmailAndPassword(email, password),
	getUser: () => auth.currentUser,
	isSignedIn: () => FirebaseApp.getUser() !== null,
	signOut: async () => await auth.signOut(),
	getServiceStatus: async () => (await firestore.collection("info").doc("public").get()).data(),
	emailErrorCodes: [
		"auth/email-already-in-use",
		"auth/invalid-email"
	],
	passwordErrorCodes: [
		"auth/invalid-password",
		"auth/wrong-password"
	]
}