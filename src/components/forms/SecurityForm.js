/* eslint-disable react/prop-types */
import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useDispatch } from 'react-redux';

// material
// import { useLocation, useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
// Third party
import toast, { Toaster } from 'react-hot-toast';
// Services
import APIService from '../../service';
// component
import Iconify from '../Iconify';
import { logOut } from '../../store/reducer/auth';

// ----------------------------------------------------------------------

export default function SecurityForm({ matches }) {
  const [loading, setLoading] = useState();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const dispatch = useDispatch();

  const schema = Yup.object().shape({
    oldPassword: Yup.string().required('Current Password is required'),
    newPassword: Yup.string().required('New Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
    },
    validationSchema: schema,
    onSubmit: async () => {
      setLoading(true);
      const response = APIService.update('/auth', 'update', values);

      toast.promise(response, {
        loading: 'Updating Password...',
        success: () => {
          // logout
          handleLogout();
          return 'password has been changed successful!';
        },
        error: (err) => {
          setLoading(false);
          return err?.response?.data?.message || err?.message || 'Something went wrong, try again.';
        },
      });
    },
  });

  const handleLogout = () => {
    dispatch(logOut());
  };

  const { errors, touched, values, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = (type) => {
    if (type === 'current') {
      setShowOldPassword(!showOldPassword);
    } else {
      setShowNewPassword(!showNewPassword);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item sm={6} xs={12}>
        <Typography variant="h4">Change Password</Typography>
        <Typography variant="body2" color="text.secondary">
          Change your password to a new one.
        </Typography>
      </Grid>
      <Grid item sm={6} xs={12}>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Stack spacing={2} sx={{ marginBottom: 2 }}>
              <TextField
                fullWidth
                type={showOldPassword ? 'text' : 'password'}
                label="Current Password"
                {...getFieldProps('oldPassword')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => handleShowPassword('current')} edge="end">
                        <Iconify icon={showOldPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={Boolean(touched.oldPassword && errors.oldPassword)}
                helperText={touched.oldPassword && errors.oldPassword}
              />
              <TextField
                fullWidth
                type={showNewPassword ? 'text' : 'password'}
                label="New Password"
                {...getFieldProps('newPassword')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => handleShowPassword('new')} edge="end">
                        <Iconify icon={showNewPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={Boolean(touched.newPassword && errors.newPassword)}
                helperText={touched.newPassword && errors.newPassword}
              />
            </Stack>

            <LoadingButton fullWidth={!matches} size="large" type="submit" variant="contained" loading={loading}>
              Save Changes
            </LoadingButton>
          </Form>
          <Toaster />
        </FormikProvider>
      </Grid>
    </Grid>
  );
}
