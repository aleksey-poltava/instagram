import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {FirebaseContext} from '../context/firebase';

export default function Login() {
    const history = useNavigate();
    const {firebase} = useContext(FirebaseContext);

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPAssword] = useState('');

    return <p>I am a Login page</p>;
}