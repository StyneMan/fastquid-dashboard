// import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
// import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
// components
// import useSWR from 'swr'
import { Box, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import Page from '../../components/Page';
// import Iconify from '../../components/Iconify';
import Advert from '../../components/advert';
import Spacer from '../../components/spacer';
// import image from "/static/images/home_banner.jpeg"

const ColoredTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === 'light' ? theme.palette.primary.darker : theme.palette.primary.lighter,
}));

function Repaid() {
//   const { profile } = props;
  // const matches = useMediaQuery((theme) => theme.breakpoints.up('sm'));
//   const [transactions, setTransactions] = useState([]);
  const location = useLocation();
  const navigate = useNavigate()

  // Get a specific query parameter
  const transactionId = new URLSearchParams(location.search).get('transactionId');
  const status = new URLSearchParams(location.search).get('status');


  // const { data } = useSWRFetch('transaction/single');
//   const { data } = useSWRFetch('/transaction/single');

//   useEffect(() => {
//     if (data) {
//       // console.log("DATARINA >>>", data);
//     //   setTransactions(data);
//     }
//   }, [data]);

  // const handleAdvert = () => {}

  return (
    <Page title="Overview">
      <Container maxWidth="xl">
        <ColoredTypography variant="h3" sx={{ mt: 3, px: 2, pt: 2 }}>
          Hello,
        </ColoredTypography>
        <Grid container spacing={2} height={'75vh'}>
          <Grid item sm={7} xs={12} height={'100%'}>
            <Box display="flex" flexDirection="column" p={2} >
              <Spacer size={2} />
              <Typography variant='h5' gutterBottom >
                  {`Transaction ID: ${transactionId}`}
              </Typography>
              <Typography variant='h5' gutterBottom >
                  {`Transaction Status: ${status}`}
              </Typography>
              <Advert
                title={['Loan Successfully Repaid', 'You can now apply for another loan']}
                featuredImage={'https://i.imgur.com/Rr9Sm6i.jpg'}
                textColor="white"
                buttonText="Advice Me"
                buttonVariant="outlined"
                buttonColor="white"
              />
              <Spacer />
              <br/>
              <br/>
              <Button variant='contained' onClick={() => {
                navigate('/')
              }} >
                Back to Home
              </Button>
            </Box>
          </Grid>

          <Grid item sm={5} xs={12} height={'100%'}>
            <Advert
              title={['Personal loan!', 'Coming soon']}
              featuredImage={'/static/images/home_banner.jpeg'}
              textColor="white"
              overlay
              height={'100%'}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
export default Repaid;

// Repaid.propTypes = {
//   profile: PropType.object,
// };
