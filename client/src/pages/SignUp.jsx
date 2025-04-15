import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { FcGoogle } from "react-icons/fc";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { signup, loginWithGoogle } = useAuth();

  async function handleGoogleLogin() {
    console.log("Google Login")
    await loginWithGoogle();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    console.log("Form Data before submitting", formData);
    await signup(formData.name, formData.email, formData.password);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center lg:justify-start">
      <div className="hidden lg:block lg:w-1/2 h-screen bg-indigo-600">
        <DotLottieReact
          src="https://lottie.host/70081647-c250-44a9-b399-8d32d820194e/6L4iIS7X2I.lottie"
          loop
          autoplay
        /></div>
      <div className="lg:w-1/2 flex flex-col justify-center items-center">
        <h1 className="text-4xl font-poetsen">Join Whisper</h1>
        <form className="flex flex-col mt-12 gap-6" onSubmit={handleSubmit}>
          <input type="text" className="bg-gray-200 w-[450px] py-4 rounded-full px-3 font-national text-lg placeholder:font-bold placeholder:text-gray-800 placeholder:font-national" placeholder="Username" name="name" onChange={handleChange} />
          <input type="email" className="bg-gray-200 w-[450px] py-4 rounded-full px-3 font-national text-lg placeholder:font-bold placeholder:text-gray-800 placeholder:font-national" placeholder="Email" name="email" onChange={handleChange} />
          <input type="password" className="bg-gray-200 w-[450px] py-4 rounded-full px-3 font-national text-lg placeholder:font-bold placeholder:text-gray-800 placeholder:font-national" placeholder="Password" name="password" onChange={handleChange} />
          <button type="submit" className="bg-orange-500 w-[450px] py-4 rounded-full px-3 text-white font-bold font-national">Submit</button>
        </form>
        <div className="flex items-center gap-4 justify-center">
          <div className="border-b-2 border-black-1/2 w-[100px] mt-12"></div>
          <p className="mt-12 font-national text-lg font-semibold">Or Login With</p>
          <div className="border-b-2 border-black-1/2 w-[100px] mt-12"></div>
        </div>
        <button className="flex justify-center items-center gap-3 mt-6 bg-transparent border-black border-2 text-black w-[450px] py-4 rounded-full px-3 font-bold font-national" onClick={handleGoogleLogin}><FcGoogle className="text-2xl" />Google</button>
      </div>
    </div>
  )
}