import {db} from '../lib/firebase';
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { func } from 'prop-types';

export async function doesUserNameExist(userName) {
    const q = query(collection(db, "users"), where("username", "==", userName));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((user) => user.data()).length > 0;
}

export async function createNewUser(email, password) {
    const auth = getAuth();
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
       
        return userCredential.user.uid;
    } catch (error) {
        return error.message;
    }
}

export async function getUserNameByUserId(userId) {
    const q = query(collection(db, "users"), where("userId", "==", userId));

    const querySnapshot = await getDocs(q);

    const users = querySnapshot.docs.map((user) => user.data().username);
    return users.length > 0 ?
        (users[0]) :
        (null);
}

export async function getSuggestedProfiles(userId) {
    const qAllrecords = query(collection(db, "users"), where("userId", "!=", userId));
    const querySnapshotAll = await getDocs(qAllrecords);
    const usersAll = querySnapshotAll.docs.map((user) => ({
        ...user.data(),
        docId: user.id
    }));

    const qWithFollower = query(collection(db, "users"), where("regions", "array-contains", userId));
    const querySnapshotFollower = await getDocs(qWithFollower);
    const usersFollower = querySnapshotFollower.docs.map((user) => ({
        ...user.data(),
        docId: user.id
    }));

    usersAll.forEach(a => {
        usersFollower.forEach(f => {
            if (a.docId != f.docId) {
                //add to result array
            }
        })
    })

    //Get all records that contains in followers userId
    //Get all records exept userId == userId
    //Return from all records only those that doesn't have in followers userId
    //https://firebase.google.com/docs/firestore/query-data/queries#array_membership    
}

export async function getUserByUserId(userId) {
    const q = query(collection(db, "users"), where("userId", "==", userId));

    const querySnapshot = await getDocs(q);

    const users = querySnapshot.docs.map((user) => ({
        ...user.data(),
        docId: user.id
    }));
    return users.length > 0 ?
        (users[0]) :
        (null);
}

export async function addUserToDb(emailAddress, fullName, userId, username) {
    try {
        const usersRef = collection(db, "users");
        await setDoc(doc(usersRef), {
            userId: userId,
            username: username.toLowerCase(),
            fullName: fullName,
            emailAddress: emailAddress.toLowerCase(),
            following: [],
            followers: [],
            dateCreated: Date.now()
        });

        return false;
    } catch (error) {
        console.log('error in addUserToDB: ', error);
        return true;
    }
}