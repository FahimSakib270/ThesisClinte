import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout";
import AuthLayout from "../Layouts/AuthLayout";
import Home from "../Pages/Home/Home/Home";
import Login from "../Pages/Auth/Login/Login";
import SignIn from "../Pages/Auth/SignIn/SignIn";
import Coverage from "../Pages/Coverage/Coverage";
import PrivateRoute from "../Routes/PrivateRoute"; // Assuming you plan to use this later
import SendParcel from "../Pages/SendParcel/SendParcel";
import DashBoardLayout from "../Layouts/DashBoardLayout";
import MyParcels from "../Pages/DashBoards/MyParcels/MyParcels";
import Payments from "../Pages/DashBoards/Payments/Payments";
import PaymentsHistory from "../Pages/DashBoards/PaymentHistory/PaymentsHistory";
import TrackParcel from "../Pages/DashBoards/TrackParcel/TrackParcel";
import BeRider from "../Pages/DashBoards/BeRider/BeRider";
import PendingRiders from "../Pages/DashBoards/PendingRiders/PendingRiders";
import ActiveRider from "../Pages/DashBoards/ActiveRiders/ActiveRidersc";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/coverage",
        element: <Coverage />,
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
        path: "//be_a_rider",
        element: (
          <PrivateRoute>
            <BeRider></BeRider>
          </PrivateRoute>
        ),
      },
    ],
  },
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
  {
    path: "/dashboard", // Parent path
    element: (
      <PrivateRoute>
        <DashBoardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "myParcels",
        element: <MyParcels />,
      },
      {
        path: "payment/:id",
        Component: Payments,
      },
      {
        path: "history",
        Component: PaymentsHistory,
      },
      {
        path: "track",
        Component: TrackParcel,
      },
      {
        path: "riders/pending",
        Component: PendingRiders,
      },
      {
        path: "riders/active",
        Component: ActiveRider,
      },
    ],
  },
]);
