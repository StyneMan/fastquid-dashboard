import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import Repaid from '../pages/dashboard/Repaid';
import CompleteSignup from '../pages/auth/completeSignup';
import DashboardLayout from '../layouts/dashboard';
import AuthLayout from '../layouts/auth/AuthLayout';
// //
import Login from '../pages/auth/Login';
import NotFound from '../pages/Page404';
import ForgotPassword from '../pages/auth/ForgottenPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import VerifyOtp from '../pages/auth/VerifyOtp';
import SignUp from '../pages/auth/Signup';
import Overview from '../pages/dashboard/Overview';
import Loan from '../pages/dashboard/Loan';
import Transactions from '../pages/dashboard/Transactions';
import Profile from '../pages/dashboard/Profile';
import Support from '../pages/dashboard/Support';
import Settings from '../pages/dashboard/Settings';

// ----------------------------------------------------------------------

export default function Router({ isAuth, loading, profile, profileMutate }) {
  return useRoutes([
    {
      path: '/dashboard',
      element: isAuth ? <DashboardLayout profile={profile} loading={loading} /> : <Navigate to="/login" />,
      children: [
        { path: '/dashboard', element: <Navigate to="/dashboard/overview" /> },
        { path: 'overview', element: <Overview profile={profile} /> },
        { path: 'loan', element: <Loan profile={profile} /> },
        { path: 'transactions', element: <Transactions profile={profile} /> },
        { path: 'profile', element: <Profile profile={profile} /> },
        { path: 'support', element: <Support profile={profile} /> },
      ],
    }, 
    {
      path: '/repayment',
      element: <Repaid profile={profile} />,
    }, 
    {
      path: '/',
      element: !isAuth && !profile ? <AuthLayout loading={loading} /> : <Navigate to="/dashboard" />,
      children: [
        { path: '/', element: <Navigate to="/login" /> },
        { path: 'login', element: <Login profileMutate={profileMutate} /> },
        { path: 'signup', element: <SignUp profileMutate={profileMutate} /> },
        { path: 'forgotten-password', element: <ForgotPassword /> },
        { path: 'reset-password', element: <ResetPassword /> },
        { path: 'verify-otp', element: <VerifyOtp /> },
        { path: '404', element: <NotFound /> },
        { path: 'complete_signup', element: <CompleteSignup /> },
        { path: '*', element: <Navigate to="/404" /> },
        { path: 'repayment', element: <Repaid profile={profile} /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
