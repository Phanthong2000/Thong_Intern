import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  MenuItem,
  Modal,
  styled,
  TextField,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '@iconify/react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { actionUserOpenEditDetail } from '../../redux/actions/userAction';

const BoxModal = styled(Card)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '500px',
  background: '#fff',
  padding: theme.spacing(2, 2, 2),
  display: 'block'
}));
const ButtonEdit = styled(IconButton)(({ theme }) => ({
  width: '40px',
  height: '40px',
  color: theme.palette.green
}));
const ButtonCancel = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  background: 'lightgrey',
  color: 'gray',
  fontSize: '16px',
  fontWeight: 'bold',
  ':hover': {
    background: 'lightgrey'
  }
}));
const ButtonSave = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  background: theme.palette.green,
  color: '#fff',
  fontSize: '16px',
  marginLeft: '20px',
  fontWeight: 'bold',
  ':hover': {
    background: theme.palette.green
  }
}));
EditDetail.prototype = {
  user: PropTypes.object
};
function EditDetail({ user }) {
  const isEditDetail = useSelector((state) => state.user.isEditDetail);
  const dispatch = useDispatch();
  const [isUniversity, setIsUniversity] = useState(false);
  const [isHighSchool, setIsHighSchool] = useState(false);
  const [isHometown, setIsHometown] = useState(false);
  const [isAddress, setIsAddress] = useState(false);
  const [isRelationship, setIsRelationship] = useState(false);
  const universityRef = useRef(user.university);
  const highSchoolRef = useRef(user.highSchool);
  const homeTownRef = useRef(user.hometown);
  const addressRef = useRef(user.address);
  const relationshipRef = useRef();
  const [relationship, setRelationship] = useState(user.relationship);
  const InputInformation = ({ value, label, ref, change, condition }) => (
    <TextField
      value={!condition ? value : null}
      fullWidth
      disabled={!condition}
      label={label}
      ref={ref}
      onChange={change}
    />
  );
  const handleSave = () => {
    const userNew = {
      ...user,
      relationship: relationship === undefined ? null : relationship,
      university:
        universityRef.current === '' || universityRef.current === undefined
          ? null
          : universityRef.current,
      highSchool:
        highSchoolRef.current === '' || highSchoolRef.current === undefined
          ? null
          : highSchoolRef.current,
      address:
        addressRef.current === '' || addressRef.current === undefined ? null : addressRef.current,
      hometown:
        homeTownRef.current === '' || homeTownRef.current === undefined ? null : homeTownRef.current
    };
    console.log(userNew);
    updateDoc(doc(db, 'users', user.id), userNew).then(() => {
      dispatch(actionUserOpenEditDetail(false));
    });
  };
  const handleChange = (e) => {
    setRelationship(e.target.value);
  };
  return (
    <Modal open={isEditDetail} onClose={() => dispatch(actionUserOpenEditDetail(false))}>
      <BoxModal>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>Edit detail</Typography>
          <IconButton
            onClick={() => dispatch(actionUserOpenEditDetail(false))}
            sx={{ background: 'lightgrey', '&:hover': { backgroundColor: '#f5f7f6' } }}
          >
            <Icon icon="eva:close-fill" />
          </IconButton>
        </Box>
        <Divider sx={{ margin: '5px 0px' }} />
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
            <InputInformation
              condition={isUniversity}
              value={user.university}
              ref={universityRef}
              label="University"
              change={(e) => (universityRef.current = e.target.value)}
            />
            {!isUniversity ? (
              <ButtonEdit
                onClick={() => {
                  universityRef.current = '';
                  setIsUniversity(true);
                }}
              >
                <Icon icon="dashicons:yes-alt" />
              </ButtonEdit>
            ) : (
              <ButtonEdit
                sx={{ color: 'red' }}
                onClick={() => {
                  universityRef.current = user.university;
                  setIsUniversity(false);
                }}
              >
                <Icon icon="jam:close-circle-f" />
              </ButtonEdit>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
            <InputInformation
              condition={isHighSchool}
              value={user.highSchool}
              ref={highSchoolRef}
              label="High school"
              change={(e) => (highSchoolRef.current = e.target.value)}
            />
            {!isHighSchool ? (
              <ButtonEdit
                onClick={() => {
                  highSchoolRef.current = '';
                  setIsHighSchool(true);
                }}
              >
                <Icon icon="dashicons:yes-alt" />
              </ButtonEdit>
            ) : (
              <ButtonEdit
                sx={{ color: 'red' }}
                onClick={() => {
                  highSchoolRef.current = user.highSchool;
                  setIsHighSchool(false);
                }}
              >
                <Icon icon="jam:close-circle-f" />
              </ButtonEdit>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
            <InputInformation
              condition={isHometown}
              value={user.hometown}
              ref={homeTownRef}
              label="From"
              change={(e) => (homeTownRef.current = e.target.value)}
            />
            {!isHometown ? (
              <ButtonEdit
                onClick={() => {
                  homeTownRef.current = '';
                  setIsHometown(true);
                }}
              >
                <Icon icon="dashicons:yes-alt" />
              </ButtonEdit>
            ) : (
              <ButtonEdit
                sx={{ color: 'red' }}
                onClick={() => {
                  homeTownRef.current = user.hometown;
                  setIsHometown(false);
                }}
              >
                <Icon icon="jam:close-circle-f" />
              </ButtonEdit>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
            <InputInformation
              condition={isAddress}
              value={user.address}
              ref={addressRef}
              label="Lives in"
              change={(e) => (addressRef.current = e.target.value)}
            />
            {!isAddress ? (
              <ButtonEdit
                onClick={() => {
                  addressRef.current = '';
                  setIsAddress(true);
                }}
              >
                <Icon icon="dashicons:yes-alt" />
              </ButtonEdit>
            ) : (
              <ButtonEdit
                sx={{ color: 'red' }}
                onClick={() => {
                  addressRef.current = user.address;
                  setIsAddress(false);
                }}
              >
                <Icon icon="jam:close-circle-f" />
              </ButtonEdit>
            )}
          </Box>
          <Box sx={{ display: 'flex', marginTop: '10px' }}>
            <TextField
              id="outlined-select-currency"
              fullWidth
              select
              value={isRelationship ? relationship : user.relationship}
              disabled={!isRelationship}
              label="Relationship"
              onChange={handleChange}
              helperText="Please select your relationship"
            >
              <MenuItem
                sx={{ background: '#fff', '&:hover': { background: '#fff' } }}
                value="Single"
              >
                Single
              </MenuItem>
              <MenuItem
                sx={{ background: '#fff', '&:hover': { background: '#fff' } }}
                value="In relationship"
              >
                In relationship
              </MenuItem>
              <MenuItem
                sx={{ background: '#fff', '&:hover': { background: '#fff' } }}
                value="Married"
              >
                Married
              </MenuItem>
            </TextField>
            {!isRelationship ? (
              <ButtonEdit sx={{ marginTop: '10px' }} onClick={() => setIsRelationship(true)}>
                <Icon icon="dashicons:yes-alt" />
              </ButtonEdit>
            ) : (
              <ButtonEdit
                sx={{ color: 'red', marginTop: '10px' }}
                onClick={() => setIsRelationship(false)}
              >
                <Icon icon="jam:close-circle-f" />
              </ButtonEdit>
            )}
          </Box>
        </Box>
        <Divider sx={{ margin: '5px 0px' }} />
        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
          <ButtonCancel onClick={() => dispatch(actionUserOpenEditDetail(false))}>
            Cancel
          </ButtonCancel>
          <ButtonSave onClick={handleSave}>Save</ButtonSave>
        </Box>
      </BoxModal>
    </Modal>
  );
}

export default EditDetail;
