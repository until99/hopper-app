import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { List, X, SignOut, User } from "@phosphor-icons/react";
import { useAuth } from "../../auth/context/AuthContext";
import { Button } from "../../../shared/components";

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

    const mobileNavLinkClass = (path: string) => `
        block px-4 py-3 rounded-lg text-base font-medium transition-colors
        ${isActive(path) 
            ? 'bg-primary-100 text-primary-700' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }
    `;

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo / Brand */}
                    <div className="flex items-center gap-4 sm:gap-8">
                        <Link to="/" className="flex items-center gap-2 shrink-0">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">H</span>
                            </div>
                            <span className="text-lg sm:text-xl font-bold text-gray-900">Hopper</span>
                        </Link>

                        {/* Desktop Navigation Links */}
                        <ul className="hidden lg:flex items-center gap-1">
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

                    {/* Desktop User Menu */}
                    <div className="hidden lg:flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm">
                            <User className="w-5 h-5 text-gray-400" />
                            <span className="font-medium text-gray-900">{user?.username}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={logout}>
                            <SignOut className="w-4 h-4 mr-1" />
                            Logout
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <List className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden border-t border-gray-200 bg-white">
                    <div className="px-4 py-4 space-y-1">
                        {/* User Info */}
                        <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-gray-50 rounded-lg">
                            <User className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                                <p className="text-xs text-gray-500">{user?.email}</p>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        {user?.role === 'admin' && (
                            <>
                                <Link 
                                    to="/dashboard" 
                                    className={mobileNavLinkClass('/dashboard')}
                                    onClick={closeMobileMenu}
                                >
                                    Dashboards
                                </Link>
                                <Link 
                                    to="/users" 
                                    className={mobileNavLinkClass('/users')}
                                    onClick={closeMobileMenu}
                                >
                                    Users
                                </Link>
                                <Link 
                                    to="/groups" 
                                    className={mobileNavLinkClass('/groups')}
                                    onClick={closeMobileMenu}
                                >
                                    Groups
                                </Link>
                                <Link 
                                    to="/pipelines" 
                                    className={mobileNavLinkClass('/pipelines')}
                                    onClick={closeMobileMenu}
                                >
                                    Pipelines
                                </Link>
                            </>
                        )}
                        <Link 
                            to="/workspaces" 
                            className={mobileNavLinkClass('/workspaces')}
                            onClick={closeMobileMenu}
                        >
                            Workspaces
                        </Link>

                        {/* Logout Button */}
                        <div className="pt-2 border-t border-gray-200 mt-2">
                            <button
                                onClick={() => {
                                    logout();
                                    closeMobileMenu();
                                }}
                                className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <SignOut className="w-5 h-5" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
