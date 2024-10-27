import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Meja() {
    const [meja, setMeja] = useState([]);
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [addMeja, setAddMeja] = useState({ nomor_meja: '', status: 'tersedia' });
    const [editMeja, setEditMeja] = useState({ id: '', nomor_meja: '', status: 'tersedia' });
    const [deleteId, setDeleteId] = useState(null);

    const token = sessionStorage.getItem("Token");

    useEffect(() => {
        fetchMeja();
    }, []);

    const fetchMeja = async () => {
        try {
            const response = await fetch('http://localhost:8080/meja', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error(await response.text());

            const data = await response.json();
            setMeja(data.meja || []);
        } catch (error) {
            console.error('Error fetching meja:', error);
            toast.error("Failed to fetch meja.");
        }
    };

    const postMeja = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/meja', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(addMeja),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Failed to add meja.");

            fetchMeja();
            setShowModalAdd(false);
            setAddMeja({ nomor_meja: '', status: 'tersedia' });
            toast.success("Meja added successfully.");
        } catch (error) {
            toast.error(error.message || "Failed to add meja.");
        }
    };

    const updateMeja = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/meja/${editMeja.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editMeja),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Failed to update meja.");

            fetchMeja();
            setShowModalEdit(false);
            toast.success("Meja updated successfully.");
        } catch (error) {
            toast.error(error.message || "Failed to update meja.");
        }
    };

    const deleteMeja = async () => {
        try {
            const response = await fetch(`http://localhost:8080/meja/${deleteId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error(await response.json());

            fetchMeja();
            setShowModalDelete(false);
            toast.success("Meja deleted successfully.");
        } catch (error) {
            toast.error(error.message || "Failed to delete meja.");
        }
    };

    const handleChange_Add = (e) => {
        setAddMeja({ ...addMeja, [e.target.name]: e.target.value });
    };

    const handleChange_Edit = (e) => {
        setEditMeja({ ...editMeja, [e.target.name]: e.target.value });
    };

    const selectDataEdit = (id_meja, nomor_meja, status) => {
        setEditMeja({ id: id_meja, nomor_meja, status });
        setShowModalEdit(true);
    };

    const selectIdDelete = (id_meja) => {
        setDeleteId(id_meja);
        setShowModalDelete(true);
    };

    return (
        <div className="bg-white min-h-screen p-8">
            <div className="my-8 mx-16">
                <button onClick={() => setShowModalAdd(true)} className="mb-4 bg-[#B30000] hover:bg-red-800 text-white rounded-lg px-5 py-2.5">
                    Tambahkan Meja
                </button>
                <div className="w-full overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-white bg-[#B30000]">
                            <tr>
                                <th className="px-6 py-3 text-center">Nomor Meja</th>
                                <th className="px-6 py-3 text-center">Status</th>
                                <th className="px-6 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {meja.map((m) => (
                                <tr key={m.id_meja} className="bg-white border-b hover:bg-gray-100">
                                    <td className="px-6 py-4 text-center">{m.nomor_meja}</td>
                                    <td className="px-6 py-4 text-center">{m.status}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => selectDataEdit(m.id_meja, m.nomor_meja, m.status)} className="text-blue-600 hover:underline">Edit</button>
                                        <button onClick={() => selectIdDelete(m.id_meja)} className="ml-4 text-red-600 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModalAdd && (
                <Modal>
                    <form onSubmit={postMeja}>
                        <input type="text" name="nomor_meja" value={addMeja.nomor_meja} onChange={handleChange_Add} placeholder="Nomor Meja" required className="border rounded-md w-full p-2" />
                        <select name="status" value={addMeja.status} onChange={handleChange_Add} className="mt-2 border rounded-md w-full p-2">
                            <option value="tersedia">Tersedia</option>
                            <option value="tidak tersedia">Tidak Tersedia</option>
                        </select>
                        <button type="submit" className="mt-4 bg-[#B30000] text-white rounded-lg px-4 py-2">Tambahkan</button>
                    </form>
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
