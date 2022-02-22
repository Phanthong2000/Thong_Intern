import { Icon } from '@iconify/react';
import { Box, Card, InputBase, styled, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { Scrollbar } from 'smooth-scrollbar-react';
import React, { useEffect, useState } from 'react';
import { GiphyFetch } from '@giphy/js-fetch-api';
import StickerItem from './StickerItem';
import EmojiItem from './EmojiItem';

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
const BoxEmoji = styled(Box)(() => ({
  maxHeight: '285px',
  display: 'flex'
}));
EmojiMessage.prototype = {
  user: PropTypes.object,
  close: PropTypes.func,
  type: PropTypes.string
};
const giphy = new GiphyFetch(process.env.REACT_APP_GIPHY_KEY);
function EmojiMessage({ user, close, type }) {
  const [text, setText] = useState('');
  const [emoji, setEmoji] = useState([]);
  const [quantityEmoji, setQuantityEmoji] = useState(-1);
  const [isTrending, setIsTrending] = useState(true);
  const initEmoji = async () => {
    const res = await giphy.emoji('haha', { offset: 0, limit: 30 });
    setEmoji(res.data);
  };
  useEffect(() => {
    initEmoji();
    setQuantityEmoji(emoji.length);
    return () => null;
  }, [user]);
  const handleSearch = async (text) => {
    setText(text);
    if (text === '') {
      initEmoji();
    } else {
      const res = await giphy.emoji(text, { offset: 0, limit: 30 });
      setEmoji(res.data);
    }
  };
  const BoxEmojiMessage = () => {
    if (emoji.length === 0)
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
        {emoji.map((item, index) => (
          <EmojiItem
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
          placeholder="Search emoji"
        />
      </BoxSearch>
      {isTrending && (
        <Typography sx={{ fontWeight: 'bold', fontSize: '16px', color: 'gray' }}>
          Trending
        </Typography>
      )}
      <BoxEmoji>{quantityEmoji >= 0 && <BoxEmojiMessage />}</BoxEmoji>
    </RootStyle>
  );
}

export default EmojiMessage;
