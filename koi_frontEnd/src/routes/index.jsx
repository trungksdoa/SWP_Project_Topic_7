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
import ManageProducts from "../components/ui/admin/manageProducts/ManageProducts"
import DetailPage from "../pages/DetailPage"
import ProductDetail from "../components/ui/detail/ProductDetail"
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
            },
            {
                path: PATH.DETAIL_PRODUCT,
                element: <DetailPage />,
                children: [
                  {
                    path: `${PATH.DETAIL_PRODUCT}/:id`,
                    element: <ProductDetail />,
                  },
                ],
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
                    },
                    {
                        path: PATH.MANAGE_PRODUCTS,
                        element: <ManageProducts />
                    }
                ]
            }
        ]
    }
]
export const Router = () => useRoutes(router)