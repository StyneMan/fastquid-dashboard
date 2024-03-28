/* eslint-disable no-alert */
import * as Yup from 'yup'
import { useState, useEffect } from 'react'
import { useFormik, Form, FormikProvider } from 'formik'
import { sentenceCase } from 'change-case'
// material
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormControl from '@mui/material/FormControl'
import NativeSelect from '@mui/material/NativeSelect'
import InputLabel from '@mui/material/InputLabel'
import LoadingButton from '@mui/lab/LoadingButton'
// Date Module
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
// Third party
import toast, { Toaster } from 'react-hot-toast'
// Services
import { Avatar, Box, Button, Divider } from '@mui/material'
import APIService from '../../service'
// component
import Iconify from '../Iconify'

import StateApiService from '../../utils/stateApi'
import CustomModal from '../modal/CustomModal'
import Spacer from '../spacer'

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const sex = [
  {
    label: 'Male',
    value: 'male',
  },
  {
    label: 'Female',
    value: 'female',
  },
]

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
]

const formSchema = Yup.object().shape({
  firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('First name required'),
  lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name required'),
  phoneNumber: Yup.string()
    .matches(phoneRegExp, 'Enter a valid phone number')
    .required('Phone number is required')
    .min(10, 'Phone Number must be between 10-11 digits')
    .max(11, 'Phone Number must not be more than 11 digits'),
  emailAddress: Yup.string().email('Email must be a valid email address').required('Email is required'),
  gender: Yup.string().required('Gender is required'),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  address: Yup.string().required('Current Address is required'),
  dob: Yup.string().required('Date of Birth is required'),
})

