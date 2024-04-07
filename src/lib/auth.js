/* handle firebase authentication */

import {
	onAuthStateChanged,
	getAuth,
	signOut,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword
} from 'firebase/auth';
import firebaseApp from './firebaseConfig';
import { goto } from '$app/navigation';
import { createUserDocument } from '$lib/db.js';

const auth = getAuth(firebaseApp);

const checkUserLoggedIn = () => {
	return new Promise((resolve, reject) => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				// User is logged in
				resolve(user);
			} else {
				// No user is logged in
				resolve(null);
			}
		});
	});
};

const createUser = (email, name, password) => {
	createUserWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			const user = userCredential.user;
			createUserDocument(user.uid, name, email);
			goto('/');
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.log(errorCode, errorMessage);
		});
}

const loginUser = (email, password) => {
	signInWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			const user = userCredential.user;
			// console.log(user);
			goto('/');
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.log(errorCode, errorMessage);
		});
}

const logout = () => {
	signOut(auth).then(() => {
		goto("/");
	}).catch((error) => {
		console.log(error);
	});
}

export { checkUserLoggedIn, logout, createUser, loginUser };
