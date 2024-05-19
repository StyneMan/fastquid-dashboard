/* eslint-disable react/prop-types */
import { useRef, useState } from 'react';
import { capitalCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { logOut } from '../../store/reducer/auth';
// components
import MenuPopover from '../../components/MenuPopover';
// mocks_

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Profile',
    icon: 'eva:person-fill',
    linkTo: '/dashboard/profile',
  },
  {
    label: 'Settings',
    icon: 'eva:settings-2-fill',
    linkTo: '/dashboard/settings',
  },
];

// ----------------------------------------------------------------------

export default function ProfilePopover({ profile }) {
  const anchorRef = useRef(null);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = () => {
    dispatch(logOut());
  };

  return (
    <>
      <Stack flexDirection="row" alignItems="center">
        <IconButton
          ref={anchorRef}
          onClick={handleOpen}
          sx={{
            p: 0,
            ...(open && {
              '&:before': {
                zIndex: 1,
                content: "''",
                width: '100%',
                height: '100%',
                borderRadius: '5%',
                position: 'absolute',
                bgcolor: (theme) => alpha(theme.palette.grey[900], 0.3),
              },
            }),
          }}
        >
          <Typography variant="subtitle2" color="text.primary" sx={{ textTransform: 'capitalize', marginRight: 1 }}>
            {profile?.fullName}
          </Typography>
          <Avatar
            alt={capitalCase(profile?.firstName?.charAt(0)) || 'A'}
            src={profile?.photoUrl}
            imgProps={{
              crossOrigin: 'anonymous',
            }}
          />
        </IconButton>
      </Stack>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" style={{ textTransform: 'capitalize' }} noWrap>
            {profile?.fullName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {profile?.emailAddress}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} to={option.linkTo} component={RouterLink} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}
