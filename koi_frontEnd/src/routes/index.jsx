import { useRoutes } from "react-router-dom"
import HomePage from "../pages/HomePage"
import MainLayout from "../components/layouts/MainLayout"

const router = [
    {
        element: <MainLayout />,
        children: [
            {
                path: '/',
                element: <HomePage />
            }
        ]
    }
]
export const Router = () => useRoutes(router)