import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// routes
import { Toaster, toast } from 'react-hot-toast'
// import io from 'socket.io-client'
import Router from './routes'
// theme
import ThemeProvider from './theme'
// components
import ScrollToTop from './components/ScrollToTop'
import { useProfile } from './hooks'
import { setAuth, setProfile, updateProfile, logOut } from './store/reducer/auth'
import socket from './utils/socket'
import { setLoading } from './store/reducer/lifeCycle'
import useCompany from './hooks/useCompany'
import { setCompanies } from './store/reducer/company'
import useSettings from './hooks/useSettings'
import { setSettings } from './store/reducer/settings'
// import { baseURL } from './utils/axios'

function App () {
  const { isAuth, profile } = useSelector(state => state.auth)
  const { loading } = useSelector(state => state.lifeCycle)
  const { data, loggedOut, loading: dataLoading, mutate: profileMutate } = useProfile()
  const { data: settingsData } = useSettings()
  const { data: companyData } = useCompany()
  const dispatch = useDispatch()
  // let socketClient

  const handl = useCallback(() => {
    if (isAuth && profile) {
      if (document.visibilityState === 'hidden') {
        // Send to server
        console.log('LEFT TAB JUST NOW !!')
        socket?.emit('left-tab', { userId: profile?.id, email: profile?.emailAddress })
      } else {
        console.log('CAME BACK JUST NOW !!')
        socket?.emit('back-to-tab', { userId: profile?.id, email: profile?.emailAddress })
      }
    }
  }, [isAuth, profile])

  useEffect(() => {
    // socketClient = io(baseURL)
    // socketClient.emit("setup", profile);
    // socketClient.on("userConnected", () => setSocketConnected(true));
    // socketClient.on("typing", () => setIsTyping(true));
    // socketClient.on("stop typing", () => setIsTyping(false));
  }, [])

  useEffect(() => {
    if (socket) {
      socket?.on('connect', () => {
        console.log('SOCKET ID :: ', socket.id) // x8WIv7-mJelg7on_ALbx
      })

      if (isAuth && profile) {
        socket?.emit('setup', profile)

        socket?.on('logout-user', data => {
          console.log('USER TO LOGOUT ::: ', data) // x8WIv7-mJelg7on_ALbx
          // alert("LOG OUT NOW!!! ");
          if (data?.email === profile?.emailAddress) {
            dispatch(setAuth(false))
            dispatch(setProfile(null))
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
          }
        })
      }
    }
    // return () => socketClient?.disconnect()
  }, [dispatch, isAuth, profile])

  useEffect(() => {
    document.addEventListener('visibilitychange', handl)

    return () => {
      document.removeEventListener('visibilitychange', handl)
    }
  }, [handl])

  useEffect(() => {
    dispatch(setLoading(dataLoading))

    if (data) {
      // handle account status here

      if (data?.accountStatus === 'frozen') {
        console.log('ACCOUNT FROZEN ', data?.accountStatus)
        toast.error('Your account is currently frozen!')
        dispatch(logOut)
        dispatch(setAuth(false))
        dispatch(setProfile(null))
      } else {
        dispatch(setLoading(false))
        dispatch(setProfile(data))
        dispatch(setAuth(true))
      }

      socket?.on(`${data?.id}-user-updated`, payload => {
        dispatch(setProfile(payload))
      })
      socket?.on(`${data?.id}-loan-updated`, payload => {
        // console.log('payload', payload);
        dispatch(
          updateProfile({
            key: 'loan',
            value: payload,
          })
        )
      })
    }

    if (companyData) {
      dispatch(setCompanies(companyData?.docs))
    }

    if (settingsData) {
      dispatch(setSettings(settingsData?.docs[0]))
    }

    if (loggedOut) {
      dispatch(setAuth(false))
      dispatch(setProfile(null))
    }
    // console.log(loggedOut);
  }, [data, loggedOut, dataLoading, dispatch, companyData, settingsData])

  return (
    <ThemeProvider>
      <ScrollToTop />
      <Router isAuth={isAuth} profile={profile} profileMutate={profileMutate} loading={loading} />
    </ThemeProvider>
  )
}

export default App
