import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function SignUp() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
      });
      const { signup } = useAuth();
    
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
          await signup(formData.email, formData.password);
          console.log("User logged in successfully");
        } catch (err) {
          console.log(err.message);
        }
      }

      return (
        <>
          <h1>Sign Up Page</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email</label>
              <input type="email" name="email" onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input type="password" name="password" onChange={handleChange} />
            </div>
            <button type="submit">Sign Up</button>
          </form>
        </>
      );
}