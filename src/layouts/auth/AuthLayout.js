/* eslint-disable react/prop-types */
import { Outlet, useLocation } from 'react-router-dom';
// material
import { styled, useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';

// components
import { Box, Grid, useMediaQuery } from '@mui/material';
import Logo from '../../components/Logo';
import Page from '../../components/Page';
import Preloader from '../../components/loading/Preloader';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  height: '100%',
  paddingTop: 0,
  marginBottom: 0,
}));

// ----------------------------------------------------------------------

export default function AuthLayout({ loading }) {
  const { palette } = useTheme();
  const location = useLocation();
  const theme = useTheme();
  const media = useMediaQuery(theme.breakpoints.down('sm'));

  let styles;

  const defaultStyles = {
    height: '102vh',
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: 'white',
  };

  const signupStyles = {
    height: 'auto',
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: 'white',
  };

  const notFoundStyles = {
    height: '100%',
    backgroundColor: palette.background.paper,
  };

  if (location?.pathname === '/404') {
    styles = notFoundStyles;
  } else if (location?.pathname === '/signup') {
    styles = signupStyles;
  } else {
    styles = defaultStyles;
  }

  if (loading) {
    return <Preloader />;
  }

  return (
    <Page title="Authentication" style={styles}>
      <Box width={'100%'} height={'100%'}>
        <Grid container spacing={2} width={'100%'} height={'100%'}>
          <Grid
            hidden={media}
            item
            xs={12}
            sm={5}
            md={6}
            sx={{ backgroundImage: `url(${process.env.PUBLIC_URL}/static/images/bg.png )` }}
            style={{
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              height: '102vh',
            }}
          />
          <Grid item xs={12} sm={7} md={6} height={'100%'}>
            <RootStyle>
              <Container maxWidth="sm"  >
                <Logo
                  title="FastQuid"
                  colorizer={"black"}
                  disabledLink
                  titleColor={location?.pathname !== '/404' ? 'black' : 'white'}
                  sx={{ justifyContent: 'center', marginBottom: 0, marginTop: 3 }}
                />
                <Outlet />
              </Container>
            </RootStyle>
          </Grid>
        </Grid>
      </Box>
    </Page>
  );
}
