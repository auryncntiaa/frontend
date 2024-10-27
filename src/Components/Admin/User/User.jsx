import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function User() {
    const navigate = useNavigate(); // Initialize useNavigate
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [pickId, setPickId] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch all users
    const fetchUser = async () => {
        const token = sessionStorage.getItem('Token');
        if (!token) {
            setError("Token tidak ditemukan, silakan login kembali.");
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/user', {
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
            console.log(data);
            setUsers(data.user || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error("Failed to fetch users.");
            setError("Failed to fetch users.");
            setLoading(false);
        }
    };

    // Effect to fetch users when the component mounts
    useEffect(() => {
        fetchUser();
    }, []);

    // Function to set the ID of the user to be deleted
    const selectId = (id) => {
        setPickId(id);
        setShowModal(true);
    };

    const handleDelete = (event) => {
        event.preventDefault();
        deleteId();
    };

    const deleteId = async () => {
        const token = sessionStorage.getItem('Token');
        if (!token) {
            setError("Token tidak ditemukan, silakan login kembali.");
            return;
        }

        try {
            const headers = {
                'Authorization': `Bearer ${token}`
            };

            console.log("Attempting to delete user with ID:", pickId);
            await axios.delete(`http://localhost:8080/user/${pickId}`, { headers });
            console.log("User deleted successfully");

            fetchUser(); // Refresh user list
            setShowModal(false);
            toast.success("User deleted successfully.");
        } catch (err) {
            console.error('Error deleting user:', err);
            setError(err.response ? err.response.data.message : "Error deleting user.");
            toast.error("Error deleting user.");
        }
    };

    return (
        <div className="bg-white min-h-screen p-8">
            <div className="my-8 mx-16">
                <button onClick={() => navigate('/admin/add_user')} className="mb-4 bg-[#B30000] hover:bg-red-800 text-white rounded-lg px-5 py-2.5">
                    Tambahkan User
                </button>
                <div className="w-full overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-white bg-[#B30000]">
                            <tr>
                                <th className="px-6 py-3 text-center">Nama User</th>
                                <th className="px-6 py-3 text-center">Username</th>
                                <th className="px-6 py-3 text-center">Role</th>
                                <th className="px-6 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-4">Loading...</td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-4 text-red-500">{error}</td>
                                </tr>
                            ) : users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id_user} className="bg-white border-b hover:bg-gray-100">
                                        <td className="px-6 py-4 text-center">{user.nama_user}</td>
                                        <td className="px-6 py-4 text-center">{user.username}</td>
                                        <td className="px-6 py-4 text-center">{user.role}</td>
                                        <td className="px-6 py-4 text-right">
                                            <a href={`edit_user/${user.id_user}`} className="text-blue-600 hover:underline">Edit</a>
                                            <button onClick={() => selectId(user.id_user)} className="ml-4 text-red-600 hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-4">Tidak ada data pengguna.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showModal && (
                <Modal>
                    <h3 className="mb-5 text-lg font-normal text-black">Apakah Anda yakin ingin menghapus pengguna ini?</h3>
                    <button onClick={deleteId} type="button" className="bg-[#B30000] text-white rounded-lg px-4 py-2">Ya, hapus</button>
                    <button onClick={() => setShowModal(false)} type="button" className="ml-4 bg-gray-200 text-gray-500 rounded-lg px-4 py-2">Tidak</button>
                </Modal>
            )}

            <ToastContainer />
        </div>
    );
}

const Modal = ({ children }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg">{children}</div>
    </div>
);
