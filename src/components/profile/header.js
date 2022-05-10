import {useState, useEffect} from 'react';
import {PropTypes} from 'prop-types';
import {Skeleton} from 'react-loading-skeleton';
import "react-loading-skeleton/dist/skeleton.css";

function Header() {
    const [isFollowingProfile, setIsFollowingProfile] = useState(false);
    

  return (
    <div>Header</div>
  )
}

export default Header;