import PropTypes, { string } from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { followUser } from '../../services/firebase';

export default function SuggestedProfile({userDocId, username, profileId, userId}) {
    const [followed, setFollowed] = useState(false);

    async function handleFollowUser() {
        const r = await followUser(userId, profileId, userDocId)

        //remove from suggetsions
        if (r) {
            setFollowed(!followed);
        }
    }

    return !followed ? (
        <div className='flex flex-row items-center align-items justify-between'>
            <div className='flex items-center justify-between'>
                <img
                    className='rounded-full w-8 flex mr-3'
                    src={`/images/avatars/${username}.jpg`}
                    alt=''
                />
                <Link to={`/p/${username}`} >
                    <p className='font-bold text-sm'>{username}</p>
                </Link>
            </div>            
            <button 
                className='text-xs font-bold text-blue-medium'
                type='button'
                onClick={handleFollowUser}
            >
                Follow
            </button>
        </div>
    ) : (null);
}

SuggestedProfile.propTypes = {
    userDocId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    profileId: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired
}
