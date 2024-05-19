/* eslint-disable react/prop-types */
// import PropType from 'prop-types';
// import { capitalCase } from 'change-case';
import { styled } from '@mui/material/styles';
// import Box from '@mui/material/Box';
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
  backgroundImage: `url(https://i.imgur.com/jZ1ErR4.jpg)`,
  padding: 0,
}));

const StyleCardContent = styled(CardContent)(() => ({
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

function BankCard(props) {
  const { bank, handleAction } = props;
  return (
    <StyledCard variant="outlined">
      <StyleCardContent>
        <AbsoluteButton variant="contained" endIcon={<Iconify icon="eva:edit-outline" />} onClick={handleAction}>
          Change
        </AbsoluteButton>
        <ColoredTypography variant="h4" sx={{ marginTop: 2.5 }}>
          {bank?.accountName}
        </ColoredTypography>
        <Spacer flex />
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <ColoredTypography>{bank?.bankName}</ColoredTypography>
          <ColoredTypography>{bank?.accountNumber}</ColoredTypography>
        </Stack>
      </StyleCardContent>
    </StyledCard>
  );
}

export default BankCard;
