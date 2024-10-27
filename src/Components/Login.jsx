import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = async (event) => {
    event.preventDefault();
    console.log("handleAuth called", { username, password });

    const loginPromise = axios
      .post("http://localhost:8080/user/auth", { username, password })
      .then((response) => {
        const data = response.data;
        console.log(data);
        
        // Check if data exists and has the expected structure
        if (data && data.data) {
          const userData = data.data; // Extract user data
          
          sessionStorage.setItem("Token", data.token);
          sessionStorage.setItem("role", userData.role); // Access role safely
          sessionStorage.setItem("id_user", userData.id_user);
          localStorage.setItem("Data_user", JSON.stringify(userData));
          sessionStorage.setItem('logged', true);
          
          // Redirect based on user role
          if (userData.role === "admin") {
            window.location.href = "/admin";
          } else if (userData.role === "manajer") {
            window.location.href = "/manajer";
          } else if (userData.role === "kasir") {
            window.location.href = "/kasir/pemesanan";
          } else {
            throw new Error("Role tidak valid");
          }
        } else {
          throw new Error("Data tidak ditemukan dari server");
        }

      })
      .catch((error) => {
        console.error("Login error:", error);
        toast.error("Terjadi kesalahan saat login. Silakan coba lagi.");
        throw error; 
      });

    // Menampilkan status login dengan notifikasi toast
    toast.promise(loginPromise, {
      loading: "Sedang login...",
      success: "Login berhasil!",
      error: "Login gagal. Silakan cek kredensial Anda.",
    });
  };

  return (
    <section className="bg-white h-screen" style={{ 
      backgroundImage: `url('https://media.timeout.com/images/104085142/image.jpg')`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center' 
    }}>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-[#B30000] border-gray-600">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-lg text-center leading-tight tracking-tight md:text-xl text-white">
              Masukkan username dan password anda
            </h1>
            
            <form className="space-y-4 md:space-y-6" onSubmit={handleAuth}>
              <div>
                <label htmlFor="username" className="block mb-2 text-sm font-medium text-white">Username</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="sm:text-sm rounded-lg block w-full p-2.5 bg-white border-gray-600 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="sm:text-sm rounded-lg block w-full p-2.5 bg-white border-gray-600 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full text-black focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-white hover:bg-gray-400 focus:ring-gray-700"
                disabled={!username || !password}
              >
                Masuk
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
