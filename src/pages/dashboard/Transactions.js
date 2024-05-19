/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useSWRFetch } from '../../hooks';
import Page from '../../components/Page';
import TransactionList from '../../components/list/TransactionList';

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
      {value === index && <Box>{children}</Box>}
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

const ColoredTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === 'light' ? theme.palette.primary.darker : theme.palette.primary.lighter,
}));

const tabs = ['All', 'Loan', 'Account'];

function Transactions(props) {
  const [tab, setTab] = useState(0);
  const matches = useMediaQuery((theme) => theme.breakpoints.up('sm'));
  const [transactions, setTransactions] = useState([]);
  const { data } = useSWRFetch('transaction/single');

  useEffect(() => {
    if (data?.length) {
      setTransactions(data);
    }
  }, [data]);

  const handleChange = (_, newValue) => {
    const type = tabs[newValue]?.toLowerCase();
    if (data?.length) {
      if (newValue === 0) {
        setTransactions(data);
      } else {
        setTransactions(() => data?.filter((item) => item?.type === type));
      }
    }
    setTab(newValue);
  };

  return (
    <Page title="Transactions">
      <Container maxWidth="xl">
        <ColoredTypography variant="h4" sx={{ mb: 5 }}>
          Transactions
        </ColoredTypography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Tabs value={tab} onChange={handleChange} aria-label="tab">
            {tabs.map((item, index) => (
              <Tab key={index} label={item} {...a11yProps(0)} />
            ))}
          </Tabs>
        </Box>
        {tabs?.map((item, index) => (
          <TabPanel key={item} value={tab} index={index}>
            <TransactionList matches={matches} data={transactions} full />
          </TabPanel>
        ))}
      </Container>
    </Page>
  );
}

export default Transactions;
