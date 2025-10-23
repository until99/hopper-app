import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Navbar() {

    const { user } = useAuth();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
    }

    return (
        <nav>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <p>{user?.username && `Hello, ${user.username}`}</p>
                <p>|</p>
                <button onClick={handleLogout}>Logout</button>
                <p>|</p>
                <ul style={{ display: "flex", gap: "1rem", listStyle: "none", padding: 0, alignItems: "center" }}>
                    {user?.role === 'admin' && (
                        <>
                            <li>
                                <Link to="/dashboard">Dashboards</Link>
                            </li>
                            <p>|</p>
                            <li>
                                <Link to="/users">Users</Link>
                            </li>
                            <p>|</p>
                            <li>
                                <Link to="/groups">Groups</Link>
                            </li>
                        </>
                    )}
                    <p>|</p>
                    <li>
                        <Link to="/workspaces">Workspaces</Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}
