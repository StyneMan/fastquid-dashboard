/* eslint-disable react/prop-types */
import * as Yup from 'yup'
import { useState } from 'react'
import { useFormik, Form, FormikProvider } from 'formik'

// material
import Stack from '@mui/material/Stack'
// import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import LoadingButton from '@mui/lab/LoadingButton'
// Third party
import toast, { Toaster } from 'react-hot-toast'
import { Box } from '@mui/material'
// Services
// component

// ----------------------------------------------------------------------

export default function RejectOfferForm ({ setOpen, setDone, setOpenLoanForm }) {
  const [loading, setLoading] = useState()

  const schema = Yup.object().shape({
    reason: Yup.string().required('Your reason is required'),
  })

  const formik = useFormik({
    initialValues: {
      reason: '',
    },
    validationSchema: schema,
    onSubmit: async () => {
      setLoading(true)

      setTimeout(() => {
        setLoading(false)
        setOpen(false)
        setOpenLoanForm(false);
        setDone(false);
        toast.success('Operation successful')
      }, 3000)

      // const response = await APIService.post('/loan/reject-offer', {reason: values.reason, requestId});
      // console.log("LOAN :: ", response.data);

      // toast.promise(, {
      //   loading: 'Updating Password...',
      //   success: () => 'password has been changed successful!',
      //   error: (err) => {
      //     setLoading(false);
      //     return err?.response?.data?.message || err?.message || 'Something went wrong, try again.';
      //   },
      // });
    },
  })

  const { errors, touched, handleSubmit, getFieldProps } = formik

  return (
    <Box display={'flex'} flexDirection={'column'} justifyContent={'start'} p={2}>
        <Typography variant='h4'> Offer Rejection</Typography>
        <Typography variant='body2' color='text.secondary' gutterBottom>
          Please state your reasons for rejecting the loan offer.
        </Typography>
      <Box  display={'flex'} flexDirection={'column'} justifyContent={'start'} p={0.5}>
        <FormikProvider value={formik}>
          <Form autoComplete='off' noValidate onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Stack spacing={2} sx={{ marginBottom: 2 }}>
              <TextField
                fullWidth
                type={'text'}
                label='Reason'
                {...getFieldProps('reason')}
                multiline
                minRows={4}
                error={Boolean(touched.reason && errors.reason)}
                helperText={touched.reason && errors.reason}
              />
            </Stack>

            <LoadingButton fullWidth size='large' type='submit' variant='contained' loading={loading}>
              Submit
            </LoadingButton>
          </Form>
          <Toaster />
        </FormikProvider>
      </Box>
    </Box>
  )
}
