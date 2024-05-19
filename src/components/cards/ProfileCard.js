/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from 'react';
import { capitalCase } from 'change-case';
import { styled } from '@mui/material/styles';
import { Toaster } from 'react-hot-toast';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
// import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
// import APIService from '../../service';
// import bgImg from '';

const StyledCard = styled(Card)(() => ({
  height: '100%',
  backgroundColor: "#18113c",
  padding: 0,
  borderColor: "#18113c",
}));

const ContentBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
}));

const BackgroundBox = styled(Box)(() => ({
  height: 100,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPositionY: 'center',
  backgroundColor: "#18113c"
}));

const ColoredTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.mode === 'light' ? theme.palette.primary.darker : theme.palette.primary.lighter,
  fontWeight: 'bolder',
  textTransform: 'capitalize',
}));

// const HiddenInput = styled('input')(({ theme }) => ({
//   display: 'none',
// }));

function ProfileCard(props) {
  const { profile, mutate } = props;
  const [progress, setProgress] = useState(0);
  // const [loading, setLoading] = useState(0);
  const [selectedFile, setSelectedFile] = useState(profile?.photoUrl);

  // const handleUpload = async (e) => {
  //   const file = e.target.files[0];
  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);

  //   reader.onloadend = (e) => {
  //     setSelectedFile(reader.result);
  //   };

  //   const formData = new FormData();
  //   formData.append('image', file);

  //   const uploaded = await APIService.post('/media/upload?type=user', formData, {
  //     onUploadProgress: (evt) => {
  //       setProgress(Math.round((100 * evt.loaded) / evt.total));
  //     },
  //   });

  //   const response = APIService.update('/auth', 'update', { photoUrl: uploaded.data?.url });
  //   toast.promise(response, {
  //     loading: 'Updating profile photo...',
  //     success: () => {
  //       setLoading(false);
  //       mutate('/auth/profile');
  //       return 'Profile Picture Updated Successfully!';
  //     },
  //     error: (err) => {
  //       setLoading(false);
  //       return err?.response?.data?.message || err?.message || 'Something went wrong, try again.';
  //     },
  //   });
  // };

  return (
    <StyledCard variant="outlined">
      <CardContent sx={{ padding: 0, paddingBottom: '0px !important' }}>
        <BackgroundBox />
        <LinearProgress variant="determinate" color='info' value={progress} />
        <ContentBox>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <div>
                {/* <HiddenInput accept="image/*" id="profile-image-file" type="file" onChange={handleUpload} /> */}
                <label htmlFor="profile-image-file">
                  <Avatar
                    src={selectedFile}
                    alt={capitalCase(profile?.firstName?.charAt(0)) || 'A'}
                    sx={{ width: 50, height: 50 }}
                    imgProps={{
                      crossOrigin: 'anonymous',
                    }}
                  />
                </label>
              </div>
              <ColoredTypography variant="h4" sx={{ marginLeft: 1 }}>
                {profile?.fullName}
              </ColoredTypography>
            </Box>
            {/* <label htmlFor="profile-image-file">
              <Button variant="contained" component="span">
                Change Profile Photo
              </Button>
            </label> */}
          </Stack>
        </ContentBox>
      </CardContent>
      <Toaster />
    </StyledCard>
  );
}

export default ProfileCard;
