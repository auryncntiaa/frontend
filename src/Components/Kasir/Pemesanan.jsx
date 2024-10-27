import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Pemesanan() {
  const [menu, setMenu] = useState([]);
  const [meja, setMeja] = useState([]);
  const [pesanan, setPesanan] = useState([]);
  const [selectedMeja, setSelectedMeja] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const token = sessionStorage.getItem("Token");

  useEffect(() => {
    fetchMenu();
    fetchMeja();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/menu");
      setMenu(response.data);
    } catch (error) {
      console.error("Error fetching menu:", error);
      toast.error("Failed to fetch menu.");
    }
  };

  const fetchMeja = async () => {
    try {
      const response = await fetch("http://localhost:8080/meja", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      setMeja(data.meja || []);
    } catch (error) {
      console.error("Error fetching meja:", error);
      toast.error("Failed to fetch meja.");
    }
  };

  const handleSelectChange = (event) => {
    setSelectedMeja(event.target.value);
  };

  const handleIncreaseClick = (id_menu) => {
    const updatedMenu = menu.map((item) => {
      if (item.id_menu === id_menu) {
        return { ...item, qty: item.qty + 1 };
      }
      return item;
    });
    setMenu(updatedMenu);
  };

  const handleDecreaseClick = (id_menu) => {
    const updatedMenu = menu.map((item) => {
      if (item.id_menu === id_menu && item.qty > 0) {
        return { ...item, qty: item.qty - 1 };
      }
      return item;
    });
    setMenu(updatedMenu);
  };

  const checkPemesanan = () => {
    const pesananBaru = menu.filter((item) => item.qty > 0);
    if (pesananBaru.length === 0) {
      toast.error("Silakan pilih menu terlebih dahulu!");
      return;
    }
    setPesanan(pesananBaru);
    setShowModal(true);
  };

  return (
    <div className="bg-white min-h-screen p-8">
      {/* Dropdown for Meja Selection */}
      <div className="flex justify-end mb-6">
        <select
          onChange={handleSelectChange}
          className="text-sm rounded-lg p-2.5 bg-[#B30000] text-white focus:ring-sky-900 focus:border-sky-900"
          style={{ width: '300px' }}
        >
          <option value="">Pilih meja pelanggan</option>
          {meja.map((option) => (
            <option
              key={option.id_meja}
              value={option.nomor_meja}
              disabled={option.status === "tidak_tersedia"}
            >
              Meja nomor {option.nomor_meja} {option.status === "tidak_tersedia" ? "(Tidak Tersedia)" : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Makanan Section */}
      <h6 className="mt-6 ml-5 text-4xl font-sans font-semibold">Makanan</h6>
      <div className="flex flex-wrap gap-5 mt-5 ml-5">
        {menu.map((menu) => {
          if (menu.jenis === "makanan") {
            return (
              <div
                key={menu.id}
                className="max-w-sm bg-white border border-gray-200 rounded-lg shadow"
              >
                <img
                  className="w-80 h-60 p-8 rounded-t-lg"
                  src={`http://localhost:8080/gambar/menu/${menu.gambar}`}
                  alt="product"
                />
                <div className="px-5 pb-5">
                  <h5 className="text-xl font-semibold tracking-tight text-gray-900">
                    {menu.nama_menu}
                  </h5>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-3xl font-bold text-gray-900">
                      Rp{menu.harga.toLocaleString()}
                    </span>
                    <div className="inline-flex rounded-md" role="group">
                      <button
                        onClick={() => handleDecreaseClick(menu.id_menu)}
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-white bg-[#B30000] border border-gray-200 rounded-l-lg hover:bg-red-800 focus:z-10 focus:ring-2"
                      >
                        -
                      </button>
                      <input
                        type="text"
                        className="text-center py-2 text-sm font-medium text-gray-900 w-14 bg-white border-t border-b border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-2"
                        value={menu.qty}
                        disabled
                      />
                      <button
                        onClick={() => handleIncreaseClick(menu.id_menu)}
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-white bg-[#B30000] border border-gray-200 rounded-r-md hover:bg-red-800 focus:z-10 focus:ring-2"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* Minuman Section */}
      <h6 className="mt-6 ml-5 text-4xl font-sans font-semibold">Minuman</h6>
      <div className="flex flex-wrap gap-5 mt-5 ml-5">
        {menu.map((menu) => {
          if (menu.jenis === "minuman") {
            return (
              <div
                key={menu.id}
                className="max-w-sm bg-white border border-gray-200 rounded-lg shadow"
              >
                <img
                  className="w-80 h-60 p-8 rounded-t-lg"
                  src={`http://localhost:8080/gambar/menu/${menu.gambar}`}
                  alt="product"
                />
                <div className="px-5 pb-5">
                  <h5 className="text-xl font-semibold tracking-tight text-gray-900">
                    {menu.nama_menu}
                  </h5>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-3xl font-bold text-gray-900">
                      Rp{menu.harga.toLocaleString()}
                    </span>
                    <div className="inline-flex rounded-md" role="group">
                      <button
                        onClick={() => handleDecreaseClick(menu.id_menu)}
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-white bg-[#B30000] border border-gray-200 rounded-l-lg hover:bg-red-800 focus:z-10 focus:ring-2"
                      >
                        -
                      </button>
                      <input
                        type="text"
                        className="text-center py-2 text-sm font-medium text-gray-900 w-14 bg-white border-t border-b border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-2"
                        value={menu.qty}
                        disabled
                      />
                      <button
                        onClick={() => handleIncreaseClick(menu.id_menu)}
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-white bg-[#B30000] border border-gray-200 rounded-r-md hover:bg-red-800 focus:z-10 focus:ring-2"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* Pesan Button */}
      <div className="fixed bottom-4 right-4 pointer-events-auto">
        <button
          onClick={checkPemesanan}
          className="px-6 py-3 rounded-lg bg-[#B30000] text-white hover:bg-red-800"
        >
          Pesan
        </button>
      </div>

      {showModal ? (
        <Modal pesanan={pesanan} selectedMeja={selectedMeja} setShowModal={setShowModal} />
      ) : null}
      
      <ToastContainer />
    </div>
  );
}

const Modal = ({ pesanan, selectedMeja, setShowModal }) => {
  const handleConfirm = () => {
    setShowModal(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Konfirmasi Pesanan</h2>
        <div className="mt-8">
          <div className="flow-root">
            <ul role="list" className="-my-6 divide-y divide-gray-200">
              {pesanan.map((product) => (
                <li key={product.id_menu} className="flex py-6">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      className="h-full w-full object-cover object-center"
                      src={`http://localhost:8080/gambar/menu/${product.gambar}`}
                      alt={product.nama_menu}
                    />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                          <span>{product.nama_menu}</span>
                        </h3>
                        <p className="text-lg font-semibold">
                          Rp{(product.harga * product.qty).toLocaleString()}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Jumlah: {product.qty}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex justify-end border-t border-gray-200">
          <button
            onClick={handleConfirm}
            className="mt-4 w-full inline-flex justify-center rounded-md border border-transparent bg-[#B30000] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Konfirmasi Pesanan
          </button>
        </div>
      </div>
    </div>
  );
};
