import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";
import { Button } from "../../../shared/components";

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    const navLinkClass = (path: string) => `
        px-3 py-2 rounded-lg text-sm font-medium transition-colors
        ${isActive(path) 
            ? 'bg-primary-100 text-primary-700' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }
    `;

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo / Brand */}
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">H</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">Hopper</span>
                        </Link>

                        {/* Navigation Links */}
                        <ul className="hidden md:flex items-center gap-1">
                            {user?.role === 'admin' && (
                                <>
                                    <li>
                                        <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                                            Dashboards
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/users" className={navLinkClass('/users')}>
                                            Users
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/groups" className={navLinkClass('/groups')}>
                                            Groups
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/pipelines" className={navLinkClass('/pipelines')}>
                                            Pipelines
                                        </Link>
                                    </li>
                                </>
                            )}
                            <li>
                                <Link to="/workspaces" className={navLinkClass('/workspaces')}>
                                    Workspaces
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 text-sm">
                            <span className="text-gray-500">Hello,</span>
                            <span className="font-medium text-gray-900">{user?.username}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={logout}>
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
