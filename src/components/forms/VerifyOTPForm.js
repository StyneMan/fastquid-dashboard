/* eslint-disable consistent-return */
import PropType from 'prop-types';
import { useState } from 'react';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useSWRConfig } from 'swr';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
// material
import OtpInput from 'react-otp-input';
// Third party
// Services
import APIService from '../../service';
// component

function VerifyOTPForm(props) {
  const { location, toast, profileEmail, fieldName, fieldValue, callback } = props;
  const [loading, setLoading] = useState();
  const navigate = useNavigate();
  const { mutate } = useSWRConfig();

  const OTP_LENGTH = 4;

  const schema = Yup.object().shape({
    otp: Yup.number().required('OTP is required'),
  });

  const formik = useFormik({
    initialValues: {
      otp: '',
    },
    validationSchema: schema,
    onSubmit: async () => {
      setLoading(true);
      let payload;
      if (location.pathname === '/dashboard/overview' || location.pathname === '/dashboard/loan') {
        payload = {
          ...values,
          emailAddress: profileEmail,
          [fieldName]: fieldValue,
        };
      } else {
        payload = {
          ...values,
          emailAddress: location?.state?.emailAddress,
        };
      }

      const response = APIService.post('/auth/verify-otp', payload);

      toast.promise(response, {
        loading: 'Loading',
        success: () => {
          if (location?.state?.emailAddress && location?.state?.accessToken) {
            // //   login here
            localStorage.setItem('accessToken', location?.state?.accessToken);
            localStorage.setItem('refreshToken', location?.state?.refreshToken);
            // //   fetch user here
            mutate('/auth/profile');
          } else if (location?.state?.emailAddress) {
            navigate('/reset-password', { state: location?.state?.emailAddress, replace: true });
          } else {
            mutate('/auth/profile');
            callback(fieldName);
          }
          return 'OTP Verified!';
        },
        error: (err) => {
          setLoading(false);
          return err?.response?.data?.message || err?.message || 'Something went wrong, try again.';
        },
      });
    },
  });

  const { errors, touched, values, handleSubmit, setFieldValue } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" onSubmit={handleSubmit} style={{ width: '100%', paddingBottom: 20 }}>
        <Box style={{ marginBottom: 20 }}>
          <Typography variant="body1" color="text.secondary">
            {`We sent an OTP to your mail (${
              location.state?.emailAddress || fieldValue
            }). open your mail and enter the OTP sent to your mail.`}
          </Typography>
        </Box>

        <OtpInput
          value={values.otp}
          onChange={(value) => {
            let otpValue = '';
            otpValue += value;
            setFieldValue('otp', value);
            if (otpValue.length === OTP_LENGTH) {
              return handleSubmit();
            }
          }}
          inputType="number"
          shouldAutoFocus
          numInputs={OTP_LENGTH}
          inputStyle={{
            width: '100%',
            height: 50,
            marginRight: 10,
            marginLeft: 10,
            borderRadius: 8,
            fontSize: 18,
          }}
          renderSeparator={<span>-</span>}
          renderInput={(props) => (
            <input disabled={loading} placeholder={`${Boolean(touched.otp && errors.otp)}` ? `Error` : ''} {...props} />
          )}
        />
      </Form>
    </FormikProvider>
  );
}

export default VerifyOTPForm;

VerifyOTPForm.propTypes = {
  location: PropType.object.isRequired,
  toast: PropType.func.isRequired,
  profileEmail: PropType.string,
  fieldName: PropType.string,
  fieldValue: PropType.string,
  callback: PropType.func,
};
