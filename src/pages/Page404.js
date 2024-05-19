import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
// components
// ----------------------------------------------------------------------

const ContentStyle = styled('div')(() => ({
  margin: 'auto',
  textAlign: 'center',
}));

// ----------------------------------------------------------------------

export default function Page404() {
  return (
    <ContentStyle>
      <Typography variant="h3" paragraph>
        Sorry, page not found!
      </Typography>

      <Typography sx={{ color: 'text.secondary' }}>
        Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be sure to check your
        spelling.
      </Typography>

      <Box
        component="img"
        src="/static/images/illustration_404.svg"
        sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
      />

      <Button to="/" size="large" variant="contained" component={RouterLink}>
        Go to Home
      </Button>
    </ContentStyle>
  );
}

// 