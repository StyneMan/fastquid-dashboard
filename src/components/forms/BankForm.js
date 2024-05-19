/* eslint-disable react/prop-types */
// import PropType from 'prop-types';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import Paper from '@mui/material/Paper';
import InputLabel from '@mui/material/InputLabel';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import APIService from '../../service';
import { useSWRFetch } from '../../hooks';

const StyledTextField = styled(TextField)(() => ({
  marginBottom: 10,
  marginTop: 10,
}));

const bankSchema = Yup.object().shape({
  accountName: Yup.string(),
  accountNumber: Yup.string()
    .max(10, 'Account Number must not be more than 10 digits')
    .required('accountNumber is required'),
  bankName: Yup.string(),
  bankCode: Yup.string().required('bankCode is required'),
});

function BankForm(props) {
  const { bank, setBank, mutate, loading, setLoading, setOpenModal } = props;
  const [banks, setBanks] = useState([]);
  const { data: bankList } = useSWRFetch('/bank/list');

  useEffect(() => {
    if (bankList?.length) {
      const mappedBanks = bankList?.map((item) => ({ label: item.name, value: item?.code }));
      setBanks(mappedBanks);
    }
  }, [bankList]);

  const formik = useFormik({
    initialValues: {
      accountName: bank?.accountName || '',
      accountNumber: bank?.accountNumber || '',
      bankName: bank?.bankName || '',
      bankCode: bank?.bankCode || '',
    },
    validationSchema: bankSchema,
    onSubmit: async () => {
      setLoading(true);
      const bankName = banks?.filter((bank) => bank.value === values.bankCode)[0];
      const response = APIService.post('/bank/create', { ...values, bankName: bankName?.label });

      toast.promise(response, {
        loading: 'loading',
        success: (res) => {
          setBank(res?.data);
          mutate('/auth/profile');
          setLoading(false);
          setOpenModal(false);
          return 'Bank Linked Successfully!';
        },
        error: (err) => {
          setLoading(false);
          return err?.response?.data?.message || err?.message || 'Something went wrong, try again.';
        },
      });
    },
  });

  const { errors, touched, values, handleSubmit, getFieldProps, setFieldValue } = formik;
  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit} style={{ width: '100%' }}>
        <FormControl fullWidth>
          <InputLabel htmlFor="bankCode" sx={{ bgcolor: 'background.paper' }}>
            <em>Select Bank</em>
          </InputLabel>
          <NativeSelect
            input={<OutlinedInput variant="outlined" {...getFieldProps('bankCode')} id="bankCode" />}
            id="bankCode"
          >
            {banks?.map((item, index) => (
              <option key={index} value={item.value}>
                {item.label}
              </option>
            ))}
          </NativeSelect>
        </FormControl>
        <StyledTextField
          fullWidth
          label="Account Number"
          {...getFieldProps('accountNumber')}
          onChange={(evt) => {
            setFieldValue('accountNumber', evt.target.value);
            setFieldValue('accountName', '');
          }}
          error={Boolean(touched.accountNumber && errors.accountNumber)}
          helperText={touched.accountNumber && errors.accountNumber}
        />
        {values?.accountName && (
          <Paper
            elevation={0}
            sx={{
              bgcolor: 'primary.lighter',
              padding: 1,
              marginBottom: 2,
            }}
          >
            <Typography style={{ textTransform: 'capitalize' }} variant="h4" color="primary.darker">
              {values?.accountName}
            </Typography>
          </Paper>
        )}
        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
          {bank?.accountName ? 'Update Bank' : 'Add Bank'}
        </LoadingButton>
        <Toaster />
      </Form>
    </FormikProvider>
  );
}

export default BankForm;
