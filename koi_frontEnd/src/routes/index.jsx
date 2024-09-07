import { useRoutes } from "react-router-dom"
import HomePage from "../pages/HomePage"
import MainLayout from "../components/layouts/MainLayout"
import { PATH } from "../constant"
import StorePage from "../pages/StorePage"

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
            }
        ]
    }
]
export const Router = () => useRoutes(router)