import { Icon } from '@iconify/react';
import { Box, Card, InputBase, styled, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Scrollbar } from 'smooth-scrollbar-react';
import { GiphyFetch } from '@giphy/js-fetch-api';
import StickerItem from './StickerItem';
import TextItem from './TextItem';

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
const BoxText = styled(Box)(() => ({
  maxHeight: '285px',
  display: 'flex'
}));
TextMessage.prototype = {
  user: PropTypes.object,
  close: PropTypes.func
};
const giphy = new GiphyFetch(process.env.REACT_APP_GIPHY_KEY);
function TextMessage({ user, close }) {
  const [text, setText] = useState('');
  const [textSticker, setTextSticker] = useState([]);
  const [quantityTextSticker, setQuantityTextSticker] = useState(-1);
  const [isTrending, setIsTrending] = useState(true);
  const initSticker = async () => {
    const res = await giphy.animate('hello', { limit: 20 });
    setTextSticker(res.data);
    setQuantityTextSticker(textSticker.length);
    console.log(res.data);
  };
  useEffect(() => {
    initSticker();
    setQuantityTextSticker(textSticker.length);
    return () => null;
  }, [user]);
  const handleSearch = async (text) => {
    setText(text);
    if (text === '') {
      initSticker();
    } else {
      const res = await giphy.animate(text, { limit: 20 });
      setTextSticker(res.data);
      setQuantityTextSticker(textSticker.length);
    }
  };
  const BoxStickerMessage = () => {
    if (textSticker.length === 0)
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
        {textSticker.map((item, index) => (
          <TextItem user={user} close={close} key={index} url={item.url} />
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
          placeholder="Search text"
        />
      </BoxSearch>
      {isTrending && (
        <Typography sx={{ fontWeight: 'bold', fontSize: '16px', color: 'gray' }}>
          Trending
        </Typography>
      )}
      <BoxText>{quantityTextSticker >= 0 && <BoxStickerMessage />}</BoxText>
    </RootStyle>
  );
}

export default TextMessage;
