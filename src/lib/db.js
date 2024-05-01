import { collection, doc, addDoc, setDoc, getDocs, getFirestore } from 'firebase/firestore';
import { getAuth} from 'firebase/auth';
import { getApp } from 'firebase/app';

import { currentPath, currentDir, currentElementsData } from '$lib/store.js';
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
    getDirDocs(get(currentDir)).then(x => x.forEach(doc => {
        if (doc.data().name === dirName && ! doc.data().isFile) {
            currentDir.set(collection(doc.ref, "folder"));
						currentPath.update((x) => [...x, doc]);
						updateData();
        }
    }));
}

function downloadFile() {
}

function updateData() {
	getDirDocsData(get(currentDir)).then(x => currentElementsData.set(x));
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
	});
}
export { updateData, getDirDocsData, getDirDocs, createUserDocument,  newFile, newFolder, deleteFileOrFolder,  goForwardDir, downloadFile };
