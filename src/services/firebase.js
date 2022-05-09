import {db} from '../lib/firebase';
import { collection, query, where, getDocs, setDoc, doc, updateDoc, arrayUnion, arrayRemove} from "firebase/firestore";
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

export async function getUserIdThoseIFollow(userId) {
    const qWithFollower = query(collection(db, "users"), where("followers", "array-contains", userId));
    const querySnapshotFollower = await getDocs(qWithFollower);
    if (!querySnapshotFollower) {
        return null;
    }

    const usersFollower = querySnapshotFollower.docs.map((user) => (        
        user.data().userId
    ));

    return usersFollower;
}

export async function getSuggestedProfiles(userId) {
    const qAllrecords = query(collection(db, "users"), where("userId", "!=", userId));
    const querySnapshotAll = await getDocs(qAllrecords);
    const usersAll = querySnapshotAll.docs.map((user) => (        
        user.data().userId
    ));

    const iFollow = await getUserIdThoseIFollow(userId);
    const difference = usersAll.filter(x => !iFollow.includes(x));

    console.log('usersAll: ', usersAll);
    console.log('iFollow: ', iFollow);
    console.log('userId: ', userId);
    console.log('difference: ', difference);
    const qSuggestions = query(collection(db, "users"), where('userId', "in", difference));
    const querySnapshotSuggetions = await getDocs(qSuggestions);
    const suggestions = querySnapshotSuggetions.docs.map((user) => ({
        ...user.data(),
        docId: user.id
    }));

    return suggestions;  
    //https://firebase.google.com/docs/firestore/query-data/queries#array_membership    
}

export async function followUser(myUserId, followUserId, followUserDocId) {
    //https://firebase.google.com/docs/firestore/manage-data/add-data#update_elements_in_an_array

    try {
        const userRef = doc(db, 'users', followUserDocId);
        const followRes = await updateDoc(userRef, {
            followers: arrayUnion(myUserId)
        });

        const usersDocId = (await getUserByUserId(myUserId))?.docId;
        const myUserRef = doc(db, 'users', usersDocId);
        const followingRes = await updateDoc(myUserRef, {
            following: arrayUnion(followUserId)
        });

        return true;

    } catch (error) {
        console.log('error in firebase followUser: ', error);
        return false;
    }

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

export async function getPhotos(userId, following) {
    const q = query(collection(db, "photos"), where("userId", "in", following));
    const querySnapshot = await getDocs(q);

    const userFollowedPhotos = querySnapshot.docs.map((photo) => ({
        ...photo.data(),
        docId: photo.id
    }));

    const photosWithUserDetails = await Promise.all(
        userFollowedPhotos.map(async (photo) => {
            let userLikedPhoto = false;
            if (photo.likes.includes(userId)) {
                userLikedPhoto = true;
            }

            const user = await getUserByUserId(photo.userId);
            const {username} = user;

            return {username, ...photo, userLikedPhoto};
        })
    );

    return photosWithUserDetails;
}

export async function updateLikes(docId, userId, isLiked) {
    try {
        const userRef = doc(db, 'photos', docId);
        if (isLiked) {
            await updateDoc(userRef, {
                likes: arrayUnion(userId)
            });
        }
        else {
            await updateDoc(userRef, {
                likes: arrayRemove(userId)
            });
        }

        return true;

    } catch (error) {
        console.log('error in firebase updateLikes: ', error);
        return false;
    }
}

export async function updateComments(docId, displayName, comment) {
    try {
        const userRef = doc(db, 'photos', docId);
        await updateDoc(userRef, {
            comments: arrayUnion({displayName, comment})
        });

        return true;

    } catch (error) {
        console.log('error in firebase updateComments: ', error);
        return false;
    }
}