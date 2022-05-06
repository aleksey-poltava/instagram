import {useState, useEffect} from "react";
import PropTypes from 'prop-types';
import { getSuggestedProfiles } from "../../services/firebase";
import Skeleton from 'react-loading-skeleton';
import "react-loading-skeleton/dist/skeleton.css";
import SuggestedProfile from "./suggested-profile";

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
        <div className="rounded flex flex-col">
            <div className="text-sm flex items-center align-items justify-between mb-2">
                <p className="font-bold text-gray-base">Suggestions for you</p>
            </div>
            <div className="mt-4 grid gap-5">
                {profiles.map((p) => (
                    <SuggestedProfile
                        key={p.docId}
                        userDocId={p.docId}
                        username={p.username}
                        profileId={p.userId}
                        userId={userId}
                    />
                ))}
            </div>
        </div>
    ) : (null);
}

Suggestions.propTypes = {
    userId: PropTypes.string
}