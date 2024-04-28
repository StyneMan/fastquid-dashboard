import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { useLocation, useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
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

// ----------------------------------------------------------------------

export default function ResetPassword() {
  const [loading, setLoading] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const schema = Yup.object().shape({
    password: Yup.string()
      .min(6, 'Minimum of 6 chars required!')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        'Password must contain at least one special character',
      )
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      password: '',
    },
    validationSchema: schema,
    onSubmit: async () => {
      setLoading(true);
      const response = APIService.update('/auth', 'reset-password', {
        ...values,
        emailAddress: location.state,
      });

      toast.promise(response, {
        loading: 'Loading',
        success: () => {
          navigate('/login', { replace: true });
          return 'password reset was successful!';
        },
        error: (err) => {
          setLoading(false);
          return err?.response?.data?.message || err?.message || 'Something went wrong, try again.';
        },
      });
    },
  });

  const { errors, touched, values, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit} style={{ width: '100%' }}>
        <Stack spacing={2} sx={{ marginBottom: 2 }}>
          <TextField
            fullWidth
            autoComplete="new-password"
            type={showPassword ? 'text' : 'password'}
            label="New Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
          Reset Password
        </LoadingButton>
      </Form>
      <Toaster />
    </FormikProvider>
  );
}
