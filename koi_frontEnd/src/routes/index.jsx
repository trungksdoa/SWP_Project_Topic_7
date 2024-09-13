import { useRoutes } from "react-router-dom"
import HomePage from "../pages/HomePage"
import MainLayout from "../components/layouts/MainLayout"
import { PATH } from "../constant"
import StorePage from "../pages/StorePage"
import DashboardPage from "../pages/DashboardPage"
import DashboardLayout from "../components/layouts/DashboardLayout"
import ProfilePage from "../pages/ProfilePage"

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
        element: <DashboardLayout />,
        children: [
            {
                path: PATH.DASHBOARD,
                element: <DashboardPage />
            }
        ]
    }
]
export const Router = () => useRoutes(router)