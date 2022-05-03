import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FirebaseContext from '../context/firebase';
import * as ROUTES from '../constants/routes';
import {doesUserNameExist, createNewUser, addUserToDb} from '../services/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function SignUp() {
    const navigate = useNavigate();
    const {firebase} = useContext(FirebaseContext);

    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const isInvalid = password === '' || emailAddress === '';

    const resetInputFields = () => {
        setUsername('');
        setFullName('');
        setEmailAddress('');
        setPassword('');
    }

    const handleSignup = async (event) => {
        event.preventDefault();

        try {
            const isUserNameExists = await doesUserNameExist(username);
            if (isUserNameExists) {
                resetInputFields();
                setError('Such user name already exists.');
            } else {
                const userUid = await createNewUser(emailAddress, password);
                console.log('user Uid: ', userUid);

                //TODO Create new document with user data
                const result = await addUserToDb(emailAddress, fullName, userUid, username);
                if (result) {
                    setError('Something went wrong. Try again later.');
                    resetInputFields();
                } else {
                    navigate(ROUTES.DASHBOARD);
                }
            }
        } catch (error) {
            resetInputFields();
            setError(error.message);
            console.log(error);
        }
    };

    return (
        <div className='container flex mx-auto max-w-screen-md items-center h-screen'>
            <div className='flex w-3/5'>
                <img src='/images/iphone-with-profile.jpg' alt='phone with Ins' />
            </div>
            <div className='flex flex-col w-2/5'>
                <div className='flex flex-col items-center bg-white p-4 border border-gray-primary mb-4 rounded'>
                    <h1 className='flex justify-center w-full'>
                        <img src='/images/logo.png' alt='Instagram' className='mt-2 w-6/12 mb-4' />
                    </h1>
                    
                    {error && <p className='mb-4 text-xs text-red-primary'>{error}</p>}

                    <form onSubmit={handleSignup} method='POST'>
                        <input 
                            aria-label='Enter your username'
                            type='text'
                            placeholder='Username'
                            className='text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2'
                            onChange={({target}) => setUsername(target.value)}
                            value={username}
                        />
                        <input 
                            aria-label='Enter your full name'
                            type='text'
                            placeholder='Full Name'
                            className='text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2'
                            onChange={({target}) => setFullName(target.value)}
                            value={fullName}
                        />
                        <input 
                            aria-label='Enter your email address'
                            type='text'
                            placeholder='Email address'
                            className='text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2'
                            onChange={({target}) => setEmailAddress(target.value)}
                            value={emailAddress}
                        />
                        <input 
                            aria-label='Enter your password'
                            type='password'
                            placeholder='Password'
                            className='text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2'
                            onChange={({target}) => setPassword(target.value)}
                            value={password}
                        />

                        <button
                            disabled={isInvalid}
                            type='submit'
                            className={`bg-blue-medium text-white w-full rounded h-8 font-bold
                            ${isInvalid && 'opacity-50'}`}
                        >
                            Sign Up
                        </button>
                    </form>
                </div>
                <div className='flex justify-center items-center flex-col w-full bg-white p-4 border border-gray-primary rounded'>
                    <p className='text=sm'>
                        Already have an account?{``}
                        <Link to={ROUTES.LOGIN} className='font-bold text-blue-medium'>
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}