import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import MainLayout from "../layouts/Main.layout.jsx";
import DashboardLayout from "../layouts/Dashboard.layout.jsx";

import ProtectedRoute from "../components/common/ProtectedRoute.jsx";

import HomePage from "../pages/HomePage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";

import LoginPage from "../pages/auth/LoginPage.jsx";
import RegisterPage from "../pages/auth/RegisterPage.jsx";

import DashboardPage from "../pages/dashboard/DashboardPage.jsx";
import CreatePollPage from "../pages/dashboard/CreatePollPage.jsx";
import EditPollPage from "../pages/dashboard/EditPollPage.jsx";
import AnalyticsPage from "../pages/dashboard/AnalyticsPage.jsx";

import PollPage from "../pages/public/PollPage.jsx";
import ResultPage from "../pages/public/ResultPage.jsx";

const AppRoutes = () => {

    return (
        <BrowserRouter>

            <Routes>

                <Route element={<MainLayout />}>

                    <Route
                        path="/"
                        element={<HomePage />}
                    />

                    <Route
                        path="/login"
                        element={<LoginPage />}
                    />

                    <Route
                        path="/register"
                        element={<RegisterPage />}
                    />

                    <Route
                        path="/poll/share/:shareId"
                        element={<PollPage />}
                    />

                    <Route
                        path="/poll/results/:shareId"
                        element={<ResultPage />}
                    />

                </Route>

                <Route
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >

                    <Route
                        path="/dashboard"
                        element={<DashboardPage />}
                    />

                    <Route
                        path="/poll/create"
                        element={<CreatePollPage />}
                    />

                    <Route
                        path="/poll/:pollId/edit"
                        element={<EditPollPage />}
                    />

                    <Route
                        path="/poll/:pollId/analytics"
                        element={<AnalyticsPage />}
                    />

                </Route>

                <Route
                    path="*"
                    element={<NotFoundPage />}
                />

            </Routes>

        </BrowserRouter>
    );
};

export default AppRoutes;