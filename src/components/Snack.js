import React, { useEffect } from 'react';
import { Alert, Snackbar, styled, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { actionCloseSnackbar } from '../redux/actions/postAction';

function Snack() {
  const snackbar = useSelector((state) => state.post.snackbar);
  const dispatch = useDispatch();
  return (
    <Snackbar
      open={snackbar.status}
      autoHideDuration={3000}
      onClose={() => dispatch(actionCloseSnackbar())}
    >
      <Alert severity={snackbar.type} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ fontWeight: 'bold' }}>{snackbar.content}</Typography>
      </Alert>
    </Snackbar>
  );
}

export default Snack;
