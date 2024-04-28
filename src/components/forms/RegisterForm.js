import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { sentenceCase } from 'change-case';
// material
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import InputLabel from '@mui/material/InputLabel';
import LoadingButton from '@mui/lab/LoadingButton';
// Date Module
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// Third party
import toast, { Toaster } from 'react-hot-toast';
// Services
import APIService from '../../service';
// component
import Iconify from '../Iconify';

import StateApiService from '../../utils/stateApi';

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const sex = [
  {
    label: 'Male',
    value: 'male',
  },
  {
    label: 'Female',
    value: 'female',
  },
];

const marital = [
  {
    label: 'Single',
    value: 'single',
  },
  {
    label: 'Married',
    value: 'married',
  },
  {
    label: 'Divorced',
    value: 'divorced',
  },
  {
    label: 'Widowed',
    value: 'widowed',
  },
];

function RegisterForm(props) {
  const { mutate } = props;
  const [loading, setLoading] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [countryCode] = useState('+234');
  // router
  const navigate = useNavigate();

  const registerSchema = Yup.object().shape({
    firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('First name required'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name required'),
    phoneNumber: Yup.string()
      .matches(phoneRegExp, 'Enter a valid phone number')
      .required('Phone number is required')
      .min(10, 'Phone Number must be between 10-11 digits')
      .max(11, 'Phone Number must not be more than 11 digits'),
    emailAddress: Yup.string().email('Email must be a valid email address').required('Email is required'),
    gender: Yup.string().required('Gender is required'),
    state: Yup.string().required('State of residence is required'),
    city: Yup.string().required('City is required'),
    address: Yup.string().required('Current Address is required'),
    dob: Yup.string().required('Date of Birth is required'),
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
      firstName: '',
      lastName: '',
      emailAddress: '',
      phoneNumber: '',
      gender: 'male',
      dob: new Date('2000-12-31T23:00:00.000Z'),
      address: '',
      state: 'Abia',
      city: '',
      password: '',
    },
    validationSchema: registerSchema,
    onSubmit: async () => {
      setLoading(true);
      const payload = {
        ...values,
        phoneNumber: `${countryCode}${
          values?.phoneNumber.charAt(0) === '0' ? values?.phoneNumber.substring(1) : values?.phoneNumber
        }`,
        location: {
          state: values?.state,
          city: values?.city,
          address: values?.address,
        },
      };
      const response = APIService.post('/auth/create', payload);

      toast.promise(response, {
        loading: 'Loading',
        success: (res) => {
          setLoading(false);
          // send to verify otp
          navigate('/verify-otp', {
            state: {
              emailAddress: values?.emailAddress,
              accessToken: res?.data?.accessToken,
              refreshToken: res?.data?.refreshToken,
            },
            replace: true,
          });
          return `${res?.data?.message}! We sent an OTP to your email address (${values?.emailAddress}). open your mail and enter the OTP sent to your mail.`;
        },
        error: (err) => {
          console.log("ERROR HERE >>> ", `${err}`);
          setLoading(false);
          return err?.response?.data?.message || err?.message || 'Something went wrong, try again.';
        },
      });
    },
  });

  const { errors, touched, values, handleSubmit, getFieldProps, isValid, setFieldValue } = formik;

  useEffect(() => {
    const mappedStates = StateApiService.getStates.map((item) => ({
      label: sentenceCase(item),
      value: item,
    }));

    setStates(mappedStates);
  }, []);

  useEffect(() => {
    const mappedCities = StateApiService.getLGA(values?.state).map((item) => ({
      label: sentenceCase(item),
      value: item,
    }));

    setCities(mappedCities);
  }, [states, values.state]);

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="on" noValidate onSubmit={handleSubmit} style={{ width: '100%' }}>
        <Stack spacing={2} sx={{ marginBottom: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={2}>
            <TextField
              fullWidth
              label="First name"
              {...getFieldProps('firstName')}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />

            <TextField
              fullWidth
              label="Last name"
              {...getFieldProps('lastName')}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={2}>
            <TextField
              fullWidth
              autoComplete="email-address"
              type="email"
              label="Email address"
              {...getFieldProps('emailAddress')}
              error={Boolean(touched.emailAddress && errors.emailAddress)}
              helperText={touched.emailAddress && errors.emailAddress}
            />
            <TextField
              fullWidth
              autoComplete="phone"
              type="text"
              label="Phone Number"
              {...getFieldProps('phoneNumber')}
              error={Boolean(touched.phoneNumber && errors.phoneNumber)}
              helperText={touched.phoneNumber && errors.phoneNumber}
            />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={2}>
            <FormControl fullWidth>
              <InputLabel htmlFor="gender" sx={{ bgcolor: 'background.paper' }}>
                <em>Select your Gender</em>
              </InputLabel>
              <NativeSelect
                input={<OutlinedInput variant="outlined" {...getFieldProps('gender')} id="gender" />}
                id="gender"
              >
                {sex.map((gender) => (
                  <option key={gender.value} value={gender.value}>
                    {gender.label}
                  </option>
                ))}
              </NativeSelect>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="maritalStatus" sx={{ bgcolor: 'background.paper' }}>
                <em>What's your marital status</em>
              </InputLabel>
              <NativeSelect
                input={<OutlinedInput variant="outlined" {...getFieldProps('maritalStatus')} id="maritalStatus" />}
                id="maritalStatus"
              >
                {marital.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </NativeSelect>
            </FormControl>
          
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileDatePicker
                label="Date of Birth"
                inputFormat="MM/dd/yyyy"
                value={values.dob}
                onChange={(value) => {
                  setFieldValue('dob', value);
                }}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </LocalizationProvider>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={2}>
            <FormControl fullWidth>
              <InputLabel htmlFor="state" sx={{ bgcolor: 'background.paper' }}>
                <em>Select your state of residence</em>
              </InputLabel>
              <NativeSelect
                input={<OutlinedInput variant="outlined" {...getFieldProps('state')} id="state" />}
                id="state"
              >
                {states?.map((state) => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </NativeSelect>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="city" sx={{ bgcolor: 'background.paper' }}>
                <em>Select your LGA</em>
              </InputLabel>
              <NativeSelect input={<OutlinedInput variant="outlined" {...getFieldProps('city')} id="city" />} id="city">
                {cities?.map((city) => (
                  <option key={city.value} value={city.value}>
                    {city.label}
                  </option>
                ))}
              </NativeSelect>
            </FormControl>
          </Stack>

          <TextField
            fullWidth
            autoComplete="address"
            type="text"
            label="Residential Address"
            minRows={2}
            multiline
            {...getFieldProps('address')}
            error={Boolean(touched.address && errors.address)}
            helperText={touched.address && errors.address}
          />
          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
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

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          disabled={!isValid || loading}
          loading={loading}
        >
          Create Free Account
        </LoadingButton>
      </Form>
      <Toaster />
    </FormikProvider>
  );
}

export default RegisterForm;
