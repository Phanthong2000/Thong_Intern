import React, { useEffect, useRef, useState } from 'react';
import {
  styled,
  Card,
  Typography,
  Avatar,
  Stack,
  Button,
  Box,
  Modal,
  Divider,
  TextField,
  IconButton,
  Grid,
  Accordion,
  AccordionDetails,
  AccordionSummary
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import { keyframes } from '@emotion/react';
import { Scrollbar } from 'smooth-scrollbar-react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import {
  actionChatGetChatbox,
  actionChatOptionsChatbox,
  actionGetAllChatSort,
  actionGetChatgroupUser
} from '../../redux/actions/chatAction';
import { db, storage } from '../../firebase-config';
import { actionOpenSnackbar } from '../../redux/actions/postAction';
import backgroundChatbox from '../../asset/data/backgroundChatbox';
import Member from './Member';

const heightScreen = window.innerHeight - 1;
const RootStyle = styled(Card)(({ theme }) => ({
  width: '450px',
  maxHeight: `${heightScreen}px`,
  background: '#fff',
  marginRight: '10px',
  marginTop: '10px',
  padding: theme.spacing(1, 1, 1),
  alignItems: 'center'
}));
const AvatarChat = styled(Avatar)(() => ({
  width: '100px',
  height: '100px',
  margin: '50px 0px 0px 10px'
}));
function BoxOptionsChatbox() {
  const user = useSelector((state) => state.user.user);
  const fileRef = useRef();
  const inputRef = useRef();
  const chatbox = useSelector((state) => state.chat.chatbox);
  const [avatar, setAvatar] = useState(chatbox.avatar);
  const [loadingUpdatePhoto, setLoadingUpdatePhoto] = useState(false);
  const dispatch = useDispatch();
  const [openModalChangeName, setOpenModalChangeName] = useState(false);
  const [openModalChangeBackground, setOpenModalChangeBackground] = useState(false);
  const [openModalLeaveGroup, setOpenModalLeaveGroup] = useState(false);
  const [openModalDeleteGroup, setOpenModalDeleteGroup] = useState(false);
  const socketRef = useRef();
  const socket = useSelector((state) => state.call.socket);
  const usersSocket = useSelector((state) => state.user.usersSocket);
  useEffect(() => {
    console.log('');
    return () => dispatch(actionChatOptionsChatbox(false));
  }, []);
  const ButtonOption = ({ name, icon, click }) => {
    const ItemOption = styled(Button)(() => ({
      width: '100%',
      textTransform: 'none',
      color: '#000',
      justifyContent: 'start',
      height: '50px'
    }));
    return (
      <ItemOption
        onClick={click}
        startIcon={<Icon style={{ width: '25px', height: '25px' }} icon={icon} />}
      >
        <Typography sx={{ fontFamily: 'inherit', fontSize: '18px' }}>{name}</Typography>
      </ItemOption>
    );
  };
  const ModalChangeName = () => {
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
    const ButtonCancel = styled(Button)(({ theme }) => ({
      textTransform: 'none',
      color: '#000',
      background: theme.palette.background,
      fontWeight: 'bold',
      fontSize: '16px',
      padding: theme.spacing(0.5, 2, 0.5),
      marginRight: '10px'
    }));
    const ButtonSave = styled(Button)(({ theme }) => ({
      padding: theme.spacing(0.5, 2, 0.5),
      background: theme.palette.green,
      textTransform: 'none',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '16px'
    }));
    const cancelChangeName = () => {
      setOpenModalChangeName(false);
    };

    const saveChangeName = () => {
      socketRef.current = socket;
      const socketIds = [];
      chatbox.members.forEach((member) => {
        const userCall = usersSocket.find((user) => user.userId === member);
        if (userCall !== undefined && userCall.userId !== user.id) socketIds.push(userCall);
      });
      dispatch(
        actionChatGetChatbox({
          ...chatbox,
          name: inputRef.current,
          type: 'group'
        })
      );
      socketRef.current.emit('changeNameGroup', {
        ...chatbox,
        name: inputRef.current,
        type: 'group',
        socketIds
      });
      // updateDoc(doc(db, 'chatboxs', chatbox.id), {
      //   ...chatbox,
      //   name: inputRef.current,
      //   updatedAt: new Date().getTime()
      // }).then(() => {
      //   const message = {
      //     content: `${user.username} change name group`,
      //     type: 'note',
      //     senderId: user.id,
      //     chatboxId: chatbox.id,
      //     isRead: false,
      //     isRestore: false,
      //     reaction: [],
      //     createdAt: new Date().getTime()
      //   };
      //   addDoc(collection(db, 'messages'), message).then(() => {
      //     dispatch(actionGetAllChatSort(user.id));
      //     dispatch(actionGetChatgroupUser(user.id));
      //     dispatch(
      //       actionChatGetChatbox({
      //         ...chatbox,
      //         name: inputRef.current,
      //         type: 'group'
      //       })
      //     );
      //     setOpenModalChangeName(false);
      //   });
      // });
    };
    return (
      <Modal open={openModalChangeName} onClose={() => setOpenModalChangeName(false)}>
        <BoxModal>
          <Box>
            <Typography sx={{ fontWeight: 'bold', fontSize: '20px', fontFamily: 'inherit' }}>
              Change chat name
            </Typography>
          </Box>
          <Divider sx={{ margin: '10px 0px' }} />
          <Typography>Changing the name of a group chat changes it for everyone.</Typography>
          <TextField
            fullWidth
            onChange={(e) => (inputRef.current = e.target.value)}
            sx={{ marginTop: '5px' }}
            id="outlined-basic"
            label="Chat name"
            variant="outlined"
          />
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end', marginTop: '10px' }}
          >
            <ButtonCancel onClick={cancelChangeName}>Cancel</ButtonCancel>
            <ButtonSave onClick={saveChangeName}>Save</ButtonSave>
          </Box>
        </BoxModal>
      </Modal>
    );
  };
  const ModalChangeBackground = () => {
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
    const gradient = keyframes`
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
    `;
    return (
      <Modal open={openModalChangeBackground} onClose={() => setOpenModalChangeBackground(false)}>
        <BoxModal>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: '20px', fontFamily: 'inherit' }}>
              Change background
            </Typography>
            <IconButton
              onClick={() => setOpenModalChangeBackground(false)}
              sx={{ background: 'lightgrey', '&:hover': { backgroundColor: '#f5f7f6' } }}
            >
              <Icon icon="eva:close-fill" />
            </IconButton>
          </Box>
          <Divider sx={{ margin: '10px 0px' }} />
          <Grid container sx={{ width: '100%' }}>
            {backgroundChatbox.map((item, index) => {
              const chooseBackground = () => {
                updateDoc(doc(db, 'chatboxs', chatbox.id), {
                  ...chatbox,
                  background: item.color,
                  updatedAt: new Date().getTime()
                }).then(() => {
                  const message = {
                    content: `${user.username} change background group`,
                    type: 'note',
                    senderId: user.id,
                    chatboxId: chatbox.id,
                    isRead: false,
                    isRestore: false,
                    reaction: [],
                    createdAt: new Date().getTime()
                  };
                  addDoc(collection(db, 'messages'), message).then(() => {
                    dispatch(actionGetAllChatSort(user.id));
                    dispatch(actionGetChatgroupUser(user.id));
                    dispatch(
                      actionChatGetChatbox({
                        ...chatbox,
                        background: item.color,
                        type: 'group'
                      })
                    );
                    setOpenModalChangeBackground(false);
                  });
                });
              };
              return (
                <Grid
                  sx={{ textAlign: 'center', padding: '5px' }}
                  key={index}
                  item
                  xs={4}
                  sm={4}
                  md={4}
                  lg={4}
                  xl={4}
                >
                  <IconButton
                    onClick={chooseBackground}
                    sx={{
                      background: item.color,
                      width: '100px',
                      height: '100px',
                      animation: `${gradient} 15s ease infinite`,
                      backgroundSize: `400% 400%`
                    }}
                  />
                </Grid>
              );
            })}
          </Grid>
        </BoxModal>
      </Modal>
    );
  };
  const ModalLeaveGroup = () => {
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
    const ButtonCancel = styled(Button)(({ theme }) => ({
      textTransform: 'none',
      color: '#000',
      background: theme.palette.background,
      fontWeight: 'bold',
      fontSize: '16px',
      padding: theme.spacing(0.5, 2, 0.5),
      marginRight: '10px'
    }));
    const ButtonConfirm = styled(Button)(({ theme }) => ({
      padding: theme.spacing(0.5, 2, 0.5),
      background: theme.palette.green,
      textTransform: 'none',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '16px'
    }));
    return (
      <Modal open={openModalLeaveGroup} onClose={() => setOpenModalLeaveGroup(false)}>
        <BoxModal>
          <Box>
            <Typography sx={{ fontWeight: 'bold', fontSize: '20px' }}>Leave group</Typography>
          </Box>
          <Divider sx={{ margin: '10px 0px' }} />
          <Typography sx={{ fontSize: '18px' }}>Do you want leave group</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
            <ButtonCancel onClick={() => setOpenModalLeaveGroup(false)}>Cancel</ButtonCancel>
            <ButtonConfirm onClick={leaveGroup}>Confirm</ButtonConfirm>
          </Box>
        </BoxModal>
      </Modal>
    );
  };
  const ModalDeleteGroup = () => {
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
    const ButtonCancel = styled(Button)(({ theme }) => ({
      textTransform: 'none',
      color: '#000',
      background: theme.palette.background,
      fontWeight: 'bold',
      fontSize: '16px',
      padding: theme.spacing(0.5, 2, 0.5),
      marginRight: '10px'
    }));
    const ButtonConfirm = styled(Button)(({ theme }) => ({
      padding: theme.spacing(0.5, 2, 0.5),
      background: theme.palette.green,
      textTransform: 'none',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '16px'
    }));
    return (
      <Modal open={openModalDeleteGroup} onClose={() => setOpenModalDeleteGroup(false)}>
        <BoxModal>
          <Box>
            <Typography sx={{ fontWeight: 'bold', fontSize: '20px' }}>Delete group</Typography>
          </Box>
          <Divider sx={{ margin: '10px 0px' }} />
          <Typography sx={{ fontSize: '18px' }}>Do you want delete group</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
            <ButtonCancel onClick={() => setOpenModalDeleteGroup(false)}>Cancel</ButtonCancel>
            <ButtonConfirm onClick={deleteGroup}>Confirm</ButtonConfirm>
          </Box>
        </BoxModal>
      </Modal>
    );
  };
  const onChangeFile = (files) => {
    if (files && files[0]) {
      if (files[0].size < 2097152) {
        setLoadingUpdatePhoto(true);
        const metadata = {
          contentType: 'image/*'
        };
        const storageRef = ref(storage, `chatbox/${user.id}.${new Date().getTime()}`);
        const uploadTask = uploadBytesResumable(storageRef, files[0], metadata);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            switch (snapshot.state) {
              case 'running':
                break;
              default:
                console.log('ok');
                break;
            }
          },
          (error) => {
            console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              updateDoc(doc(db, 'chatboxs', chatbox.id), {
                ...chatbox,
                avatar: downloadURL,
                updatedAt: new Date().getTime()
              }).then(() => {
                const message = {
                  content: `${user.username} changed photo chat`,
                  type: 'note',
                  senderId: user.id,
                  chatboxId: chatbox.id,
                  isRead: false,
                  isRestore: false,
                  reaction: [],
                  createdAt: new Date().getTime()
                };
                addDoc(collection(db, 'messages'), message).then(() => {
                  setLoadingUpdatePhoto(false);
                  dispatch(
                    actionChatGetChatbox({
                      ...chatbox,
                      avatar: URL.createObjectURL(files[0]),
                      type: 'group'
                    })
                  );
                  dispatch(actionGetAllChatSort(user.id));
                });
              });
            });
          }
        );
      } else {
        dispatch(
          actionOpenSnackbar({
            status: true,
            content: 'Photo must less than 2MB',
            type: 'error'
          })
        );
      }
    }
  };
  const leaveGroup = () => {
    const memberNew = chatbox.members.filter((member) => member !== user.id);
    const chatgroupNew = {
      ...chatbox,
      members: memberNew,
      updatedAt: new Date().getTime(),
      userId: memberNew.at(0),
      tempId: memberNew.at(0)
    };
    updateDoc(doc(db, 'chatboxs', chatbox.id), chatgroupNew).then(() => {
      const message = {
        content: `${user.username} leaved group`,
        type: 'note',
        senderId: user.id,
        chatboxId: chatbox.id,
        isRead: false,
        isRestore: false,
        reaction: [],
        createdAt: new Date().getTime()
      };
      addDoc(collection(db, 'messages'), message).then(() => {
        window.location.reload();
      });
    });
  };
  const deleteGroup = () => {
    deleteDoc(doc(db, 'chatboxs', chatbox.id)).then(() => {
      window.location.reload();
    });
  };
  if (chatbox.type === 'group')
    return (
      <RootStyle>
        <Stack
          sx={{
            width: '100%',
            alignItems: 'center',
            maxHeight: `${heightScreen}px`,
            display: 'flex'
          }}
        >
          <Scrollbar>
            {loadingUpdatePhoto ? (
              <IconButton sx={{ width: '100px', height: '100px', margin: '50px 0px 0px 10px' }}>
                <Icon sx={{ width: '100px', height: '100px' }} icon="eos-icons:loading" />
              </IconButton>
            ) : (
              <AvatarChat src={chatbox.avatar} />
            )}
            <Typography
              sx={{
                fontWeight: 'bold',
                fontFamily: 'inherit',
                fontSize: '18px',
                marginBottom: '10px'
              }}
            >
              {chatbox.name}
            </Typography>
            <ButtonOption
              click={() => setOpenModalChangeName(true)}
              name="Change chat name"
              icon="bytesize:edit"
            />
            <ButtonOption
              click={() => fileRef.current.click()}
              name="Change photo"
              icon="ion:image-outline"
            />
            <ButtonOption
              click={() => setOpenModalChangeBackground(true)}
              name="Change background"
              icon="foundation:background-color"
            />
            <Accordion sx={{ width: '100%', boxShadow: 0 }}>
              <AccordionSummary
                aria-controls="panel1d-content"
                id="panel1d-header"
                expandIcon={<ExpandMore />}
              >
                <Typography sx={{ fontFamily: 'inherit', fontSize: '18px', marginLeft: '10px' }}>
                  Members
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {chatbox.members.map((item, index) => (
                  <Member user={user} key={index} memberId={item} userId={chatbox.userId} />
                ))}
                <Button
                  sx={{
                    color: '#000',
                    textTransform: 'none',
                    width: '100%',
                    justifyContent: 'start',
                    marginTop: '5px'
                  }}
                >
                  <Icon
                    style={{ width: '30px', height: '30px', color: 'gray' }}
                    icon="bi:plus-circle-fill"
                  />
                  <Typography sx={{ marginLeft: '10px', fontWeight: 'bold' }}>
                    Add people
                  </Typography>
                </Button>
              </AccordionDetails>
            </Accordion>
            <ButtonOption
              click={() => setOpenModalLeaveGroup(true)}
              name="Leave group"
              icon="tabler:logout"
            />
            {user.id === chatbox.userId && (
              <ButtonOption
                click={() => setOpenModalDeleteGroup(true)}
                name="Delete group"
                icon="fluent:delete-16-regular"
              />
            )}{' '}
          </Scrollbar>
        </Stack>

        <input
          onClick={(e) => {
            e.target.value = null;
          }}
          accept=".png, .jpg, .jpeg"
          onChange={(e) => onChangeFile(e.target.files)}
          ref={fileRef}
          style={{ display: 'none' }}
          type="file"
        />
        <ModalChangeName />
        <ModalChangeBackground />
        <ModalLeaveGroup />
        <ModalDeleteGroup />
      </RootStyle>
    );
  return (
    <RootStyle>
      <Typography>cc</Typography>
    </RootStyle>
  );
}

export default BoxOptionsChatbox;
