/* eslint-disable react/prop-types */
import { usePaystackPayment } from 'react-paystack';
import toast, { Toaster } from 'react-hot-toast';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import DebitCard from '../cards/DebitCard';
import EmptyCard from '../cards/EmptyCard';
import APIService from '../../service';
import LoadingBackdrop from '../loading/Backdrop';

function DebitCardForm(props) {
  const { profile, mutate } = props;
  const [debitCard, setDebitCard] = useState(profile?.debitCard);
  const [loading, setLoading] = useState(false);
  const [ setOpenModal] = useState(false);

  const config = {
    reference: `LINK_${new Date().getTime().toString()}`,
    email: profile?.emailAddress,
    firstname: profile?.firstName,
    lastname: profile?.lastName,
    phone: profile?.phoneNumber?.replace('+234', '0'),
    // eslint-disable-next-line radix
    amount: 10 * 100,
    publicKey:'pk_test_743c8bec42d91f3ce953317ff81b65fb1fe1a752',
    channels: ['card'],
  };

  const initializePayment = usePaystackPayment(config);

  const handleAddDebitCard = () => {
    setOpenModal(true);
  };

  const openPayStackModel = () => {
    setOpenModal(false);
    initializePayment(onSuccess, onClose);
  };

  // you can call this function anything
  const onSuccess = (reference) => {
    // Implementation for whatever you want to do with reference and after success call.
    setLoading(true);
    const response = APIService.post('/transaction/create', reference);
    toast.promise(response, {
      loading: 'Linking Debit Card...',
      success: (res) => {
        setDebitCard(res.data);
        mutate('/auth/profile');
        setLoading(false);
        return 'DebitCard was linked successfully!';
      },
      error: (err) => {
        setLoading(false);
        return err?.response?.data?.message || err?.message || 'Something went wrong, try again.';
      },
    });
  };

  // you can call this function anything
  const onClose = () => {
    setLoading(false);
  };

  useEffect(() => {

  })

  return (
    <>
      {loading && <LoadingBackdrop open={loading} setOpen={setLoading} />}
      {/* <CustomModal open={openModal} setOpen={setOpenModal} title="Link Your DebitCard" modalSize="xs">
        <Box>
          <Typography variant="subtitle1" color="text.secondary">
            You must add a debit card to proceed with the loan.
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            You will be charged {formatCurrency(10)} to link your card.
          </Typography>
          <Button
            variant="outlined"
            size="large"
            endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
            onClick={openPayStackModel}
          >
            Continue
          </Button>
        </Box>
      </CustomModal> */}
      <Grid container spacing={2}>
        <Grid item sm={6} xs={12}>
          <Typography variant="h4">Debit Card</Typography>
          <Typography variant="body2" color="text.secondary">
            This is your DebitCard for auto debit when you loan is due.
          </Typography>
        </Grid>
        <Grid item sm={6} xs={12}>
          {debitCard ? (
            <DebitCard debitCard={debitCard} handleAction={openPayStackModel} />
          ) : (
            <EmptyCard title="Add DebitCard" handleAction={handleAddDebitCard} />
          )}
        </Grid>
      </Grid>
      <Toaster />
    </>
  );
}

export default DebitCardForm;
