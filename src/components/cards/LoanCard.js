/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
import PropType from 'prop-types';
import { useEffect, useState } from 'react';
// import { usePaystackPayment } from 'react-paystack'
import { styled, alpha, useTheme } from '@mui/material/styles';
import { useSWRConfig } from 'swr';
import toast, { Toaster } from 'react-hot-toast';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Checkbox, CircularProgress, FormControlLabel, FormGroup, ListItem, Toolbar } from '@mui/material';
import { Link } from 'react-router-dom';
import APIService from '../../service';
import Iconify from '../Iconify';
import formatCurrency from '../../utils/formatCurrency';
import CustomModal from '../modal/CustomModal';
import { LoanForm } from '../forms';
// import { setLoading } from "../../store/reducer/lifeCycle"

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.primary.main, 1),
}));

const ColoredTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 'bolder',
}));

const statusVariant = (status) => {
  switch (status) {
    case 'pending':
      return 'warning';

    case 'approved':
      return 'success';

    case 'credited':
      return 'info';

    case 'denied':
      return 'error';

    default:
      return 'info';
  }
};

const Item = ({ keyName, value, alignLeft = false }) => (
  <Box>
    <Typography variant="body2" color="white" sx={{ textAlign: alignLeft ? 'end' : 'start', color: 'white' }}>
      {keyName}
    </Typography>
    <Typography variant="subtitle1" color="white" sx={{ textAlign: alignLeft ? 'end' : 'start', color: 'white' }}>
      {value}
    </Typography>
  </Box>
);

