import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

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
          <InputBox placeholder="Username" type="text" name="name" handleChange={handleChange} />
          <InputBox placeholder="Email" type="email" name="email" handleChange={handleChange} />
          <InputBox placeholder="Password" type="password" name="password" handleChange={handleChange} />
          <Button />
        </form>
        <GoogleLogin handleOnClick={handleGoogleLogin} />
      </div>
    </div>
  )
}