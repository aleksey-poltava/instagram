import {useReducer, useEffect} from 'react';
import PropTypes from 'prop-types';
import Header from './header';
import Photos from './photos';
import { getUserByUsername, getUserPhotosByUserId } from '../../services/firebase';


export default function UserProfile({username}) {
    const reducer = (state, newState) => ({...state, ...newState});
    const initialState = {
        profile: {},
        photosCollection: [],
        followerCount: 0
    }

    const [{profile, photosCollection, followerCount}, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        async function getProfileInfoAndPhotos() {
            const user = await getUserByUsername(username);
            const photos = await getUserPhotosByUserId(user.userId);
            
            dispatch({profile: user, photosCollection: photos, followerCount: user.followers.length});
        }
        
        getProfileInfoAndPhotos();
    }, [username]);

    return (
        <>
            <Header 
                photosCount={photosCollection ? photosCollection.length : 0}
                profile={profile}
                followerCount={followerCount}
                setFollowerCount={dispatch}

            />
            <Photos photos={photosCollection} />
        </>
    );
}

UserProfile.propTypes = {
    username: PropTypes.string.isRequired
}