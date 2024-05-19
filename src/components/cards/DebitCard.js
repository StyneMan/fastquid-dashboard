/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import PropType from 'prop-types';
import { capitalCase } from 'change-case';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Spacer from '../spacer';
import Iconify from '../Iconify';

const StyledCard = styled(Card)(({ theme }) => ({
  height: 200,
  backgroundColor: theme.palette.primary.main,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPositionY: 'center',
  backgroundImage: `url(https://i.imgur.com/wTZlDXI.jpg)`,
  padding: 0,
}));

const StyleCardContent = styled(CardContent)(({ theme }) => ({
  textAlign: 'center',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

const ColoredTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  fontWeight: 'bolder',
  textTransform: 'capitalize',
}));

const AbsoluteButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'white',
  color: theme.palette.primary.main,
  position: 'absolute',
  top: 0,
  right: 0,
}));

const ChipImage = styled('img')(({ theme }) => ({
  width: 48,
  height: 48,
  objectFit: 'contain',
}));

function DebitCard(props) {
  const { debitCard, handleAction } = props;
  return (
    <StyledCard variant="outlined">
      <StyleCardContent>
        <AbsoluteButton variant="contained" endIcon={<Iconify icon="eva:edit-outline" />} onClick={handleAction}>
          Change
        </AbsoluteButton>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ marginTop: 2 }}>
          <ChipImage src="/static/images/chip.png" alt="..." />
          <ColoredTypography>{debitCard?.card_type}</ColoredTypography>
        </Stack>
        <ColoredTypography variant="h4">
          <span>**** **** **** </span>
          {debitCard?.last4}
        </ColoredTypography>
        <Spacer flex />
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <ColoredTypography>{debitCard?.account_name}</ColoredTypography>
          <ColoredTypography>{`${debitCard?.exp_month}/${debitCard?.exp_year}`}</ColoredTypography>
        </Stack>
      </StyleCardContent>
    </StyledCard>
  );
}

export default DebitCard;
