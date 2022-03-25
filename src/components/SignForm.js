import * as Yup from 'yup';
import React from 'react';
import {
  Grow,
  Card,
  Divider,
  styled,
  Typography,
  TextField,
  Stack,
  Button,
  Modal,
  Box
} from '@mui/material';
import { useFormik, Form, FormikProvider } from 'formik';
import {
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from 'firebase/auth';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { CheckCircle, Dangerous } from '@mui/icons-material';
import OtpInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase-config';
import HeaderAuth from '../layouts/HeaderAuth';

const RootStyle = styled('div')(() => ({
  height: '100%',
  width: '100%',
  position: 'absolute',
  paddingLeft: '10%',
  paddingRight: '10%',
  backgroundImage: `url(https://wallpaperaccess.com/full/2005054.jpg)`,
  backgroundRepeat: 'no-repeat'
}));
const BoxSignUp = styled(Card)(({ theme }) => ({
  background: '#fff',
  width: '50%',
  marginLeft: '25%',
  marginRight: '25%',
  textAlign: 'center',
  padding: theme.spacing(3, 0, 3),
  [theme.breakpoints.down('md')]: {
    marginLeft: '0%',
    marginRight: '0%',
    width: '100%'
  }
}));
const Separate = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(1, 10, 1)
}));
const TextSignUp = styled(Typography)(() => ({
  color: '#fff'
}));
const BoxInfoSignUp = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(1, 10, 0),
  width: '100%'
}));
const BtnSignUp = styled(Button)(({ theme }) => ({
  width: '100%',
  background: theme.palette.button
}));
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#fff',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  textAlign: 'center'
};
function SignUpForm() {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = React.useState(false);
  const [openModalOTP, setOpenModalOTP] = React.useState(false);
  const [openModalOTP2, setOpenModalOTP2] = React.useState(false);
  const [result, setResult] = React.useState(false);
  const [messageResult, setMessageResult] = React.useState('Wrong phone number');
  const [userPhone, setUserPhone] = React.useState();
  const [initialValuesState, setInitialValuesState] = React.useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [otp, setOTP] = React.useState('');
  const inputStyle = {
    width: '50px',
    height: '50px',
    color: '#4267b2',
    fontWeight: 'bold',
    fontSize: 20
  };
  const containerStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '20px'
  };
  const SignUpSchema = Yup.object().shape({
    username: Yup.string()
      .matches('^[a-zA-Z ]{1,}$', 'Username must only contain characters and ')
      .required('Username is required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .matches('^.{6,32}$', 'Password must contain 6-32 characters'),
    confirmPassword: Yup.string()
      .required('Re-password is required')
      .when('password', {
        is: (val) => !!(val && val.length > 0),
        then: Yup.string().oneOf([Yup.ref('password')], 'Both password need to be the same')
      }),
    phone: Yup.string().matches(
      '^0([0-9]{9,11})$',
      'Phone number must start 0 and contain 9-11 character'
    )
  });
  const ModalResult = () => (
    <Modal open={openModal} onClose={() => setOpenModal(false)}>
      <Box sx={style}>
        {result ? (
          <>
            <Grow in timeout={2000}>
              <CheckCircle sx={{ width: '100px', height: '100px', color: '#30ab78' }} />
            </Grow>
            <Typography id="modal-modal-title" variant="h3" sx={{ color: '#30ab78' }}>
              Success!
            </Typography>
          </>
        ) : (
          <>
            <Grow in timeout={2000}>
              <Dangerous sx={{ width: '100px', height: '100px', color: 'red' }} />
            </Grow>
            <Typography id="modal-modal-title" variant="h3" sx={{ color: 'red' }}>
              {messageResult}
            </Typography>
          </>
        )}
      </Box>
    </Modal>
  );
  const ModalOTP = () => (
    <Modal open={openModalOTP} onClose={handleCloseModalOTP}>
      <Box sx={style}>
        <Typography variant="h5">Confirm OTP</Typography>
        <Divider />
        <OtpInput
          value={otp}
          onChange={setOTP}
          numInputs={6}
          containerStyle={containerStyle}
          separator={<span style={{ fontSize: '20px' }}>-</span>}
          inputStyle={inputStyle}
          shouldAutoFocus
          isInputNum
        />
        <BtnSignUp
          onClick={() => {
            confirmOTP(userPhone);
          }}
          sx={{ marginTop: '20px' }}
        >
          <TextSignUp>Confirm</TextSignUp>
        </BtnSignUp>
      </Box>
    </Modal>
  );
  const handleCloseModalOTP = () => {
    setOpenModalOTP2(true);
  };
  const ModalOTP2 = () => (
    <Modal open={openModalOTP2} onClose={() => setOpenModalOTP2(false)}>
      <Box sx={style}>
        <Typography variant="h5">Do you want close confirm OTP</Typography>
        <Divider />
        <Stack
          sx={{
            textAlign: 'center',
            marginTop: '10px',
            width: '100%',
            display: 'flex',
            justifyContent: 'center'
          }}
          direction="row"
          spacing={3}
        >
          <Button onClick={() => setOpenModalOTP2(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setOpenModalOTP2(false);
              setOpenModalOTP(false);
            }}
            sx={{ background: 'red', color: '#fff' }}
          >
            Close
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
  const getUserByPhone = async (user) => {
    const data = await getDocs(query(collection(db, 'users'), where('phone', '==', values.phone)));
    if (data.empty) {
      createUserWithEmailAndPassword(auth, values.email, values.password)
        .then(() => {
          setUserPhone(user);
          sendOTP(`+84${values.phone.substring(1, values.phone.length)}`);
        })
        .catch((err) => {
          setOpenModal(true);
          setResult(false);
          setMessageResult('Email already exists');
          console.log('err', err);
        });
    } else {
      setOpenModal(true);
      setResult(false);
      setMessageResult('Phone number already exists');
    }
  };
  const addUsers = (user) => {
    addDoc(collection(db, 'users'), user)
      .then((docRef) => {
        if (values.email === 'phanthong2k000@gmail.com' || values.email === 'ronaldo@gmail.com') {
          setOpenModal(true);
          setResult(true);
        } else {
          getDocs(
            query(collection(db, 'users'), where('email', '==', 'phanthong2k000@gmail.com'))
          ).then((snapshots) => {
            addDoc(collection(db, 'contacts'), {
              senderId: docRef.id,
              receiverId: snapshots.docs.at(0).id,
              status: true,
              createdAt: new Date().getTime()
            });
          });
          getDocs(query(collection(db, 'users'), where('email', '==', 'ronaldo@gmail.com'))).then(
            (snapshots) => {
              addDoc(collection(db, 'contacts'), {
                receiverId: docRef.id,
                senderId: snapshots.docs.at(0).id,
                status: true,
                createdAt: new Date().getTime()
              });
            }
          );
          setOpenModal(true);
          setResult(true);
        }
      })
      .catch((err) => console.log(err));
  };
  const formik = useFormik({
    initialValues: initialValuesState,
    validationSchema: SignUpSchema,
    onSubmit: () => {
      if (values.phone === '') {
        const user = {
          username: values.username,
          email: values.email,
          password: values.password,
          phone: '',
          avatar:
            'https://media.istockphoto.com/photos/businessman-silhouette-as-avatar-or-default-profile-picture-picture-id476085198?k=20&m=476085198&s=170667a&w=0&h=FXkT-N6vISLOCUefa9MyQg0pH-6loMX9zBZjgLK458c=',
          background:
            'https://tophinhanhdep.com/wp-content/uploads/2021/10/1920X1080-HD-Nature-Wallpapers.jpg',
          isOnline: false,
          createAt: new Date().getTime()
        };
        createUserWithEmailAndPassword(auth, values.email, values.password)
          .then(() => {
            addUsers(user);
          })
          .catch(() => {
            setOpenModal(true);
            setResult(false);
            setMessageResult('Email already exists');
          });
        // getUsers();
      } else {
        const user = {
          username: values.username,
          email: values.email,
          password: values.password,
          phone: values.phone,
          avatar: 'https://huyhoanhotel.com/wp-content/uploads/2016/05/765-default-avatar.png',
          background:
            'https://tophinhanhdep.com/wp-content/uploads/2021/10/1920X1080-HD-Nature-Wallpapers.jpg',
          isOnline: false,
          createAt: new Date().getTime()
        };
        getUserByPhone(user);
      }
    }
  });
  const { errors, touched, values, handleSubmit, getFieldProps } = formik;
  const configCaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      'sign-in-button',
      {
        size: 'invisible',
        callback: () => {
          // sendOTP();
          console.log('Recaptca varified');
        },
        defaultCountry: 'IN'
      },
      auth
    );
  };
  const sendOTP = (phone) => {
    configCaptcha();
    const phoneNumber = phone;
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setOpenModalOTP(true);
      })
      .catch(() => {
        setOpenModal(true);
        setResult(false);
        setMessageResult('Wrong phone number');
      });
  };
  const confirmOTP = (user) => {
    window.confirmationResult
      .confirm(otp)
      .then(() => {
        setOpenModalOTP(false);
        addUsers(user);
        navigate.apply('/login');
      })
      .catch(() => {
        setOpenModal(true);
        setResult(false);
        setMessageResult('Wrong OTP');
      });
  };
  return (
    <RootStyle>
      <HeaderAuth />
      <BoxSignUp variant="h1">
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <div id="sign-in-button" />
            <BoxInfoSignUp spacing={2}>
              <Typography onClick={() => console.log('CC')} variant="h3">
                Welcome to Thong Intern
              </Typography>
              <Separate />
              <TextField
                fullWidth
                autoComplete="username"
                type="text"
                label="Username"
                {...getFieldProps('username')}
                error={Boolean(touched.username && errors.username)}
                helperText={touched.username && errors.username}
              />
              <TextField
                fullWidth
                autoComplete="email"
                type="text"
                label="Email"
                {...getFieldProps('email')}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
              />
              <TextField
                fullWidth
                autoComplete="password"
                type="password"
                label="Password"
                {...getFieldProps('password')}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
              />
              <TextField
                fullWidth
                autoComplete="confirmPassword"
                type="password"
                label="Re-Password"
                {...getFieldProps('confirmPassword')}
                error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                helperText={touched.confirmPassword && errors.confirmPassword}
              />
              <TextField
                fullWidth
                autoComplete="phone"
                type="text"
                label="Phone number"
                {...getFieldProps('phone')}
                error={Boolean(touched.phone && errors.phone)}
                helperText={touched.phone && errors.phone}
              />
              <BtnSignUp type="submit">
                <TextSignUp variant="h6">Sign UP</TextSignUp>
              </BtnSignUp>
            </BoxInfoSignUp>
          </Form>
        </FormikProvider>
      </BoxSignUp>
      <ModalOTP />
      <ModalOTP2 />
      <ModalResult />
    </RootStyle>
  );
}

export default SignUpForm;
