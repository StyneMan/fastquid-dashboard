/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { useState, useRef, useEffect, useCallback } from 'react';
import { set } from 'date-fns';
// @mui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import Slide from '@mui/material/Slide';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';

// utils
import { fToNow } from '../../utils/formatTime';
// components
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import MenuPopover from '../../components/MenuPopover';
import { useSWRFetch } from '../../hooks';
import APIService from '../../service';
import socket from '../../utils/socket';

// ----------------------------------------------------------------------

const StyledSnackbarContent = styled(SnackbarContent)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? theme.palette.background.paper : theme.palette.primary.main,
}));

export default function NotificationsPopover(props) {
  const { profile } = props;
  const anchorRef = useRef(null);
  const [openPushNotification, setOpenPushNotification] = useState(false);
  const [newNotification, setNewNotification] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const { data, mutate } = useSWRFetch('/notification/single');
  const totalUnRead = notifications.filter((item) => item?.read === false)?.length;
  const [totalSlice, setTotalSlice] = useState(2);
  const [showMore, setShowMore] = useState(true);

  const [open, setOpen] = useState(null);

  const updateNotifications = useCallback(async () => {
    if (totalUnRead) {
      const response = await APIService.update('/notification', 'update-all', { read: true });
      if (response?.status === 200) {
        mutate();
      }
    }
  }, [mutate, totalUnRead]);

  useEffect(() => {
    socket.on(`${profile?.id}-notification-created`, (payload) => {
      setNewNotification(payload);
      setNotifications((oldNotifications) => [payload, ...oldNotifications]);
      setOpenPushNotification(true);
    });
  }, [profile]);

  useEffect(() => {
    if (data?.length) {
      setNotifications(data);
    }
  }, [data]);

  useEffect(() => {
    if (open) {
      updateNotifications();
    }
  }, [open, updateNotifications]);

  useEffect(() => {
    setShowMore(totalSlice < 5);
  }, [totalSlice]);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications?.map((notification) => ({
        ...notification,
        read: false,
      }))
    );
  };

  const handleViewAll = () => {
    setTotalSlice(showMore ? notifications?.length : 2);
  };

  

  return (
    <>
      <SnackbarMessage open={openPushNotification} setOpen={setOpenPushNotification} data={newNotification} />
      <IconButton
        ref={anchorRef}
        color={open ? 'primary' : 'default'}
        onClick={handleOpen}
        sx={{ width: 40, height: 40 }}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="eva:bell-fill" width={20} height={20} />
        </Badge>
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{ width: 360, p: 0, mt: 1.5, ml: 0.75 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" width={20} height={20} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' }, maxHeight: 400 }}>
          <List disablePadding>
            {notifications?.slice(0, totalSlice)?.map((notification, index) => (
              <NotificationItem key={index} notification={notification} />
            ))}
          </List>
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {notifications?.length >= 5 && (
          <Box sx={{ p: 1 }}>
            <Button fullWidth disableRipple onClick={handleViewAll}>
              {showMore ? 'View All' : 'Show Less'}
            </Button>
          </Box>
        )}
      </MenuPopover>
    </>
  );
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    createdAt: PropTypes.string,
    id: PropTypes.string,
    read: PropTypes.bool,
    title: PropTypes.string,
    message: PropTypes.array,
    image: PropTypes.any,
  }),
};

function NotificationItem({ notification }) {
  const { image, title } = renderContent(notification);

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        alignItems: 'flex-start',
        ...(notification?.read && {
          bgcolor: 'background.paper',
        }),
      }}
    >
      <ListItemAvatar>{image}</ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              // alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
            {fToNow(set(new Date(notification?.createdAt), { hours: 10, minutes: 30 }))}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = (
    <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
      {notification?.title}
      {notification?.message?.map((msg, index) => (
        <Typography key={index} component="span" variant="body2" sx={{ color: 'text.secondary' }}>
          &nbsp; {msg}
        </Typography>
      ))}
    </Typography>
  );
  return {
    image: notification?.image ? (
      <Avatar variant="rounded" src={notification?.image} alt={notification?.title} sx={{ marginTop: 1.5 }} />
    ) : null,
    title,
  };
}

// ----------------------------------------------------------------------

function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

const SnackbarMessage = ({ open, setOpen, data }) => (
  <Snackbar
    open={open}
    onClose={() => setOpen(false)}
    TransitionComponent={SlideTransition}
    key={data?.id}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
  >
    <StyledSnackbarContent message={<NotificationItem notification={data} />} />
  </Snackbar>
);
