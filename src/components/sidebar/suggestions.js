import {useState, useEffect} from "react";
import PropTypes from 'prop-types';

export default function Suggestions({userId}) {
    const [profiles, setProfiles] = useState(null);


    return <p>Suggestions for you</p>;
}

Suggestions.propTypes = {
    userId: PropTypes.string.isRequired
}