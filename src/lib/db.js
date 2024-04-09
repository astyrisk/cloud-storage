import { collection, doc, addDoc, setDoc, getDocs, getFirestore } from 'firebase/firestore/lite';
import { getAuth} from 'firebase/auth';
import { getApp } from 'firebase/app';

import { currentDirStore, currentElementsData } from '$lib/store.js';
import { get } from 'svelte/store';

const app = getApp();
const auth = getAuth();
const db = getFirestore(app);
const user = auth.currentUser;


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

async function getDirDocsData(dir) {
	const querySnapshot = await getDocs(dir);
	return (querySnapshot.docs.map(x => x.data()));
}

async function getDirDocs(dir) {
	const querySnapshot = await getDocs(dir);
	return querySnapshot.docs;
}

function newFile() {
}

function deleteFileOrFolder() {
}

function goForwardDir(dirName) {
    getDirDocs(get(currentDirStore)).then(x => x.forEach(doc => {
        if (doc.data().name === dirName && ! doc.data().isFile) {
            currentDirStore.set(collection(doc.ref, "folder"));
						getDirDocs(get(currentDirStore)).then(x => currentElementsData.set(x));
        }
    }));
}

async function goBackDir(dirCollection) {
	if  (get(currentDirStore).id !== "root") {
		currentDirStore.set(dirCollection.parent.parent);
		getDirDocsData(get(currentDirStore)).then(x => currentElementsData.set(x));
	}
}

function downloadFile() {
}

async function createUserDocument(uid, name, email) {
	const userDocRef = doc(db, 'Users', uid);

	await setDoc(userDocRef, {
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
export { getDirDocsData, getDirDocs, createUserDocument,  newFile, newFolder, deleteFileOrFolder,  goForwardDir, goBackDir, downloadFile };
