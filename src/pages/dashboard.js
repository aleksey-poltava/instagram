import { useEffect } from "react";
import {Header} from '../components';
import {Timeline} from '../components';
import {Sidebar} from '../components';

export default function Dashboard() {
    useEffect(() => {
        document.title='Instagram';
    }, []);
    return(
        <div className="bg-gray-background">
            <Header />
            <div className="grid">
                <Timeline />
                <Sidebar />
            </div>
        </div>
    );
}