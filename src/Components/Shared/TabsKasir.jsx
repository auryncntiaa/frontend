import React from "react"; 
import classNames from 'classnames';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const TABS_LINK = [
    {
        key: 'pemesanan',
        label: 'Pemesanan',
        path: '/kasir/pemesanan',
        icon: (
            <svg
                aria-hidden="true"
                className="flex-shrink-0 w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M2 2a1 1 0 011-1h14a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V2zm2 1v3h12V3H4zm0 5v5h12V8H4zM2 15h16v2H2v-2z" />
            </svg>
        ),
    },
    {
        key: 'riwayat',
        label: 'Riwayat',
        path: '/kasir/riwayat',
        icon: (
            <svg
                aria-hidden="true"
                className="flex-shrink-0 w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M10 1a9 9 0 100 18 9 9 0 000-18zm0 2a7 7 0 110 14 7 7 0 010-14zm1 7V5h-2v5h5v-2h-3z" />
            </svg>
        ),
    },
];

export default function TabsKasir() {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/');
        window.location.reload();
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-[#B30000] text-white sticky top-0 h-screen">
                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-[#B30000]">
                    <h2 className="text-white text-center mb-4 text-lg font-bold">Wikusama Cafe</h2>
                    <ul className="space-y-2">
                        {TABS_LINK.map((item) => (
                            <li key={item.key}>
                                <Link
                                    to={item.path}
                                    className={classNames(
                                        'flex items-center p-2 text-base font-normal text-white rounded-lg transition duration-75',
                                        pathname === item.path
                                            ? 'bg-[#8B0000]' // Active tab color
                                            : 'hover:bg-[#700000]' // Hover effect for inactive tabs
                                    )}
                                >
                                    {item.icon}
                                    <span className="flex-1 ml-3 whitespace-nowrap">{item.label}</span>
                                </Link>
                            </li>
                        ))}
                        <li>
                            <button
                                onClick={handleLogout}
                                className="flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-[#700000] transition duration-75 w-full"
                            >
                                <svg
                                    aria-hidden="true"
                                    className="flex-shrink-0 w-6 h-6 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        clipRule="evenodd"
                                        fillRule="evenodd"
                                        d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                                    ></path>
                                </svg>
                                <span className="ml-3">Logout</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </aside>
        </div>
    );
}
