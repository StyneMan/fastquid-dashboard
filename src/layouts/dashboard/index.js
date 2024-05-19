/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
//
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';
import Preloader from '../../components/loading/Preloader';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled('div')(() => ({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
  backgroundColor: 'white',
}));

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout({ loading, profile }) {
  const [open, setOpen] = useState(false);

  if (loading) {
    return <Preloader />;
  }

  return (
    <RootStyle>
      <DashboardNavbar profile={profile} onOpenSidebar={() => setOpen(true)} />
      <DashboardSidebar profile={profile} isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
      <MainStyle>
        <Outlet />
      </MainStyle>
    </RootStyle>
  );
}
