import {useParams, useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {getUserByUsername} from '../services/firebase';
import * as ROUTES from '../constants/routes';
import Header from '../components/header';
import UserProfile from '../components/profile';


function Profile() {
    //Destructure username from ROUTES.PROFILE --> /p/:username
    const {username} = useParams();
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        async function checkUserExists() {
            const user = await getUserByUsername(username);
            if (user) {
                setUser(user);
            } else {
                navigate(ROUTES.NOT_FOUND);
            }
        }
    
        checkUserExists();
    }, [username, navigate]);
    
    
  return user ? (
    <div className='bg-gray-background'>
        <Header />
        <div className='mx-auto max-w-screen-lg'>
            <UserProfile username={username} />
        </div>
    </div>
  ) : null;
}

export default Profile