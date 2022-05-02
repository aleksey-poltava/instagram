import {firebase, FieldValue, db} from '../lib/firebase';
import { collection, query, where, getDocs } from "firebase/firestore";


export async function doesUserNameExist(userName) {
    const q = query(collection(db, "users"), where("username", "==", userName));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
    });

    return querySnapshot.docs.map((user) => user.data().length);
}