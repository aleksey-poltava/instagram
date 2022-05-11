import {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import "react-loading-skeleton/dist/skeleton.css";
import useUser from '../../hooks/use-user';
import {isUserFollowingProfile, followUser, unFollowUser} from '../../services/firebase';

function Header({
    photosCount, 
    profile: {
      docId: profileDocId,
      userId: profileUserId,
      fullName,
      followers=[],
      following=[],
      username: profileUsername
    },
    followerCount,
    setFollowerCount
  }) {
    const {user} = useUser();
    const [isFollowingProfile, setIsFollowingProfile] = useState(false);    
    const activeBtnFollow = user.username && user.username !== profileUsername;

    async function handleToggleFollow() {      
      setIsFollowingProfile((isFollowingProfile) => !isFollowingProfile);
      setFollowerCount({
        followerCount: isFollowingProfile ? followerCount - 1 : followerCount + 1
      });

      if (!isFollowingProfile) {
        await followUser(user?.userId, profileUserId, profileDocId);
      } else {        
        await unFollowUser(user?.userId, profileUserId, profileDocId);
      }
    }
    
    useEffect(() => {
      const isLoggedInUserFollowingProfile = async () => {
        const isFollowing = await isUserFollowingProfile(user.username, profileUserId);
        setIsFollowingProfile(isFollowing);
      }

      if (user?.username && profileUserId) {
        isLoggedInUserFollowingProfile();      
      }

    }, [user.username, profileUserId]);

  return (
    <div className='grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg'>
      <div className='container flex justify-center'>
        {user?.username && (<img
          className='rounded-full h-40 w-40 flex'
          alt={`${user?.username} profile picture`}
          src={`/images/avatars/${profileUsername}.jpg`}
        />)}
      </div>
      <div className='flex items-center justify-center flex-col col-span-2'>
        <div className='container flex items-center'>
          <p className='text-2xl mr-4'>{profileUsername}</p>
          {activeBtnFollow && (
            <button
              className='bg-blue-medium font-bold text-sm rounded text-white w-20 h-8'
              type='button'
              onClick={() => handleToggleFollow()}
            >
              {isFollowingProfile ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
        <div className='container flex mt-4'>
            {followers === undefined || following === undefined ? (
              <Skeleton count={1} width={677} height={24} />              
            ) : (
              <>
                <p className='mr-10'>
                  <span className='font-bold'>{photosCount}</span> photos
                </p>
                <p className='mr-10'>
                  <span className='font-bold'>{followerCount}</span>
                  {` `}
                  {followerCount === 1 ? `follower` : `followers`}
                </p>
                <p className='mr-10'>
                  <span className='font-bold'>{following.length}</span>
                </p>
              </>
            )}
        </div>
        <div className='container mt-4'>
              <p className='font-medium'>{!fullName ? <Skeleton count={1} height={24} /> : fullName}</p>
        </div>
      </div>
    </div>
  )
}

export default Header;

Header.propTypes={
  photosCount: PropTypes.number.isRequired,
  followerCount: PropTypes.number.isRequired,
  setFollowerCount: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    docId: PropTypes.string,
    userId: PropTypes.string,
    fullName: PropTypes.string,
    username: PropTypes.string,
    followers: PropTypes.array,
    following: PropTypes.array
  }).isRequired
}