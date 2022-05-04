import useUser from '../../hooks/use-user';
import User from './user';
import Suggestions from './suggestions';

export default function Sidebar() {
    const {user} = useUser();
    console.log('user object: ', user);

    return (
        <div className='p-4'>
            <User userName={user.username} fullName={user.fullName} />
            <Suggestions userId={user.userId} />
        </div>
    );
}