import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  CreateOrder,
  CreateProduct,
  CreateUser,
  EditOrder,
  EditProduct,
  EditUser,
  HelpDesk,
  HomeLayout,
  Landing,
  Login,
  Notifications,
  Orders,
  Products,
  Profile,
  Register,
  Users,
} from "./pages";
import Categories from "./pages/Categories";
import AddToStock from "./pages/AddToStock";
import ConfirmRequest from "./pages/ConfirmRequest";
import Revenue from "./pages/Revenue";
import HistorysTOCK from "./pages/HistoryStock";
import HistoryStock from "./pages/HistoryStock";
const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/products/import",
        element: <AddToStock />,
      },
      {
        path: "/products/confirmStock",
        element: <ConfirmRequest />,
      },
      {
        path: "/products/create-product",
        element: <CreateProduct />,
      },
      {
        path: "/products/:id",
        element: <EditProduct />,
      },
      {
        path: "/orders",
        element: <Orders />,
      },
      {
        path: "/orders/create-order",
        element: <CreateOrder />,
      },
      {
        path: "/orders/:id",
        element: <EditOrder />,
      },
      {
        path: "/revenue",
        element: <Revenue />,
      },
      {
        path: "/categories",
        element: <Categories />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/users/:id",
        element: <EditUser />,
      },
      {
        path: "/users/create-user",
        element: <CreateUser />,
      },
      {
        path: "/help-desk",
        element: <HelpDesk />,
      },
      {
        path: "/notifications",
        element: <Notifications />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/products/historyStock",
        element: <HistoryStock />,
      },
    ],
    
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
