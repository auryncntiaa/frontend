import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // Import toast for notifications
import 'react-toastify/dist/ReactToastify.css';

export default function Menu() {
    const [menu, setMenu] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [pickId, setPickId] = useState("");
    const [error, setError] = useState(""); // For error messages
    const [loading, setLoading] = useState(true); // Loading state

    // Function to fetch menu items
    const fetchMenu = async () => {
        const token = sessionStorage.getItem('Token'); // Get token from session storage
        if (!token) {
            setError("Token tidak ditemukan, silakan login kembali.");
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/menu', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Network response was not ok: ${errorText}`);
            }

            const data = await response.json();
            setMenu(data.menu || []); // Update to setMenu
        } catch (error) {
            console.error('Error fetching menu:', error);
            toast.error("Failed to fetch menu."); // Use toast for error notification
            setError("Failed to fetch menu.");
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    // Function to open delete confirmation modal
    const selectId = (id) => {
        setPickId(id);
        setShowModal(true);
    };

    // Function to delete menu item
    const deleteId = async () => {
        const token = sessionStorage.getItem('Token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            // Make the DELETE request to the backend
            const response = await axios.delete(`http://localhost:8080/menu/${pickId}`, { headers });

            // Check if the response status is successful
            if (response.status === 200) {
                toast.success("Menu item deleted successfully.");
                // Update the menu state to remove the deleted item
                setMenu(prevMenu => prevMenu.filter(item => item.id_menu !== pickId));
                setShowModal(false); // Close modal after deletion
            } else {
                toast.error("Failed to delete menu item."); // Handle unsuccessful response
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete menu item."); // Use toast for error notification
        }
    };

    // Render loading state or menu items
    if (loading) return <div>Loading...</div>;

    return (
        <div className="bg-white min-h-screen p-8">
            <div className="my-8 mx-16">
                <a href="add_menu">
                    <button type="button" className="mb-4 bg-[#B30000] hover:bg-red-800 text-white rounded-lg px-5 py-2.5">
                        Tambahkan Menu
                    </button>
                </a>
                <div className="flex flex-wrap gap-5">
                    <div className="w-full relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="table-fixed w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-white bg-[#B30000]">
                                <tr>
                                    <th className="px-6 py-3 text-center">Gambar</th>
                                    <th className="px-6 py-3 text-center">Nama Menu</th>
                                    <th className="px-6 py-3 text-center">Jenis</th>
                                    <th className="px-6 py-3 text-center">Harga</th>
                                    <th className="px-6 py-3 text-center">Deskripsi</th>
                                    <th className="px-6 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {menu.map(item => (
                                    <tr key={item.id_menu} className="bg-white border-b hover:bg-gray-50">
                                        <td>
                                            <img className="h-auto max-w-[100 %]" src={`http://localhost:8080/gambar/menu/${item.gambar}`} alt={item.nama_menu} />
                                        </td>
                                        <td className="px-6 py-4 text-center">{item.nama_menu}</td>
                                        <td className="px-6 py-4 text-center ">{item.jenis}</td>
                                        <td className="px-6 py-4 text-center">{item.harga}</td>
                                        <td className="px-6 py-4 text-left w-49">{item.deskripsi}</td>
                                        <td className="pl-6 py-4 text-right">
                                            <a href={`edit_menu/${item.id_menu}`} className="font-medium text-blue-600 hover:underline">Edit</a>
                                            <button onClick={() => selectId(item.id_menu)} className="mx-4 font-medium text-red-600 hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* modal delete */}
                {showModal ? (
                    <div>
                        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                            <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                    <div className="relative rounded-lg shadow bg-gray-700">
                                        <button onClick={() => setShowModal(false)} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-800 hover:text-white" data-modal-hide="popup-modal">
                                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                            </svg>
                                            <span className="sr-only">Close modal</span>
                                        </button>
                                        <div className="p-6 text-center">
                                            <svg aria-hidden="true" className="mx-auto mb-4 w-14 h-14 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                            <h3 className="mb-5 text-lg font-normal text-gray-400">Apakah anda yakin ingin menghapus menu ini?</h3>
                                            <button onClick={deleteId} data-modal-hide="popup-modal" type="button" className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Hapus</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="opacity-30 fixed inset-0 z-40 bg-black"></div>
                    </div>
                ) : null}
            </div>
            <ToastContainer />
        </div>
    );
}
