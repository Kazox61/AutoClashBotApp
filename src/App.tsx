import Navbar from "./components/navbar/navbar"
import Sidebar from "./components/sidebar/sidebar"
import Instances from "./pages/instances/instances"
import Profiles from "./pages/profiles/profiles"
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom"
import "./styles/global.scss"

function App() {

  const Layout = () => {
    return (
      <div className="main">
        <Navbar/>
        <div className="container">
          <div className="sidebarContainer">
            <Sidebar/>
          </div>
          <div className="contentContainer">
            <Outlet/>
          </div>
        </div>
      </div>
    )
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element:<Layout/>,
      children: [
        {
          path: "/instances",
          element: <Instances/>
        },
        {
          path: "/profiles",
          element: <Profiles/>
        }
      ]
    }
  ]
  )

  return <RouterProvider router={router} />
}

export default App
