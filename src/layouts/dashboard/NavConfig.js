// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'Overview',
    path: '/dashboard/overview',
    icon: getIcon('eva:pie-chart-outline'),
  },
  {
    title: 'Loan',
    path: '/dashboard/loan',
    icon: getIcon('bi:cash-coin'),
  },
  {
    title: 'Transactions',
    path: '/dashboard/transactions',
    icon: getIcon('eva:flip-outline'),
  },
  {
    title: 'Profile',
    path: '/dashboard/profile',
    icon: getIcon('eva:person-outline'),
  },
  {
    title: 'Support',
    path: '/dashboard/support',
    icon: getIcon('eva:message-square-outline'),
  },
  
];

export default navConfig;
