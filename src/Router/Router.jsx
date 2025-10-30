import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import AuthLayout from "../Layouts/AuthLayout";
import Home from "../Pages/Home/Home/Home";
import Login from "../Pages/Auth/Login/Login";
import SignIn from "../Pages/Auth/SignIn/SignIn";
import Coverage from "../Pages/Coverage/Coverage";
import PrivateRoute from "../Routes/PrivateRoute";
import SendParcel from "../Pages/SendParcel/SendParcel";
import DashBoardLayout from "../Layouts/DashBoardLayout";
import MyParcels from "../Pages/DashBoards/MyParcels/MyParcels";
import Payments from "../Pages/DashBoards/Payments/Payments";
import PaymentsHistory from "../Pages/DashBoards/PaymentHistory/PaymentsHistory";
import TrackParcel from "../Pages/DashBoards/TrackParcel/TrackParcel";
import BeRider from "../Pages/DashBoards/BeRider/BeRider";
import PendingRiders from "../Pages/DashBoards/PendingRiders/PendingRiders";
import ActiveRider from "../Pages/DashBoards/ActiveRiders/ActiveRidersc";
import ManageAdmins from "../Pages/DashBoards/ManageAdmin/ManageAdmin";
import Forbidden from "../Pages/Forbidden/Forbidden";
import AdminRoute from "../Routes/AdmineRoute";
import AssignRider from "../Pages/DashBoards/AssignRider/AssignRider";
import PendingDeliveries from "../Pages/DashBoards/PendingDeliveries/PendingDeliveries";
import RiderRoutes from "../Routes/RiderRoutes";
import CompletedDeliveries from "../Pages/DashBoards/CompletedDeliveries/CompletedDeliveries";
import MyEarnings from "../Pages/DashBoards/MyEarnings/MyEarnings";
import Story from "../Pages/AboutUs/Story/Story";
import Mission from "../Pages/AboutUs/Mission/Mission";
import Success from "../Pages/AboutUs/Success/Success";
import Team from "../Pages/AboutUs/Teams&Others/Team";
import AboutUsLayout from "../Layouts/AboutUsLayOut";

export const router = createBrowserRouter([
  // --- PUBLIC ROUTES ---
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      // --- ABOUT US ROUTES ---
      {
        path: "/about",
        element: <AboutUsLayout />,
        children: [
          {
            index: true,
            element: <Story />,
          },
          {
            path: "story",
            element: <Story />,
          },
          {
            path: "mission",
            element: <Mission />,
          },
          {
            path: "success",
            element: <Success />,
          },
          {
            path: "team",
            element: <Team />,
          },
        ],
      },
      {
        path: "/coverage",
        element: <Coverage />,
      },
      {
        path: "/forbidden",
        element: <Forbidden />,
      },
      {
        path: "/sendParcel",
        element: (
          <PrivateRoute>
            <SendParcel />
          </PrivateRoute>
        ),
      },
      {
        path: "/be_a_rider",
        element: (
          <PrivateRoute>
            <BeRider />
          </PrivateRoute>
        ),
      },
    ],
  },
  // --- AUTHENTICATION ROUTES ---
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <SignIn />,
      },
    ],
  },
  // --- DASHBOARD ROUTES (Protected by PrivateRoute) ---
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashBoardLayout />
      </PrivateRoute>
    ),
    children: [
      // --- BASE USER ROUTES (Accessible to all authenticated users) ---
      {
        index: true, // Redirects to /dashboard/myParcels in DashBoardLayout
        element: <MyParcels />,
      },
      {
        path: "myParcels",
        element: <MyParcels />,
      },
      {
        path: "payment/:id",
        element: <Payments />,
      },
      {
        path: "history",
        element: <PaymentsHistory />,
      },
      {
        path: "track",
        element: <TrackParcel />,
      },
      // --- ADMIN ONLY ROUTES ---
      {
        path: "assign-rider",
        element: (
          <AdminRoute>
            <AssignRider />
          </AdminRoute>
        ),
      },
      {
        path: "riders/pending",
        element: (
          <AdminRoute>
            <PendingRiders />
          </AdminRoute>
        ),
      },
      {
        path: "riders/active",
        element: (
          <AdminRoute>
            <ActiveRider />
          </AdminRoute>
        ),
      },
      {
        path: "manage-admin",
        element: (
          <AdminRoute>
            <ManageAdmins />
          </AdminRoute>
        ),
      },
      // --- RIDER ONLY ROUTES ---
      {
        path: "pending-deliveries",
        element: (
          <RiderRoutes>
            <PendingDeliveries />
          </RiderRoutes>
        ),
      },

      {
        path: "my-earnings",
        element: (
          <RiderRoutes>
            <MyEarnings />
          </RiderRoutes>
        ),
      },
      {
        path: "completed-deliveries",
        element: (
          <RiderRoutes>
            <CompletedDeliveries />
          </RiderRoutes>
        ),
      },
    ],
  },
]);
