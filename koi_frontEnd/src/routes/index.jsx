import { useRoutes } from "react-router-dom"
import HomePage from "../pages/HomePage"
import MainLayout from "../components/layouts/MainLayout"
import { PATH } from "../constant"
import StorePage from "../pages/StorePage"
import DashboardPage from "../pages/DashboardPage"
import DashboardLayout from "../components/layouts/DashboardLayout"
import ProfilePage from "../pages/ProfilePage"
import AdminPage from "../pages/AdminPage"
import AdminLayout from "../components/layouts/AdminLayout"
import ManageUser from "../components/ui/admin/ManageUser"
const router = [
    {
        element: <MainLayout />,
        children: [
            {
                path: '/',
                element: <HomePage />
            },
            {
                path: PATH.STORE,
                element: <StorePage />
            },
            {
                path: PATH.PROFILE,
                element: <ProfilePage />
            }
        ]
    },
    {
        element: <AdminLayout />,
        children: [
            {
                path: PATH.ADMIN,
                element: <AdminPage />,
                children: [
                    {
                        path: PATH.MANAGE_USER,
                        element: <ManageUser />
                    }
                ]
            }
        ]
    }
]
export const Router = () => useRoutes(router)