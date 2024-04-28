import { useEffect, useState } from 'react';
// @mui
import { useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
// sections
import { VerifyOTPForm } from '../../components/forms';
import APIService from '../../service';

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  width: '100%',
  margin: 'auto',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  padding: theme.spacing(5),
  background: theme.palette.background.paper,
  borderRadius: 16,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const ColoredTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === 'light' ? theme.palette.primary.darker : theme.palette.primary.lighter,
}));

const VerifyOtp = () => {
  const [loading, setLoading] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    console.log('resendCount', resendCount);
    if (resendCount >= 5) {
      setLoading(true);
      toast.loading('Please try again in 5 minute time...');
      setTimeout(() => {
        setLoading(false);
      }, 600000);
    }
  }, [resendCount]);

  const handleResendOTP = async () => {
    setLoading(true);
    const response = APIService.post('/auth/send-otp', { emailAddress: location.state?.emailAddress });

    toast.promise(response, {
      loading: 'sending...',
      success: () => {
        setResendCount(resendCount + 1);
        setLoading(false);
        return 'OTP Sent!';
      },
      error: (err) => {
        setLoading(false);
        return err?.response?.data?.message || err?.message || 'Something went wrong, try again.';
      },
    });
  };

  return (
    <Box>
      <ContentStyle>
        <ColoredTypography variant="h3">Verify Account!</ColoredTypography>

        <Typography sx={{ color: 'text.secondary', mb: 5 }}>
          Enter 4 digit verification code sent to your email.
        </Typography>
        <VerifyOTPForm location={location} toast={toast} />
      </ContentStyle>

      <Stack direction="column" alignItems="center" justifyContent="center" spacing={2} sx={{ my: 2 }}>
        <Box sx={{ color: 'rgba(0, 0, 0, 0.85)' }}>
          Didn't get the code?
          <Button disabled={loading} variant="text" sx={{ color: 'black' }} onClick={handleResendOTP}>
            Resend Code
          </Button>
        </Box>
      </Stack>
      <Toaster />
    </Box>
  );
};

export default VerifyOtp;
