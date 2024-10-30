import { useRoutes, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import MainLayout from "../components/layouts/MainLayout";
import { PATH } from "../constant";
import StorePage from "../pages/StorePage";
import ProfilePage from "../pages/ProfilePage";
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

import PaymentLayout from "../components/layouts/PaymentLayout";
import EditProduct from "../components/ui/admin/manageProducts/EditProduct";
import CheckoutPage from "../pages/CheckoutPage";
import PaymentSuccessPage from "../pages/PaymentSuccessPage";
import ManagePackage from "../components/ui/admin/managePackages/ManagePackage";
import HistoryPage from "../pages/HistoryPage";
import PondDetail from "../components/ui/manage/PondDetail";
import PackagesPage from "../pages/PackagesPage";
import ManageCategory from "../components/ui/admin/manageCategory/ManageCategory";
import EditCategory from "../components/ui/admin/manageCategory/EditCategory";
import BlogsPage from "../pages/BlogsPage";
import BlogsDetail from "../components/ui/blogs/BlogsDetail";
import DetailBlogPage from "../pages/DetailBlogPage";
import ManageBlogShopPage from "../pages/ManageBlogShopPage";
import EditBlogPage from "../pages/EditBlogPage";
import EditBlog from "../components/ui/blogs/EditBlog";
import EditPackages from "../components/ui/admin/managePackages/EditPackages";
import AddBlogsPage from "../pages/AddBlogsPage";
import ManageOrder from "../components/ui/admin/ManageOrder";
import ManagePayment from "../components/ui/admin/ManagePayment";
import WaterParameterPage from "../pages/WaterParameterPage";
import KoiUpdate from "../components/ui/manage/KoiUpdate";
import KoiMove from "../components/ui/manage/KoiMove";
import Endpoint from "../components/ui/Endpoint";
import FoodCalculator from "../components/ui/manage/FoodCalculator";
import AdminDashboard from "../components/ui/AdminDashboard";
import ManageAdminBlog from "../components/ui/admin/manageAdminBlog";

const router = [
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/endpoint",
        element: <Endpoint />,
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
            path: `${PATH.DETAIL_PRODUCT}/:slug`,
            element: <ProductDetail />,
          },
        ],
      },
      {
        path: PATH.PROFILE,
        element: <ProfilePage />,
      },
      {
        path: PATH.PAYMENT_SUCCESS,
        element: <PaymentSuccessPage />,
      },
      {
        path: PATH.HISTORY_ORDER,
        element: <HistoryPage />,
      },
      {
        path: PATH.BLOGS,
        element: <BlogsPage />,
      },
      {
        path: PATH.BLOG_DETAIL,
        element: <DetailBlogPage />,
        children: [
          {
            path: `${PATH.BLOG_DETAIL}/:slug`,
            element: <BlogsDetail />,
          },
        ],
      },
      {
        path: PATH.MANAGE_BLOG,
        element: <ManageBlogShopPage />,
      },
      {
        path: PATH.EDIT_BLOG,
        element: <EditBlogPage />,
        children: [
          {
            path: `${PATH.EDIT_BLOG}/:id`,
            element: <EditBlog />,
          },
        ],
      },
      {
        path: PATH.ADD_BLOG,
        element: <AddBlogsPage />,
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
        element: <PondManegementPage />,
      },
      {
        path: `/pond-detail/:pondId`,
        element: <PondDetail />,
      },
      {
        path: PATH.WATER_PARAMETER,
        element: <WaterParameterPage />,
      },
      {
        path: PATH.FOOD_CALCULATOR,
        element: <FoodCalculator />,
      },
      {
        path: PATH.PACKAGES,
        element: <PackagesPage />,
      },
      {
        path: "/move-koi",
        element: <KoiMove />,
      },
      {
        path: "/update-koi/:id",
        element: <KoiUpdate />,
      },
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
            path: PATH.ADMIN_DASHBOARD,
            element: <AdminDashboard />,
          },
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
            element: <EditProduct />,
          },
          {
            path: PATH.MANAGE_PRODUCTS,
            element: <ManageProducts />,
          },
          {
            path: PATH.MANAGE_PACKAGE,
            element: <ManagePackage />,
          },
          {
            path: `${PATH.EDIT_PACKAGE}/:id`,
            element: <EditPackages />,
          },
          {
            path: PATH.MANAGE_CATEGORY,
            element: <ManageCategory />,
          },
          {
            path: `${PATH.EDIT_CATEGORY}/:id`,
            element: <EditCategory />,
          },
          {
            path: PATH.MANAGE_ORDER,
            element: <ManageOrder />
          },
          {
            path: PATH.MANAGE_PAYMENT_STATUS,
            element: <ManagePayment />
          },
          {
            path: PATH.ADMIN_BLOG,
            element: <ManageAdminBlog />
          }
        ],
      },
    ],
  },
  {
    element: <PaymentLayout />,
    children: [
      {
        path: PATH.CART,
        element: <CartPage />,
      },
      {
        path: PATH.CHECKOUT,
        element: <CheckoutPage />,
      },
    ],
  },
  // Add this catch-all route at the end of the router array
  {
    path: "*",
    element: <Navigate to="/endpoint" replace />
  }
];

export const Router = () => useRoutes(router);
