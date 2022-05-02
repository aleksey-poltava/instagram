import {db} from '../lib/firebase';
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";


export async function doesUserNameExist(userName) {
    const q = query(collection(db, "users"), where("username", "==", userName));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((user) => user.data()).length > 0;
}

export async function createNewUser(email, password) {
    const auth = getAuth();
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        return userCredential.user.email;
    } catch (error) {
        return error.message;
    }
}