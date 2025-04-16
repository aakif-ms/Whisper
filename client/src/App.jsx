import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";

const router = createBrowserRouter([
  {
    path: "/signup",
    element: <SignUp />
  },
  {
    path: "/login",
    element: <Login />
  }
])

export default function App() {
  return (
    <>
      <RouterProvider router={router}/>
    </>
  );
}
