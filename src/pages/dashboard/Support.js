/* eslint-disable react/prop-types */
// import PropTypes from 'prop-types';
import { useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Page from '../../components/Page';
import SupportForm from '../../components/forms/SupportForm';
import CustomModal from '../../components/modal/CustomModal';
import Spacer from '../../components/spacer';

const ColoredTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === 'light' ? theme.palette.primary.darker : theme.palette.primary.lighter,
}));

const StyledGrid = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  paddingBottom: theme.spacing(3),
  paddingRight: theme.spacing(3),
  paddingTop: theme.spacing(3),
  borderRadius: 16,
}));

function Support(props) {
  const { profile } = props;
  const matches = useMediaQuery((theme) => theme.breakpoints.up('sm'));
  const [ticket, setTicket] = useState(null);
  const [open, setOpen] = useState(false);

  return (
    <Page title="Support">
      <CustomModal open={open} setOpen={setOpen} title="Support" modalSize="sm">
        <Box sx={{ textAlign: 'start' }}>
          <Stack direction="row" alignItems="center">
            <Avatar src="/static/images/fastquid-admin.png" />
            <div>
              <Typography sx={{ fontWeight: 'bolder', marginLeft: 1 }}>
                Fastquid Support <br />
                <span style={{ fontWeight: 'lighter', color: 'rgb(33 43 54 / 40%)' }}>support@fastquid.ng</span>
              </Typography>
            </div>
          </Stack>
          <Divider sx={{ marginTop: 2 }} />
          <Spacer size={2} />
          <Typography variant="body1" sx={{ textTransform: 'capitalize', fontWeight: 'bolder' }} gutterBottom>
            Hi {profile?.fullName},
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Thank you for contacting FastQuid, we're your bank without barriers.
            <br />
            Your ticket has been created with the ticket ID <b>{ticket?.ticketId}</b> and subject{' '}
            <span style={{ textTransform: 'uppercase' }}>
              <b>({ticket?.subject})</b>
            </span>
            <br /> Kindly expect a response via your email and resolution within 24 hours.{' '}
          </Typography>
          <Spacer size={3} />
          <Typography variant="body1" color="text.secondary">
            Regards,
            <br /> FastQuid Customer Success Team.
          </Typography>
          <Spacer size={4} />
        </Box>
      </CustomModal>
      <Container maxWidth="xl">
        <ColoredTypography variant="h4" sx={{ mb: 5 }}>
          Support
        </ColoredTypography>
        <StyledGrid
          container
          spacing={matches ? 2 : 0}
          display={'flex'}
          flexDirection={'row'}
          justifyContent={'space-between'}
          alignItems={!matches && 'center'}
        >
          <Grid item sm={4} xs={12} padding={2} width={"100%"} >
            <Typography variant="h4">FastQuid Support</Typography>
            <Typography variant="body2" color="text.secondary">
              Talk to us about your complaint
            </Typography>
          </Grid>
          <Grid item sm={8} xs={12} padding={2}>
            <SupportForm matches={matches} setTicket={setTicket} openResponseModal={setOpen} />
          </Grid>
        </StyledGrid>
      </Container>
    </Page>
  );
}

export default Support;