const LoanCard = (props) => {
  const { matches, profile } = props;
  const [done, setDone] = useState(false);
  const [openAddress, setOpenAddress] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [loading, stLoading] = useState(false);
  const [viewBalance, setViewBalance] = useState(true);
  const [openLoanForm, setOpenLoanForm] = useState(false);
  const [openDirectDebit, setOpenDirectDebit] = useState(false);
  const [openMono, setOpenMono] = useState(false);
  const [openPayInstruction, setOpenPayInstruction] = useState(false);
  const [payToData, setPayToData] = useState(null);
  const [paymentInstruction, setPaymentInstruction] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [referenceName, setReferenceName] = useState('');
  const [payableAmount, setPayableAmount] = useState(0);
  const [amount, setAmount] = useState(0);
  const [loanOffer, setLoanOffer] = useState({});
  const { mutate } = useSWRConfig();

  const theme = useTheme();

  useEffect(() => {
    if (profile?.loan) {
      setAmount(profile?.loan?.amountBorrowed);
      setReferenceName(profile?.loan?.status === 'credited' ? 'LOAN_REPAYMENT_' : 'LINK_');
      setPayableAmount(
        profile?.loan?.status === 'credited'
          ? profile?.loan?.totalAmountDue
          : process.env.REACT_APP_LINK_DEBITCARD_CHARGE
      );
    }

    if (profile?.loan?.status === 'approved' && profile?.bvn && !profile?.directDebitAllowed) {
      // setOpenDirectDebit(true);
    }
  }, [profile]);

  useEffect(() => {
    if (done && (!profile?.monoCode || profile?.monoCode === undefined || !profile?.accountLinked)) {
      // setup mono init here
      // setOpenMono(true);
    }

    if (profile?.loan && !profile?.debitCard) {
      // setOpenDebitCardModal(true);
    }
  }, [done, profile.debitCard, profile?.loan, profile?.monoCode]);

  useEffect(() => {
    if (profile?.loan?.status === 'pending' && profile?.monoCode === undefined) {
      // setup mono init here
      // setOpenMono(true);
    }
  }, [profile]);

  const handleViewBalance = () => setViewBalance(!viewBalance);

  const handleApply = () => {
    if (!profile?.location?.address) {
      setOpenAddress(true);
    } else {
      setModalTitle('Loan Application');
      setOpenTerms(true);
    }
  };

  function addOneDay(date) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    return newDate;
  }

  // Initialize direct debit here
  // const initDirectDebit = async () => {
  //   try {
  //     setSpinning(true);
  //     stLoading(true);

  //     const date = new Date(profile?.loan?.dueDate); // Create a new Date object for the current date
  //     // const tomorrow = addOneDay(date);

  //     const year = date.getFullYear(); // Get the full year (e.g., 2024)
  //     const month = String(date.getMonth() + 1).padStart(2, '0'); // Get the month and pad it to 2 digits
  //     const day = String(date.getDate()).padStart(2, '0'); // Get the day and pad it to 2 digits

  //     // const endYear = tomorrow.getFullYear(); // Get the full year (e.g., 2024)
  //     // const endMonth = String(tomorrow.getMonth() + 1).padStart(2, '0'); // Get the month and pad it to 2 digits
  //     // const endDay = String(tomorrow.getDate()).padStart(2, '0'); // Get the day and pad it to 2 digits

  //     const formattedDate = `${year}-${month}-${day}`; // Construct the date string in the desired format
  //     // const formattedEndDate = `${endYear}-${endMonth}-${endDay}`; // Construct the date string in the desired format

  //     const payload = {
  //       transactionId: `Ref${new Date().getTime()}FQ`,
  //       emailAddress: profile?.emailAddress,
  //       bvn: profile?.bvn,
  //       phoneNumber: `${profile?.nationalFormat}`.replace(/\s+/g, ''),
  //       address: 'lagos, nigeria',
  //       amount: `${profile?.loan?.totalAmountDue}`,
  //       charge_date: formattedDate,
  //       currency: 'NGN',
  //     };

  //     // console.log('INSPECT PAYLOAD ::: ', payload);
  //     // ssh -L 3306:localhost:3306 your_cpanel_username@your_domain_or_ip

  //     const response = await APIService.post('/loan/direct-debit-init', payload);

  //     setSpinning(false);
  //     stLoading(false);

  //     console.log('RESPONSE DDBIT :::: ', response.data);

  //     if (response.status === 200) {
  //       setPaymentInstruction(response.data?.message);
  //       setPayToData(response.data?.data);
  //       setOpenPayInstruction(true)
  //       setOpenDirectDebit(false)
  //       // Now load url here
  //       // window.open(response.data?.data?.mono_url, '_blank');
  //     } else {
  //       toast.error(`${response.data?.data?.response?.message}`);
  //     }

  //     // toast.promise(response, {
  //     //   loading: 'Loading...',
  //     //   success: res => {
  //     //     stLoading(false);
  //     //     setSpinning(false);
  //     //     console.log("OKAY OOH", res.date);
  //     //     return res.data?.message ?? 'Your Direct Debit Has Been Initiated Successfully!'
  //     //   },
  //     //   error: err => {
  //     //     stLoading(false)
  //     //     setSpinning(false);
  //     //     console.log(err);
  //     //     return err?.response?.data?.message ?? 'An error occurred!'
  //     //   }
  //     // })
  //   } catch (error) {
  //     console.log('WHAT ?????', error);
  //     setSpinning(false);
  //     stLoading(false);
  //     toast.error(`${error?.response?.data?.message || 'An error occurred'}`);
  //   }
  // };

  // const initMono = async () => {
  //   try {
  //     const payload = {
  //       fullName: `${profile?.firstName} ${profile?.lastName}`,
  //       emailAddress: `${profile?.emailAddress}`,
  //     };
  //     const response = await APIService.post('/bank/init-mono', payload);
  //     console.log('INIT MONO RESPONSE :::: ', response.data);
  //     if (response.status === 200) {
  //       // Now load url here
  //       setOpenMono(false);
  //       window.open(response.data?.data?.mono_url, '_blank');
  //     }
  //   } catch (error) {
  //     console.log('MONO INIT ERROR', error);
  //   }
  // };

  return (
    <div>
      <CustomModal open={openAddress} setOpen={setOpenAddress} title={'Action Required'} modalSize="sm">
        <Box py={2}>
          <Typography gutterBottom variant="body2" textAlign={'left'}>
            You have not completed your KYC. Your residential address is required.
          </Typography>

          <Typography gutterBottom variant="body2" textAlign={'left'}>
            Click{' '}
            <Link to="/dashboard/profile" style={{ fontWeight: 700 }}>
              here
            </Link>{' '}
            to proceed.
          </Typography>
        </Box>
      </CustomModal>
      <CustomModal open={openTerms} setOpen={setOpenTerms} title={'Accept To Continue'} modalSize="sm">
        <Box py={2}>
          <Typography gutterBottom variant="body2" textAlign={'left'}>
            Please be informed that in the event of default on your loan payments, Fastquid reserves the right to
            recover the outstanding loan amount directly from your next salary through your employer.
          </Typography>
          <Typography gutterBottom variant="body2" textAlign={'left'}>
            This action will be taken in accordance with the terms and conditions agreed upon in your loan agreement. We
            urge you to ensure timely repayment of your loan. Thank you
          </Typography>

          <Typography gutterBottom variant="body2" textAlign={'left'}>
            Click{' '}
            <a href="https://fastquid.ng/terms" target="_blank" rel="noreferrer">
              here
            </a>{' '}
            to learn more about our terms of service.
          </Typography>
          <Box>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    value={accepted}
                    onChange={(val) => {
                      console.log(val);
                      setAccepted(!accepted);
                    }}
                  />
                }
                label="I agree and wish to continue with my loan request "
              />
            </FormGroup>
            <br />
            <Button
              disabled={!accepted}
              variant="contained"
              fullWidth
              onClick={() => {
                setAccepted(false);
                setOpenTerms(false);
                setOpenLoanForm(true);
              }}
            >
              Continue to Loan Application
            </Button>
          </Box>
        </Box>
      </CustomModal>
      <CustomModal open={openLoanForm} setOpen={setOpenLoanForm} title={modalTitle} modalSize="sm">
        <LoanForm
          profile={profile}
          mutate={mutate}
          loanOffer={loanOffer}
          setLoanOffer={setLoanOffer}
          loading={loading}
          setLoading={stLoading}
          toast={toast}
          setOpenLoanForm={setOpenLoanForm}
          setDone={setDone}
        />
      </CustomModal>
      <CustomModal open={openDirectDebit} setOpen={setOpenDirectDebit} title="Consent to Direct Debit" modalSize="xs">
        <Box>
          <Typography gutterBottom py={2}>
            You must consent to direct debit to proceed with your loan request. Click on the button below to setup. Note
            that you will be charged ₦50 for direct debit setup. It will refunded once setup is complete.
          </Typography>
          <br />
          <Button
            variant="contained"
            disabled={spinning}
            onClick={() => {
              // initDirectDebit();
            }}
            fullWidth
          >
            I Consent
          </Button>
        </Box>
      </CustomModal>

      <CustomModal open={openMono} setOpen={setOpenMono} title="Account Linking" modalSize="xs">
        <Box>
          <Typography gutterBottom py={2}>
            As part of a compulsory KYC, you must link your bank account for better experience. Do ensure your bank
            account name is the same as your profile name
          </Typography>
          <br />
          <Button
            variant="contained"
            disabled={spinning}
            onClick={() => {
              if (!profile?.location) {
                setOpenAddress(true);
              } else {
                // initMono();
              }
            }}
            fullWidth
          >
            Proceed
          </Button>
        </Box>
      </CustomModal>

      <CustomModal open={openPayInstruction} setOpen={setOpenPayInstruction} title="Action Required" modalSize="xs">
        <Box>
          <Typography gutterBottom textAlign={'left'} py={2}>
            {paymentInstruction}
          </Typography>
          <br />
          <Box display={'flex'} flexDirection={'column'} justifyContent={'start'} alignItems={'start'}>
            <Typography gutterBottom variant="body2">
              {`Mandate Type: ${payToData?.mandate_type}`}
            </Typography>
            <Typography gutterBottom variant="body2">
              {`Reference: ${payToData?.reference}`}
            </Typography>
            {payToData?.transfer_destinations?.map((item) => (
              <ListItem key={item?.account_number} divider>
                <Box display={'flex'} flexDirection={'row'} justifyContent={'start'} alignItems={'center'}>
                  <img src={item?.icon} alt="" width={48} />
                  <Box px={1} display={'flex'} flexDirection={'column'} justifyContent={'start'} alignItems={'start'}>
                    <Typography variant="h6">{item?.bank_name}</Typography>
                    <Typography fontSize={13}>{item?.account_number}</Typography>
                  </Box>
                </Box>
              </ListItem>
            ))}
          </Box>
        </Box>
      </CustomModal>

      <StyledCard variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" color={'white'}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Iconify icon="bi:cash-coin" />
              <Typography variant="overline" color={'white'} style={{ marginLeft: 5 }}>
                Balance
              </Typography>
            </div>
            <IconButton aria-label="ViewBalance" onClick={handleViewBalance}>
              <Iconify sx={{ color: 'white' }} icon={viewBalance ? 'eva:eye-outline' : 'eva:eye-off-outline'} />
            </IconButton>
          </Stack>
          <Stack
            direction={matches ? 'row' : 'column'}
            sx={{ color: 'white' }}
            justifyContent="space-between"
            alignItems="center"
          >
            {profile?.loan?.status === 'credited' ? (
              <ColoredTypography sx={{ color: 'white' }} color={'white'} variant="h2" gutterBottom>
                {viewBalance ? formatCurrency(amount) : '**********'}
              </ColoredTypography>
            ) : (
              <ColoredTypography sx={{ color: 'white' }} color={'white'} variant="h2" gutterBottom>
                {' '}
                {formatCurrency(profile?.balance ?? 0, '')}{' '}
              </ColoredTypography>
            )}

            {profile?.loan?.status === 'settled' || !profile?.loan ? (
              <Button
                onClick={handleApply}
                variant="contained"
                sx={{ bgcolor: 'white', color: theme.palette.primary.main }}
                size="large"
                fullWidth={!matches}
              >
                Apply For a Loan
              </Button>
            ) : // profile?.loan?.status === 'credited' ? (
            //   <Button
            //     variant="contained"
            //     sx={{ bgcolor: 'white', color: theme.palette.primary.main }}
            //     size="large"
            //     fullWidth={!matches}
            //     endIcon={spinning && <CircularProgress size={32} />}
            //     onClick={() => initDirectDebit()}
            //   >
            //     Repay Loan
            //   </Button>
            // ) : //
            profile?.loan?.status === 'denied' ? (
              <Box display={'flex'} flexDirection="row" justifyContent={'space-between'} alignItems={'center'}>
                <Button
                  sx={{ ml: 2, bgcolor: 'white', color: theme.palette.primary.main }}
                  onClick={handleApply}
                  variant="contained"
                  size="large"
                  fullWidth={!matches}
                >
                  Apply
                </Button>
              </Box>
            ) : (
              <Alert severity={statusVariant(profile?.loan?.status)}>
                {profile?.loan?.status === 'pending' ? 'In Review' : profile?.loan?.status}
              </Alert>
            )}
          </Stack>
          {profile?.loan && profile?.loan?.status === 'credited' ? (
            <Stack direction="row" justifyContent="space-between" color="white" alignItems="center">
              <Item keyName="Borrowed" value={`${formatCurrency(profile?.loan?.amountBorrowed)} `} />
              <Item keyName="Due On" value={`${new Date(profile?.loan?.dueDate).toDateString() ?? ''} `} />
              <Item keyName="Amount Due" value={formatCurrency(profile?.loan?.totalAmountDue)} alignLeft />
            </Stack>
          ) : null}
        </CardContent>
        <Toaster containerStyle={{ zIndex: 10000 }} />
      </StyledCard>
    </div>
  );
};

export default LoanCard;

LoanCard.propTypes = {
  matches: PropType.bool.isRequired,
  profile: PropType.object,
};
