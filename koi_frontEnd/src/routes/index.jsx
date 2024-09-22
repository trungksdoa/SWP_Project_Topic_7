import { useRoutes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import MainLayout from "../components/layouts/MainLayout";
import { PATH } from "../constant";
import StorePage from "../pages/StorePage";
import DashboardPage from "../pages/DashboardPage";
import DashboardLayout from "../components/layouts/DashboardLayout";
// import ProfilePage from "../pages/ProfilePage";
import AdminPage from "../pages/AdminPage";
import AdminLayout from "../components/layouts/AdminLayout";
import ManageUser from "../components/ui/admin/ManageUser";
import ManageProducts from "../components/ui/admin/manageProducts/ManageProducts";
import DetailPage from "../pages/DetailPage";
import ProductDetail from "../components/ui/detail/ProductDetail";
import AddProduct from "../components/ui/admin/manageProducts/AddProduct";
import CartPage from "../pages/CartPage";
import KoiManagementPage from "../pages/KoiManagementPage";
import PondManegementPage from "../pages/PondManagementPage";
import ManagementKoiLayout from "../components/layouts/ManagementKoiLayout";
import WaterParameter from "../components/ui/manage/WaterParameter";
import FoodCalculator from "../components/ui/manage/FoodCalculator";
import SaltCalculator from "../components/ui/manage/SaltCalculator";
import PaymentLayout from "../components/layouts/PaymentLayout";
import EditProduct from "../components/ui/admin/manageProducts/EditProduct";
const router = [
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: PATH.STORE,
        element: <StorePage />,
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
      },
    ],
  },
  {
    element: <ManagementKoiLayout />,
    children: [
      {
        path: PATH.KOI_MANAGEMENT,
        element: <KoiManagementPage />,
      },
      {
        path: PATH.POND_MANAGEMENT,
        element: <PondManegementPage />
      },
      {
        path: PATH.WATER_PARAMETER,
        element: <WaterParameter />
      },
      {
        path: PATH.FOOD_CALCULATOR,
        element: <FoodCalculator />
      },
      {
        path: PATH.SALT_CALCULATOR,
        element: <SaltCalculator />
      }
    ],
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
            element: <ManageUser />,
          },
          {
            path: PATH.ADD_PRODUCT,
            element: <AddProduct />,
          },
          {
            path: `${PATH.EDIT_PRODUCT}/:id`,
            element: <EditProduct />
          },
          {
            path: PATH.MANAGE_PRODUCTS,
            element: <ManageProducts />,
          },
        ],
      },
    ],
  },
  {
    element: <PaymentLayout/>,
    children: [
      {
        path: PATH.CART,
        element: <CartPage />,
      },
    ]
  }
];
export const Router = () => useRoutes(router);
