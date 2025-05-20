import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import Home from './pages/Home.jsx';
import Protected from './components/Protected.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/signup",
    element: <SignUp />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/home",
    element: <Protected><Home /></Protected>
  }
])

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
