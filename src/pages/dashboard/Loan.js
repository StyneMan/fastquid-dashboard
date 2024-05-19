/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Toaster } from 'react-hot-toast';
import useMediaQuery from '@mui/material/useMediaQuery';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Page from '../../components/Page';
import LoanCard from '../../components/cards/LoanCard';
import formatDate from '../../utils/formatDate';
import formatCurrency from '../../utils/formatCurrency';
import Iconify from '../../components/Iconify';
import colorVariant from '../../utils/colorVariant';
import Advert from '../../components/advert';

const ColoredTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === 'light' ? theme.palette.primary.darker : theme.palette.primary.lighter,
}));

const StyleListSubheader = styled(ListSubheader)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const ItemList = ({ keyName, value, color, dark = false }) => (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="space-between"
    sx={{
      width: '100%',
      paddingBottom: 2,
      marginBottom: 2,
      borderBottomWidth: 1,
      borderBottomColor: dark ? 'rgb(255 255 255 / 20%)' : 'rgb(94 94 98 / 20%)',
      borderBottomStyle: 'dashed',
    }}
  >
    <Typography variant="body1" sx={{ color: dark ? 'rgb(255 255 255 / 60%)' : 'text.secondary' }}>
      {keyName}
    </Typography>
    <Typography variant="subtitle1" sx={{ color: dark ? 'white' : color || 'text.primary' }}>
      {keyName === 'Due Date' ? formatDate(value) : value}
    </Typography>
  </Stack>
);

function Loan(props) {
  const { profile } = props;
  const matches = useMediaQuery((theme) => theme.breakpoints.up('sm'));
  // const [loading, setLoading] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [loan, setLoan] = useState(profile?.loan);
  // const { mutate } = useSWRConfig();
  // const dispatch = useDispatch();

  // const config = {
  //   reference: `LOAN_REPAYMENT_${new Date().getTime().toString()}`,
  //   email: profile?.emailAddress,
  //   firstname: profile?.firstName,
  //   lastname: profile?.lastName,
  //   phone: profile?.phoneNumber?.replace('+234', '0'),
  //   // eslint-disable-next-line radix
  //   amount: parseInt(loan?.totalAmountDue) * 100,
  //   publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
  //   channels: ['card'],
  // };

  // const initializePayment = usePaystackPayment(config);

  // you can call this function anything
  // const onSuccess = (reference) => {
  //   setLoading(true);
  //   // Implementation for whatever you want to do with reference and after success call.
  //   const response = APIService.post('/transaction/create', reference);
  //   toast.promise(response, {
  //     loading: 'loading',
  //     success: (res) => {
  //       console.log('response', res.data);
  //       setLoading(false);
  //       setLoan(res.data);
  //       dispatch(
  //         updateProfile({
  //           key: 'loan',
  //           value: res.data,
  //         })
  //       );
  //       mutate('/auth/profile');
  //       return 'Your Loan Has Been Settled Successfully!';
  //     },
  //     error: (err) => {
  //       setLoading(false);
  //       return err?.response?.data?.message || err?.message || 'Something went wrong, try again.';
  //     },
  //   });
  // };

  // you can call this function anything
  // const onClose = () => {
  //   setLoading(false);
  // };

  const closeDetails = () => setOpenDetails(false);

  const handleAdvert = () => {};

  // const handleRepay = () => {
  //   closeDetails();
  //   initializePayment(onSuccess, onClose);
  // };

  return (
    <Page title="Loan">
      <Drawer anchor="right" open={openDetails} onClose={closeDetails}>
        <Box
          sx={{
            width: { xs: 280, md: 450 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
          }}
          role="presentation"
          onClick={closeDetails}
          onKeyDown={closeDetails}
        >
          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <StyleListSubheader component="div" id="nested-list-subheader">
                <Typography variant="h6" color="primary.darker">
                  Loan Details
                </Typography>
                <IconButton onClose={closeDetails}>
                  <Iconify icon="eva:close-fill" />
                </IconButton>
              </StyleListSubheader>
            }
          >
            <ListItem>
              <ItemList keyName="Amount Borrowed" value={formatCurrency(loan?.amountBorrowed)} />
            </ListItem>
            <ListItem>
              <ItemList keyName="Interest" value={`${loan?.interest}%`} />
            </ListItem>
            <ListItem>
              <ItemList keyName="Total Amount Due" value={formatCurrency(loan?.totalAmountDue)} />
            </ListItem>
            <ListItem>
              <Typography variant="h5" color="primary">
                Loan Repayment Date
              </Typography>
            </ListItem>
            <ListItem>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
                <ListItemText
                  primary="Date"
                  secondary={
                    <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
                      {formatDate(loan?.dueDate)}
                    </Typography>
                  }
                  primaryTypographyProps={{ color: 'text.secondary' }}
                />
                <ListItemText
                  primary="Amount"
                  secondary={
                    <Typography variant="subtitle1" sx={{ color: 'text.primary', textAlign: 'end' }}>
                      {formatCurrency(loan?.totalAmountDue)}
                    </Typography>
                  }
                  primaryTypographyProps={{ color: 'text.secondary', textAlign: 'end' }}
                />
              </Stack>
            </ListItem>
            <ListItem sx={{ marginTop: 4 }}>
              <ItemList keyName="Loan Status" value={loan?.status} color={colorVariant(loan?.status)} />
            </ListItem>
          </List>
          <List>
            {/* {loan?.status === 'credited' && (
              <ListItem>
                <Button variant="contained" size="large" fullWidth onClick={handleRepay}>
                  Repay Loan
                </Button>
              </ListItem>
            )} */}
          </List>
        </Box>
      </Drawer>
      <Container maxWidth="xl">
        <ColoredTypography variant="h4" sx={{ mb: 5 }}>
          Loan
        </ColoredTypography>
        <Grid container spacing={2}>
          <Grid item sm={8} xs={12}>
            <LoanCard matches={matches} profile={profile} />
          </Grid>
          <Grid item sm={4} xs={12}>
            {loan && loan?.status !== 'settled' ? (
              <Paper elevation={3} sx={{ padding: 3, bgcolor: 'primary.dark' }}>
                <ItemList keyName="Repayment Amount" value={formatCurrency(loan?.totalAmountDue || 0)} dark />
                <ItemList keyName="Interest" value={`${loan?.interest}%`} dark />
                <ItemList keyName="Interest Amount" value={formatCurrency(loan?.interestAmount)} dark />
                <Button
                  variant="contained"
                  endIcon={<Iconify icon="eva:arrow-forward-fill" />}
                  onClick={() => setOpenDetails(true)}
                >
                  View Loan Details
                </Button>
              </Paper>
            ) : (
              <Advert
                title={['Ran into an urgent need?', 'Request a salary advance.']}
                featuredImage={'https://i.imgur.com/Rr9Sm6i.jpg'}
                textColor="white"
                buttonText="Advice Me"
                buttonVariant="outlined"
                buttonColor="white"
                handleButtonClick={handleAdvert}
              />
            )}
          </Grid>
        </Grid>
      </Container>
      <Toaster />
    </Page>
  );
}

export default Loan;
