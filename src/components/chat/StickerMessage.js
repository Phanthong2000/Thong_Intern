import { Icon } from '@iconify/react';
import { Box, Card, InputBase, styled, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Scrollbar } from 'smooth-scrollbar-react';
import { GiphyFetch } from '@giphy/js-fetch-api';
import StickerItem from './StickerItem';

const RootStyle = styled(Card)(() => ({
  background: '#fff',
  width: '300px',
  height: '350px'
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
const BoxSticker = styled(Box)(() => ({
  maxHeight: '285px',
  display: 'flex'
}));
StickerMessage.prototype = {
  user: PropTypes.object,
  close: PropTypes.func,
  type: PropTypes.string
};
function StickerMessage({ user, close, type }) {
  const [text, setText] = useState('');
  const [sticker, setSticker] = useState([]);
  const [quantitySticker, setQuantitySticker] = useState(-1);
  const [isTrending, setIsTrending] = useState(true);
  const initSticker = async () => {
    fetch(
      `https://api.giphy.com/v1/stickers/trending?api_key=${process.env.REACT_APP_GIPHY_KEY}&limit=20`
    )
      .then((res) => res.json())
      .then((resJson) => {
        setSticker(resJson.data);
        setIsTrending(true);
      });
  };
  useEffect(() => {
    initSticker();
    setQuantitySticker(sticker.length);
    return () => null;
  }, [user]);
  const handleSearch = async (text) => {
    setText(text);
    if (text === '') {
      initSticker();
    } else {
      fetch(
        `https://api.giphy.com/v1/stickers/search?api_key=${process.env.REACT_APP_GIPHY_KEY}&q=${text}&limit=20`
      )
        .then((res) => res.json())
        .then((resJson) => {
          setSticker(resJson.data);
          setIsTrending(false);
        });
    }
  };
  const BoxStickerMessage = () => {
    if (sticker.length === 0)
      return (
        <Box sx={{ width: '100%', textAlign: 'center', marginTop: '50px' }}>
          <Icon
            style={{ width: '50px', height: '50px', color: 'lightgrey' }}
            icon="eos-icons:loading"
          />
        </Box>
      );
    return (
      <Scrollbar>
        {sticker.map((item, index) => (
          <StickerItem
            type={type}
            user={user}
            close={close}
            key={index}
            url={item.images.downsized.url}
          />
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
          placeholder="Search sticker"
        />
      </BoxSearch>
      {isTrending && (
        <Typography sx={{ fontWeight: 'bold', fontSize: '16px', color: 'gray' }}>
          Trending
        </Typography>
      )}
      <BoxSticker>{quantitySticker >= 0 && <BoxStickerMessage />}</BoxSticker>
    </RootStyle>
  );
}

export default StickerMessage;
