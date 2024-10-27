import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditMenu() {
    const headers = {
        'Authorization': `Bearer ${sessionStorage.getItem('Token')}`
    };
    const navigate = useNavigate();
    const location = useLocation();

    // Get menu ID from pathname
    const idMenu = location.pathname.split("/")[3];

    const [checkMenu, setCheckMenu] = useState([]);
    const [selectImage, setSelectImage] = useState(null);
    const [prevData, setPrevData] = useState({
        nama_menu: "",
        jenis: "",
        deskripsi: "",
        harga: ""
    });
    const [lastMenuName, setLastMenuName] = useState("");

    // Fetch menu for verification
    useEffect(() => {
        const getMenu = async () => {
            try {
                const response = await axios.get("http://localhost:8080/menu/", { headers });
                const nama = response.data.menu.map(res => res.nama_menu);
                setCheckMenu(nama);
            } catch (err) {
                console.log(err);
                toast.error("Failed to fetch menu data");
            }
        };

        const getDataFromId = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/menu/${idMenu}`, { headers });
                setPrevData(res.data.menu);
                setLastMenuName(res.data.menu.nama_menu);
            } catch (err) {
                console.log(err);
                toast.error("Failed to fetch menu details");
            }
        };

        getDataFromId();
        getMenu();
    }, [idMenu]);

    const handleChange = (e) => {
        setPrevData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileChange = (e) => {
        setSelectImage(e.target.files[0]);
    };

    const handleClick = async (e) => {
        e.preventDefault();
        if (!idMenu) {
            console.log("ID Menu tidak ditemukan.");
            return;
        }

        // Continue the submit process if idMenu is valid
        try {
            let data = new FormData();
            data.append('nama_menu', prevData.nama_menu);
            data.append('jenis', prevData.jenis);
            data.append('deskripsi', prevData.deskripsi);
            data.append('gambar', selectImage);
            data.append('harga', prevData.harga);

            await axios.put(`http://localhost:8080/menu/${idMenu}`, data, { headers });
            navigate("/admin/menu");
        } catch (err) {
            console.log(err);
            toast.error("Terjadi kesalahan saat memperbarui menu");
        }
    };

    const kembali = () => {
        navigate("/admin/menu");
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
                                    value={prevData.nama_menu || ""}
                                    required
                                    type="text"
                                    id="nama"
                                    className="text-sm rounded-lg block w-full p-2.5 border border-gray-400 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500"
                                    name="nama_menu"
                                    onChange={handleChange}
                                    autoComplete="off"
                                />
                            </div>
                            <div>
                                <label htmlFor="harga" className="block mb-2 text-sm font-medium text-black">Harga</label>
                                <input
                                    value={prevData.harga || ""}
                                    required
                                    type="text"
                                    onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                            event.preventDefault();
                                        }
                                    }}
                                    id="harga"
                                    className="text-sm rounded-lg block w-full p-2.5 border border-gray-400 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500"
                                    name="harga"
                                    onChange={handleChange}
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                        <div className="mx-8 mb-6">
                            <div className="mb-4">
                                <label htmlFor="jenis" className="block mb-2 text-sm font-medium text-black">Jenis</label>
                                <select
                                    value={prevData.jenis || ""}
                                    required
                                    id="jenis"
                                    className="text-sm rounded-lg block w-full p-2.5 border border-gray-400 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500"
                                    name="jenis"
                                    onChange={handleChange}
                                >
                                    <option value="">Jenis</option>
                                    <option value="makanan">Makanan</option>
                                    <option value="minuman">Minuman</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-medium text-black" htmlFor="file">Upload gambar</label>
                                <input
                                    className="block w-full text-sm border border-gray-400 rounded-lg cursor-pointer text-gray-400 focus:outline-none bg-white placeholder-gray-400"
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
                                    value={prevData.deskripsi || ""}
                                    required
                                    name="deskripsi"
                                    onChange={handleChange}
                                    id="deskripsi"
                                    rows="4"
                                    className="block p-2.5 w-full text-sm text-black bg-white border border-gray-400 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mx-8 mb-6">
                            <button onClick={kembali} className="mr-2 text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center bg-red-600 hover:bg-red-700 focus:ring-red-800">Batal</button>
                            <button type="submit" className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800">Simpan</button>
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
