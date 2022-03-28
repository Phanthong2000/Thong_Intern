import React, { useEffect } from 'react';
import { Box, Button, Card, Divider, IconButton, styled, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { Scrollbar } from 'smooth-scrollbar-react';
import PageItem from '../components/page/PageItem';
import OptionPage from '../components/page/OptionPage';
import pageConfig from '../components/page/pageConfig';

const heightScreen = window.innerHeight - 1;
const RootStyle = styled(Box)(({ theme }) => ({
  width: '100%',
  background: theme.palette.background,
  minHeight: `${heightScreen - 60}px`,
  marginTop: '60px',
  display: 'flex',
  padding: '0px 10px'
}));
const BoxLeft = styled(Card)(() => ({
  width: '350px',
  background: '#fff',
  minHeight: `${heightScreen - 60}px`,
  maxHeight: `${heightScreen - 60}px`,
  padding: '10px',
  display: 'flex',
  position: 'fixed'
}));
const BoxTitle = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}));
const ButtonCreateGroup = styled(Button)(({ theme }) => ({
  width: '100%',
  marginTop: '10px',
  textTransform: 'capitalize',
  background: '#eafae6',
  color: theme.palette.green,
  fontFamily: 'sans-serif',
  padding: '7px 0px'
}));
const BoxRight = styled(Box)(({ theme }) => ({
  width: `calc(100% - 350px)`,
  marginLeft: '350px'
}));
Page.prototype = {
  user: PropTypes.object
};
function Page({ user }) {
  const yourPages = useSelector((state) => state.page.yourPages);
  const navigate = useNavigate();
  useEffect(() => {
    document.title = 'Pages | Thong Intern';
    return () => null;
  }, [user]);
  const BoxYourPage = () => {
    const YourPage = styled(Box)(({ theme }) => ({
      width: '100%'
    }));
    return (
      <YourPage>
        <Typography
          sx={{
            marginTop: '10px',
            display: 'flex',
            fontFamily: 'sans-serif',
            color: 'gray',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Your page
        </Typography>
        {yourPages.map((item, index) => (
          <PageItem key={index} page={item} />
        ))}
      </YourPage>
    );
  };
  return (
    <RootStyle>
      <BoxLeft>
        <Scrollbar alwaysShowTracks>
          <BoxTitle>
            <Typography sx={{ fontWeight: 'bold', fontSize: '20px', fontFamily: 'sans-serif' }}>
              Pages
            </Typography>
            <IconButton>
              <Icon icon="ant-design:setting-filled" />
            </IconButton>
          </BoxTitle>
          <BoxYourPage />
          <ButtonCreateGroup onClick={() => navigate('/home/pages/create-page')}>
            Create page
          </ButtonCreateGroup>
          <Divider sx={{ margin: `10px 0px` }} />
          <Box>
            {pageConfig.map((item, index) => (
              <OptionPage option={item} key={index} />
            ))}
          </Box>
        </Scrollbar>
      </BoxLeft>
      <BoxRight>
        <Outlet />
      </BoxRight>
    </RootStyle>
  );
}

export default Page;
