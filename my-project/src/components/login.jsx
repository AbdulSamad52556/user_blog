import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import image from '../assets/uwp4519055.jpeg';
function Login() {

    const baseurl = import.meta.env.VITE_API_URL
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async(e) =>{
        e.preventDefault()
        try{

            const response = await axios.post(`${baseurl}/login/`,{
                email:email,password:password
            })
            if (response.data['message'] == 'Login Successful'){
                toast.success('Login Successful')
                console.log(response.data)
                localStorage.setItem('access_token',response.data['access'])
                localStorage.setItem('refresh_token',response.data['refresh'])
                setTimeout(()=>{
                    navigate('/')
                },1500)
            }else{
                toast.error('Invalid Credentials')
            }

        }catch (err){
            console.log(err)
            toast.error('Invalid Credentials')

        }
    }
  return (
    <div className="min-h-screen flex flex-col justify-center" style={{backgroundImage: `url(${image})`,backgroundSize: "cover",
      backgroundPosition: "center",
      height: "100vh", }}>
        <div className="fixed">
            <Toaster richColors position="top-right" />
        </div>
      <div className="max-w-md w-full mx-auto bg-white p-8 border border-gray-300 bg-opacity-30">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="text-sm font-bold text-gray-600 block">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              placeholder="Enter your email"
              onChange={(e)=>setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-bold text-gray-600 block">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              placeholder="Enter your password"
              onChange={(e)=>setPassword(e.target.value)}

            />
          </div>
          <div>
            <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200">
              Login
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <span className="text-sm">Don't have an account? </span>
          <Link to="/signup" className="text-sm text-blue-500">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
