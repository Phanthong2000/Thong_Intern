import { Icon } from '@iconify/react';
import { Box, Card, InputBase, styled, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Scrollbar } from 'smooth-scrollbar-react';
import { useSelector } from 'react-redux';
import GifItem from './GifItem';

const RootStyle = styled(Card)(() => ({
  background: '#fff',
  width: '300px',
  height: '300px'
}));
const BoxSearch = styled(Box)(({ theme }) => ({
  background: 'lightgrey',
  width: '90%',
  display: 'flex',
  alignItems: 'center',
  height: '35px',
  borderRadius: '30px',
  padding: theme.spacing(0, 1, 0),
  margin: `5px 0px 5px 5%`
}));
const InputSearch = styled(InputBase)(() => ({
  width: '80%',
  marginLeft: '5px'
}));
const BoxGif = styled(Box)(() => ({
  maxHeight: '235px',
  display: 'flex'
}));
GifMessage.prototype = {
  close: PropTypes.func,
  type: PropTypes.string
};
function GifMessage({ close, type }) {
  const user = useSelector((state) => state.user.user);
  const [text, setText] = useState('');
  const [gif, setGif] = useState([]);
  const [quantityGif, setQuantityGif] = useState(-1);
  const [isTrending, setIsTrending] = useState(true);
  const initGif = async () => {
    fetch(
      `https://api.giphy.com/v1/gifs/trending?api_key=${process.env.REACT_APP_GIPHY_KEY}&limit=20`
    )
      .then((res) => res.json())
      .then((resJson) => {
        setGif(resJson.data);
        setIsTrending(true);
      });
  };
  useEffect(() => {
    initGif();
    setQuantityGif(gif.length);
    return () => null;
  }, [user]);
  const handleSearch = async (text) => {
    setText(text);
    if (text === '') {
      initGif();
    } else {
      fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${process.env.REACT_APP_GIPHY_KEY}&q=${text}&limit=20`
      )
        .then((res) => res.json())
        .then((resJson) => {
          setGif(resJson.data);
          setIsTrending(false);
        });
    }
  };
  const BoxGifMessage = () => {
    if (gif.length === 0)
      return (
        <Box sx={{ width: '100%', textAlign: 'center', marginTop: '50px' }}>
          <Icon
            style={{ width: '50px', height: '50px', color: 'lightgrey' }}
            icon="eos-icons:loading"
          />
          ;
        </Box>
      );
    return (
      <Scrollbar>
        {gif.map((item, index) => (
          <GifItem type={type} close={close} key={index} url={item.images.downsized.url} />
        ))}
      </Scrollbar>
    );
  };
  return (
    <RootStyle>
      <BoxSearch>
        <Icon icon="ant-design:search-outlined" />
        <InputSearch
          value={text}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search gif"
        />
      </BoxSearch>
      {isTrending && (
        <Typography sx={{ fontWeight: 'bold', fontSize: '16px', color: 'gray' }}>
          Trending
        </Typography>
      )}
      <BoxGif>{quantityGif >= 0 && <BoxGifMessage />}</BoxGif>
    </RootStyle>
  );
}

export default GifMessage;
