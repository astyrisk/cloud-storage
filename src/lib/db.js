import { collection, doc, addDoc, setDoc, getDocs, getFirestore } from 'firebase/firestore/lite';
import { getAuth} from 'firebase/auth';
import { getApp } from 'firebase/app';

import {rootStore} from '$lib/store.js';

const app = getApp();
const auth = getAuth();
const db = getFirestore(app);
const user = auth.currentUser;

// convert the following to stores!, use a new object to store the data, rather than the firebase returned ones
let userDocRef, root;
if (user) {
	userDocRef = doc(db, "Users", user.uid);
	root collection(userDocRef, "root");
}

//NOTE there are two collections in every user document, one collection for folders, another for files
//NOTE every folders collection consists of two collections: folders and files
/**
 * @param {string} uid
 * @param {any} name
 * @param {any} email
 */

async function newFolder(rootCollectionRef) {
    // TODO how to implement? prompt? popup?
	await addDoc(rootCollectionRef, {
		name: "randomFolder1",
		isFile: false,
		parent: "root",
		parentData: ""
	});
}

/**
 * @param {import("@firebase/firestore/lite").Query<any, import("@firebase/firestore/lite").DocumentData>} dir
 */
async function getDirDocs(dir) {
	const querySnapshot = await getDocs(dir);
	return (querySnapshot.docs.map(x => x.data()));
}

// getDirDocs(root).then(console.log)
function newFile() {
}

function deleteFileOrFolder() {
}

function goForwardDir() {
}

function goBackDir() {
}

function downloadFile() {
}

async function createUserDocument(uid, name, email) {
	const userDocRef = doc(db, 'Users', uid);

	await setDoc(userDocRef, {
		// TODO do we have to add uid?
		uid: uid,
		name: name,
		email: email,
	});

	const rootCollectionRef = collection(userDocRef, "root");
	// await addDoc(rootCollectionRef, {
	// 	name: "randomFile1.txt",
	// 	isFile:true,
	// 	type: "document",
	// 	size: "100KB",
	// });
	//
	await addDoc(rootCollectionRef, {
		name: "randomFolder1",
		isFile: false,
		parent: "root",
		parentData: ""
	});
}
export { createUserDocument,  newFile, newFolder, deleteFileOrFolder,  goForwardDir, goBackDir, downloadFile };
