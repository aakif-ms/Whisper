import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, loginWithGoogle } = useAuth();

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      console.log("User logged in successfully");
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <>
      <h1>Login Page</h1>
      <button onClick={loginWithGoogle}>Click Here to login with Google</button>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" onChange={handleChange} />
        </div>
        <button type="submit">Login In</button>
      </form>
    </>
  );
}
