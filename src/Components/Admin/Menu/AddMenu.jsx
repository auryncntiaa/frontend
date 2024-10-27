import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddMenu() {
    const [addMenu, setAddMenu] = useState({
        nama_menu: '',
        jenis: '',
        deskripsi: '',
        harga: ''
    });
    const [selectedImage, setSelectedImage] = useState(null); // State for file
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddMenu((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setSelectedImage(e.target.files[0]); // Capture selected image file
    };

    const handleClick = async (event) => {
        event.preventDefault();
        setLoading(true);

        const token = sessionStorage.getItem("Token");

        // Create FormData to send text data and file together
        const formData = new FormData();
        formData.append('nama_menu', addMenu.nama_menu);
        formData.append('jenis', addMenu.jenis);
        formData.append('deskripsi', addMenu.deskripsi);
        formData.append('harga', addMenu.harga);
        if (selectedImage) {
            formData.append('gambar', selectedImage); 
        }

        try {
            const response = await axios.post("http://localhost:8080/menu", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data", // Important for file upload
                },
            });
            const data = response.data;
            if (data) {
                toast.success("Menu berhasil ditambahkan!");
                setAddMenu({ nama_menu: '', jenis: '', deskripsi: '', harga: '' });
                setSelectedImage(null); // Clear the file input
            } else {
                throw new Error("Data tidak ditemukan dari server");
            }
        } catch (error) {
            console.error("Add menu error:", error);
            toast.error("Terjadi kesalahan saat menambah menu. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="mt-8 mx-16">
                <div className="bg-white w-full relative overflow-x-auto shadow-md sm:rounded-lg">
                    <form onSubmit={handleClick}>
                        <div className="grid gap-6 mb-4 md:grid-cols-2 mt-8 mx-8">
                            <div>
                                <label htmlFor="nama" className="block mb-2 text-sm font-medium text-black">Nama Menu</label>
                                <input 
                                    required 
                                    type="text" 
                                    id="nama" 
                                    className="text-sm rounded-lg block w-full p-2.5 border border-gray-300 bg-gray-50 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500" 
                                    name="nama_menu" 
                                    onChange={handleChange} 
                                    value={addMenu.nama_menu} 
                                    autoComplete="off" 
                                />
                            </div>
                            <div>
                                <label htmlFor="harga" className="block mb-2 text-sm font-medium text-black">Harga</label>
                                <input 
                                    required 
                                    type="text" 
                                    onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                            event.preventDefault();
                                        }
                                    }} 
                                    id="harga" 
                                    className="text-sm rounded-lg block w-full p-2.5 border border-gray-300 bg-gray-50 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500" 
                                    name="harga" 
                                    onChange={handleChange} 
                                    value={addMenu.harga} 
                                    autoComplete="off" 
                                />
                            </div>
                        </div>
                        <div className="mx-8 mb-6">
                            <div className="mb-4">
                                <label htmlFor="jenis" className="block mb-2 text-sm font-medium text-black">Jenis</label>
                                <select 
                                    required 
                                    id="jenis" 
                                    className="text-sm rounded-lg block w-full p-2.5 border border-gray-300 bg-gray-50 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500" 
                                    name="jenis" 
                                    onChange={handleChange} 
                                    value={addMenu.jenis}
                                >
                                    <option value="">Jenis</option>
                                    <option value="makanan">Makanan</option>
                                    <option value="minuman">Minuman</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-medium text-black" htmlFor="file">Upload gambar</label>
                                <input 
                                    required 
                                    className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer text-gray-400 focus:outline-none bg-gray-50 placeholder-gray-400" 
                                    aria-describedby="user_avatar_help" 
                                    id="file" 
                                    type="file" 
                                    name="gambar" 
                                    accept="image/*" 
                                    onChange={handleFileChange} 
                                />
                            </div>
                            <div>
                                <label htmlFor="deskripsi" className="block mb-2 text-sm font-medium text-black">Deskripsi</label>
                                <textarea 
                                    required 
                                    name="deskripsi" 
                                    onChange={handleChange} 
                                    value={addMenu.deskripsi} 
                                    id="deskripsi" 
                                    rows="4" 
                                    className="block p-2.5 w-full text-sm text-black border border-gray-300 bg-gray-50 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                ></textarea>
                            </div>
                        </div>
                        <div className="flex justify-end mx-8 mb-6">
                            <button type="submit" className={`text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center bg-[#B30000] hover:bg-[#B30000] focus:ring-red-800 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}>
                                {loading ? "Loading..." : "Simpan"}
                            </button>
                            <ToastContainer
                                position="top-center"
                                autoClose={5000}
                                hideProgressBar={false}
                                newestOnTop={false}
                                closeOnClick
                                rtl={false}
                                pauseOnFocusLoss={false}
                                draggable={false}
                                pauseOnHover={false}
                                theme="light" 
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
