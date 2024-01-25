import { useState } from 'react'
import './App.css'

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LandingPage } from './LandingPage';
import { Auth } from './Auth';
import { ViewProfile } from './ViewProfile';
import { Dashboard } from './Dashboard';
import { LoginForm, RegisterForm } from './UserForm';

function App() {

  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>,
      // errorElement: <ErrorPage />,
      // children:[
      //   {
      //     path: "/login",
      //     element: <LoginForm SubmitAction={(pId:number)=>{setLogged(pId)}} />,
      //   },
      //   {
      //     path: "/register",
      //     element: <RegisterForm SubmitAction={(pId:number)=>{setLogged(pId)}} />,
      //   },
      // ]
    },
    {
      path: "/login",
      element: <LoginForm />
    },
    {
      path: "/register",
      element: <RegisterForm />
    },
    {
      path: "/edit",
      element: <Dashboard />
    },
    {
      path: "/auth",
      element: <Auth />
    },
    {
      path: "/:username_url",
      element: <ViewProfile />
    },

  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App
