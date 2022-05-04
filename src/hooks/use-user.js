import {useState, useEffect, useContext} from 'react';
import { act } from 'react-dom/test-utils';
import UserContext from '../context/user';
import { getUserByUserId } from '../services/firebase';

export default function useUser() {
    const [activeUser, setActiveUser] = useState({});
    const {user} = useContext(UserContext);

    useEffect(() => {
        async function getUserObjByUserId() {
            const response = await getUserByUserId(user.uid);
            if (response) {
                setActiveUser(response);
            }
        }

        if (user?.uid) {
            getUserObjByUserId(user.uid);
        }
    }, [user]);

    return {user: activeUser};
}