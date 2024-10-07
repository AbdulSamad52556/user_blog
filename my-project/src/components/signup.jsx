import React, {useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from 'sonner'
import image from '../assets/uwp4519055.jpeg';

function Signup() {

    const baseurl = import.meta.env.VITE_API_URL;
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();

    const handleSubmit = async(e) =>{
        e.preventDefault()

        const response = await axios.post(`${baseurl}/register/`,{
            username:name,email:email,password:password
        })
        if (response.data['message'] === 'User registered successfully'){
          toast.success(response.data['message'])
          localStorage.setItem()
          setTimeout(()=>{
            navigate('/login')
          },1500)
        } 
    }

  return (
    <div className="min-h-screen  flex flex-col justify-center" style={{backgroundImage: `url(${image})`,backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh", }}>
      <div className="fixed">
        <Toaster richColors position="top-right"/>
      </div>
      <div className="max-w-md w-full mx-auto bg-white bg-opacity-30 p-8 border border-gray-300">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="text-sm font-bold text-gray-600 block">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              placeholder="Enter your username"
              onChange={(e)=>setName(e.target.value)}
            />
          </div>
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
            <button className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-200">
              Sign Up
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <span className="text-sm">Already have an account? </span>
          <Link to="/login" className="text-sm text-blue-500">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
