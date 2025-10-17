import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Navbar() {

    const { user } = useAuth();

    return (
        <nav>
            <p>{user?.username && `Hello, ${user.username}`}</p>
            <ul>
                {user?.role === 'admin' && (
                    <>
                        <li>
                            <Link to="/dashboard">Dashboards</Link>
                        </li>
                        <li>
                            <Link to="/users">Users</Link>
                        </li>
                    </>
                )}
                <li>
                    <Link to="/groups">Groups</Link>
                </li>
            </ul>
        </nav>
    )
}
