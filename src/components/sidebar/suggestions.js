import {useState, useEffect} from "react";
import PropTypes from 'prop-types';
import { getSuggestedProfiles } from "../../services/firebase";
import Skeleton from 'react-loading-skeleton';
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";

export default function Suggestions({userId}) {
    const [profiles, setProfiles] = useState(null);

    useEffect(() => {
        const getSuggestions = async (userId) => {
            const result = await getSuggestedProfiles(userId);
            if (result) {
                console.log('result', result);
                setProfiles(result);
            }
        }

        if (userId) {
            getSuggestions(userId).catch(console.error);
        }
    }, [userId]);
    return !profiles ? (
        <Skeleton count={1} height={150} className='mt-5' />
    ) : profiles.length > 0 ? (
        <>
            <p className="font-bold text-gray-base">Suggestions for you</p>
            {profiles.map((p) => (            
                <div key={p.userId} className='grid grid-cols-4 gap-2 mb-6 items-center justify-items-start' >
                    <div className="flex items-center justify-between col-span-2">
                        <img 
                            className='rounded-full w-10 block mx-auto'
                            // src={`/images/avatars/${profiles[0].userName}.jpg`}
                            src={`/images/avatars/${p.username}.jpg`}
                            alt=''
                        />
                        <p className="text-sm ml-2 font-bold">{p.username}</p>
                    </div>                    
                    <div className="text-sm">
                        <p className="text-blue-800">Follow</p>
                    </div>
                </div>            
            ))}            
        </>
    ) : (null);
}

Suggestions.propTypes = {
    userId: PropTypes.string
}