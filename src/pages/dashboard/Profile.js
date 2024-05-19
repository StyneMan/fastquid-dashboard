/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { useSWRConfig } from 'swr';
import { useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Page from '../../components/Page';
import ProfileCard from '../../components/cards/ProfileCard';
import ProfileForm from '../../components/forms/ProfileForm';
import SecurityForm from '../../components/forms/SecurityForm';
import PaymentForm from '../../components/forms/PaymentForm';
// import DebitCardForm from '../../components/forms/DebitCardForm';
import Spacer from '../../components/spacer';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ bgcolor: 'background.paper', borderBottomRightRadius: 10, borderBottomLeftRadius: 10, padding: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

// const ColoredTypography = styled(Typography)(({ theme }) => ({
//   color: theme.palette.mode === 'light' ? theme.palette.primary.darker : theme.palette.primary.lighter,
// }));

const tabComponent = (tab, profile, mutate, matches) => {
  switch (tab) {
    case 'Profile':
      return <ProfileForm profile={profile} mutate={mutate} matches={matches} />;
    case 'Security':
      return <SecurityForm profile={profile} mutate={mutate} matches={matches} />;
    case 'Payment':
      return <PaymentForm profile={profile} mutate={mutate} matches={matches} />;
    // case 'DebitCard':
    //   return <DebitCardForm profile={profile} mutate={mutate} matches={matches} />;
    default:
      return <div />;
  }
};

const tabs = ['Profile', 'Security', 'Payment'];

function Profile(props) {
  const { profile } = props;
  const { mutate } = useSWRConfig();

  const [tab, setTab] = useState(0);
  const matches = useMediaQuery((theme) => theme.breakpoints.up('sm'));

  const handleChange = (_, newValue) => {
    setTab(newValue);
  };

  return (
    <Page title="Profile">
      <Container maxWidth="xl">
        <ProfileCard profile={profile} mutate={mutate} />
        <Spacer size={4} />
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', borderRadius: 1 }}>
          <Tabs value={tab} onChange={handleChange} aria-label="tab">
            {tabs.map((item, index) => (
              <Tab key={index} label={item} {...a11yProps(0)} />
            ))}
          </Tabs>
        </Box>
        {tabs?.map((item, index) => (
          <TabPanel key={item} value={tab} index={index}>
            {tabComponent(item, profile, mutate, matches)}
          </TabPanel>
        ))}
      </Container>
    </Page>
  );
}

export default Profile;
