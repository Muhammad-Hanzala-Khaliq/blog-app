import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import PostListPage from "./pages/PostListPage.jsx";
import SinglePostPage from "./pages/SinglePostPage.jsx";
import Write from "./pages/Write.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import {QueryClientProvider,QueryClient} from "@tanstack/react-query"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient();
// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/posts",
        element: <PostListPage />,
      },
      {
        path: "/:slug",
        element: <SinglePostPage />,
      },
      {
        path: "/write",
        element: <Write />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer position='bottom-right'/>
      </QueryClientProvider>
    </ClerkProvider>
  </StrictMode>
);
