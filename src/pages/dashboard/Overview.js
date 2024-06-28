import PropType from 'prop-types'
import { useEffect, useState } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled } from '@mui/material/styles'
import { sentenceCase } from 'change-case'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
// components
import { Box } from '@mui/material'
import { Toaster } from 'react-hot-toast'
import LoanCard from '../../components/cards/LoanCard'
import Page from '../../components/Page'
import Advert from '../../components/advert'
import TransactionList from '../../components/list/TransactionList'
import Spacer from '../../components/spacer'
import { useSWRFetch } from '../../hooks'

const ColoredTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === 'light' ? theme.palette.primary.darker : theme.palette.primary.lighter,
}))

function Overview (props) {
  const { profile } = props
  const matches = useMediaQuery(theme => theme.breakpoints.up('sm'))
  const [transactions, setTransactions] = useState([])

  // const { data } = useSWRFetch('transaction/single');
  const { data } = useSWRFetch('/transaction/single')

  useEffect(() => {
    if (data) {
      setTransactions(data)
    }
  }, [data])


  return (
    <Page title='Overview'>
      <Container maxWidth='xl'>
        <ColoredTypography variant='h3' sx={{ mb: 3 }}>
          Hello {sentenceCase(profile?.firstName)},
        </ColoredTypography>
        <Grid container spacing={2} height={'75vh'} >
          <Grid item sm={8} xs={12} height={'100%'} >
            <Box display="flex" flexDirection="column" >
              <LoanCard matches={matches} profile={profile} />
              <Spacer size={2} />
              <TransactionList matches={matches} data={transactions} />
            </Box>
          </Grid>

          <Grid item sm={4} xs={12} height={'100%'}>
            <Advert
              title={['Personal loan!', 'Coming soon']}
              featuredImage={'/static/images/home_banner.jpeg'}
              textColor='white'
              overlay
              height={'100%'}
            />
          </Grid>
        </Grid>
      </Container>
      <Toaster />
    </Page>
  )
}
export default Overview

Overview.propTypes = {
  profile: PropType.object,
}
