import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from "react-router-dom";

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import InputBox from "../components/AuthComponents/InputBox.jsx";
import Button from "../components/AuthComponents/Button.jsx";
import GoogleLogin from '../components/AuthComponents/GoogleLogin.jsx';


export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { user, signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function handleGoogleLogin() {
    console.log("Google Login")
    await loginWithGoogle();
    navigate("/home");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    console.log("Form Data before submitting", formData);
    await signup(formData.name, formData.email, formData.password);
    navigate("/home");
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  return (
    <div className="w-screen min-h-screen flex flex-col lg:flex-row bg-white">
      <div className="hidden lg:flex lg:w-1/2 h-screen bg-indigo-600 justify-center items-center">
        <DotLottieReact
          src="https://lottie.host/70081647-c250-44a9-b399-8d32d820194e/6L4iIS7X2I.lottie"
          loop
          autoplay />
      </div>
      <div className="lg:w-1/2 flex flex-col justify-center items-center">
        <h1 className="text-4xl text-black font-poetsen">Join Whisper</h1>
        <form className="flex flex-col mt-10 gap-6 w-full max-w-md" onSubmit={handleSubmit}>
          <InputBox placeholder="Username" type="text" name="name" handleChange={handleChange} />
          <InputBox placeholder="Email" type="email" name="email" handleChange={handleChange} />
          <InputBox placeholder="Password" type="password" name="password" handleChange={handleChange} />
          <Button />
        </form>
        <div className="mt-6 w-full max-w-md">
          <GoogleLogin handleOnClick={handleGoogleLogin} />
        </div>
      </div>
    </div>
  )
}