function ProfileForm (props) {
  const { mutate, profile, matches } = props
  const [loading, setLoading] = useState()
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [openDialog, setOpenDialog] = useState()
  const [instructions, setInstructions] = useState('')
  const [ticket, setTicket] = useState(null)
  const [open, setOpen] = useState(false)

  const [countryCode] = useState('+234')

  const formik = useFormik({
    initialValues: {
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      emailAddress: profile?.emailAddress || '',
      phoneNumber: profile?.phoneNumber?.replace('+234', '0') || '',
      gender: profile?.gender || 'male',
      dob: new Date(profile?.dob) || new Date('2000-12-31T23:00:00.000Z'),
      address: profile?.location?.address || '',
      state: profile?.location?.state || 'Abia',
      city: profile?.location?.city || '',
    },
    validationSchema: formSchema,
    onSubmit: async () => {
      setLoading(true)
      const payload = {
        ...values,
        phoneNumber: `${countryCode}${
          values.phoneNumber.charAt(0) === '0' ? values.phoneNumber.substring(1) : values.phoneNumber
        }`,
      }
      const response = APIService.update('/auth', 'update', {
        ...payload,
        location: {
          state: values.state,
          city: values.city,
          address: values.address,
        },
      })

      toast.promise(response, {
        loading: 'Updating...',
        success: () => {
          setLoading(false)
          mutate('/auth/profile')
          return 'Changes Saved Successfully!'
        },
        error: err => {
          setLoading(false)
          return err?.response?.data?.message || err?.message || 'Something went wrong, try again.'
        },
      })
    },
  })

  const { errors, touched, values, handleSubmit, getFieldProps, setFieldValue } = formik

  useEffect(() => {
    const mappedStates = StateApiService.getStates.map(item => ({
      label: sentenceCase(item),
      value: item,
    }))

    setStates(mappedStates)
  }, [])

  useEffect(() => {
    const mappedCities = StateApiService.getLGA(values?.state).map(item => ({
      label: sentenceCase(item),
      value: item,
    }))

    setCities(mappedCities)
  }, [states, values.state])

  const requestProfileUpdate = async () => {
    try {
      const values = {
        subject: 'account update',
        message: instructions,
      }

      setLoading(true)
      const response = APIService.post('/support/create', values)

      toast.promise(response, {
        loading: 'Sending...',
        success: res => {
          setOpenDialog(false)
          setLoading(false)
          setFieldValue('message', '.')
          console.log('SUPPORT DATA >> ', res.data)
          setTicket(res.data.data)
          setOpen(true)
          return 'Your request has been received successfully!'
        },
        error: err => {
          setLoading(false)
          return err?.response?.data?.message || err?.message || 'Something went wrong, try again.'
        },
      })
    } catch (error) {
      console.log('ERROR', error)
    }
  }

  return (
    <>
      <CustomModal open={open} setOpen={setOpen} title='Support' modalSize='sm'>
        <Box sx={{ textAlign: 'start' }}>
          <Stack direction='row' alignItems='center'>
            <Avatar src='/static/images/fastquid-admin.png' />
            <div>
              <Typography sx={{ fontWeight: 'bolder', marginLeft: 1 }}>
                Fastquid Support <br />
                <span style={{ fontWeight: 'lighter', color: 'rgb(33 43 54 / 40%)' }}>support@fastquid.ng</span>
              </Typography>
            </div>
          </Stack>
          <Divider sx={{ marginTop: 2 }} />
          <Spacer size={2} />
          <Typography variant='body1' sx={{ textTransform: 'capitalize', fontWeight: 'bolder' }} gutterBottom>
            Hi {profile?.fullName},
          </Typography>
          <Typography variant='body1' color='text.secondary' gutterBottom>
            Thank you for contacting FastQuid, we're your bank without barriers.
            <br />
            Your ticket has been created with the ticket ID <b>{ticket?.ticketId}</b> and subject{' '}
            <span style={{ textTransform: 'uppercase' }}>
              <b>({ticket?.subject})</b>
            </span>
            <br /> Kindly expect a response via your email and resolution within 24 hours.{' '}
          </Typography>
          <Spacer size={3} />
          <Typography variant='body1' color='text.secondary'>
            Regards,
            <br /> FastQuid Customer Success Team.
          </Typography>
          <Spacer size={4} />
        </Box>
      </CustomModal>
      <CustomModal open={openDialog} setOpen={setOpenDialog} modalSize='sm' title='Account Update Request'>
        <Box >
          <Typography variant='h6' gutterBottom>
            Account Information Update Request Form
          </Typography>
          <TextField
            name='instruction'
            value={instructions}
            variant='outlined'
            label='Instruction'
            multiline
            minRows={3}
            type='text'
            required
            fullWidth
            placeholder='Please specify what you want updated'
            onChange={e => {
              setInstructions(e.target.value)
            }}
          />
          
          <Button
            variant='contained'
            fullWidth
            sx={{mt: 2}}
            onClick={() => {
              if (instructions) {
                requestProfileUpdate()
              }
              else {
                toast.error('Enter description of what to update first')
              }
            }}
          >
            Send Request
          </Button>
        </Box>
      </CustomModal>
      <Grid container spacing={2}>
        <Grid item sm={4} xs={12}>
          <Typography variant='h4'>Personal Information</Typography>
          <Typography variant='body2' color='text.secondary'>
            Change your FastQuid information using the form.
          </Typography>
        </Grid>
        <Grid item sm={8} xs={12}>
          <FormikProvider value={formik}>
            <Form autoComplete='off' noValidate onSubmit={handleSubmit} style={{ width: '100%' }}>
              <Stack spacing={2} sx={{ marginBottom: 2 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} alignItems='center' spacing={2}>
                  <TextField
                    fullWidth
                    disabled
                    label='First name'
                    {...getFieldProps('firstName')}
                    error={Boolean(touched.firstName && errors.firstName)}
                    helperText={touched.firstName && errors.firstName}
                  />

                  <TextField
                    fullWidth
                    disabled
                    label='Last name'
                    {...getFieldProps('lastName')}
                    error={Boolean(touched.lastName && errors.lastName)}
                    helperText={touched.lastName && errors.lastName}
                  />
                </Stack>
                <TextField
                  fullWidth
                  autoComplete='email-address'
                  type='email'
                  disabled
                  label='Email address'
                  {...getFieldProps('emailAddress')}
                  error={Boolean(touched.emailAddress && errors.emailAddress)}
                  helperText={touched.emailAddress && errors.emailAddress}
                />
                <TextField
                  fullWidth
                  autoComplete='phone'
                  type='text'
                  disabled
                  label='Phone Number'
                  {...getFieldProps('phoneNumber')}
                  error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                  helperText={touched.phoneNumber && errors.phoneNumber}
                />
                <Stack direction={{ xs: 'column', sm: 'row' }} alignItems='center' spacing={2}>
                  <FormControl fullWidth disabled>
                    <InputLabel htmlFor='gender' sx={{ bgcolor: 'background.paper' }}>
                      <em>Select your Gender</em>
                    </InputLabel>
                    <NativeSelect
                      input={<OutlinedInput variant='outlined' {...getFieldProps('gender')} id='gender' />}
                      id='gender'
                    >
                      {sex.map(gender => (
                        <option key={gender.value} value={gender.value}>
                          {gender.label}
                        </option>
                      ))}
                    </NativeSelect>
                  </FormControl>
                  <FormControl fullWidth disabled>
                    <InputLabel htmlFor='maritalStatus' sx={{ bgcolor: 'background.paper' }}>
                      <em>What's your marital status</em>
                    </InputLabel>
                    <NativeSelect
                      input={
                        <OutlinedInput variant='outlined' {...getFieldProps('maritalStatus')} id='maritalStatus' />
                      }
                      id='maritalStatus'
                    >
                      {marital.map(item => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </NativeSelect>
                  </FormControl>
                </Stack>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <MobileDatePicker
                    label='Date of Birth'
                    inputFormat='MM/dd/yyyy'
                    value={values.dob}
                    disabled
                    onChange={value => {
                      setFieldValue('dob', value)
                    }}
                    renderInput={params => <TextField fullWidth {...params} />}
                  />
                </LocalizationProvider>
                <Stack direction={{ xs: 'column', sm: 'row' }} alignItems='center' spacing={2}>
                  <FormControl fullWidth disabled>
                    <InputLabel htmlFor='state' sx={{ bgcolor: 'background.paper' }}>
                      <em>Select your State</em>
                    </InputLabel>
                    <NativeSelect
                      input={<OutlinedInput variant='outlined' {...getFieldProps('state')} id='state' />}
                      id='state'
                    >
                      {states?.map(state => (
                        <option key={state.value} value={state.value}>
                          {state.label}
                        </option>
                      ))}
                    </NativeSelect>
                  </FormControl>
                  <FormControl fullWidth disabled>
                    <InputLabel htmlFor='city' sx={{ bgcolor: 'background.paper' }}>
                      <em>Select your City</em>
                    </InputLabel>
                    <NativeSelect
                      input={<OutlinedInput variant='outlined' {...getFieldProps('city')} id='city' />}
                      id='city'
                    >
                      {cities?.map(city => (
                        <option key={city.value} value={city.value}>
                          {city.label}
                        </option>
                      ))}
                    </NativeSelect>
                  </FormControl>
                </Stack>

                <TextField
                  fullWidth
                  disabled
                  autoComplete='address'
                  type='text'
                  label='Current Address'
                  minRows={2}
                  multiline
                  {...getFieldProps('address')}
                  error={Boolean(touched.address && errors.address)}
                  helperText={touched.address && errors.address}
                />
              </Stack>

              <LoadingButton
                fullWidth={!matches}
                size='large'
                onClick={() => setOpenDialog(true)}
                variant='contained'
                loading={loading}
              >
                Contact Admin to Update Profile
              </LoadingButton>
            </Form>
            <Toaster />
          </FormikProvider>
        </Grid>
      </Grid>
    </>
  )
}

export default ProfileForm
