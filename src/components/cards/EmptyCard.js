/* eslint-disable react/prop-types */

import { styled, useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Iconify from '../Iconify';

const StyledCard = styled(Card)(({ theme }) => ({
  height: 200,
  backgroundColor: theme.palette.background.paper,
  cursor: 'pointer',
  transition: 'all 200ms ease-in',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const StyleCardContent = styled(CardContent)(() => ({
  textAlign: 'center',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  border: '1px dashed #eee',
}));

function EmptyCard(props) {
  const { title, handleAction } = props;
  const theme = useTheme();

  return (
    <StyledCard onClick={handleAction} variant="outlined">
      <StyleCardContent>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="subtitle1" color="primary">
            {title}
          </Typography>
          <Iconify icon="eva:plus-outline" sx={{ color: theme.palette.primary.main }} />
        </Stack>
      </StyleCardContent>
    </StyledCard>
  );
}

export default EmptyCard;
