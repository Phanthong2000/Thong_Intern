import * as Yup from 'yup';
import React from 'react';
import { Box, Card, Divider, styled, Typography, TextField, Stack, Button } from '@mui/material';
import { useFormik, Form, FormikProvider } from 'formik';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase-config';
import HeaderAuth from '../layouts/HeaderAuth';
import google from '../asset/images/google.png';
import facebook from '../asset/images/facebook.png';

const RootStyle = styled('div')(({ theme }) => ({
  height: '100%',
  width: '100%',
  position: 'absolute',
  paddingLeft: '10%',
  paddingRight: '10%',
  backgroundImage: `url(https://wallpaperaccess.com/full/2005054.jpg)`,
  backgroundRepeat: 'no-repeat'
}));
const BoxLogin = styled(Card)(({ theme }) => ({
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
const TextLogin = styled(Typography)(({ theme }) => ({
  color: '#fff'
}));
const BoxWayLogin = styled(Stack)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1, 10, 0),
  display: 'flex',
  justifyContent: 'space-between'
}));
const ButtonWayLogin = styled(Button)(({ theme }) => ({
  width: '50%',
  color: theme.palette.green
}));
const BoxInfoLogin = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(1, 10, 0),
  width: '100%'
}));
const BtnLogin = styled(Button)(({ theme }) => ({
  width: '100%',
  background: theme.palette.button
}));
const ForgotPassword = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.green
}));
const GoogleLogin = styled(Button)(({ theme }) => ({
  width: '50%',
  color: '#30ab78'
}));
const IconLogin = styled('img')(({ theme }) => ({
  width: '30px',
  height: '30px',
  marginRight: '10px'
}));
function LoginForm() {
  const [wayLogin, setWayLogin] = React.useState('email');
  const [loginFail, setLoginFail] = React.useState('');
  const [initialValuesState, setInitialValuesState] = React.useState({
    email: '',
    password: '',
    phone: ''
  });
  const LoginSchema =
    wayLogin === 'email'
      ? Yup.object().shape({
          email: Yup.string()
            .email('Email must be a valid email address')
            .required('Email is required'),
          password: Yup.string()
            .required('Password is required')
            .matches('^.{6,32}$', 'Password must contain 6-32 characters')
        })
      : Yup.object().shape({
          password: Yup.string()
            .required('Password is required')
            .matches('^.{6,32}$', 'Password must contain 6-32 characters'),
          phone: Yup.string()
            .required('Phone number is required')
            .matches('^0([0-9]{9,11})$', 'Phone number must start 0 and contain 9-11 character')
        });
  const formik = useFormik({
    initialValues: initialValuesState,
    validationSchema: LoginSchema,
    onSubmit: () => {
      if (wayLogin === 'email') {
        signInWithEmailAndPassword(auth, values.email, values.password)
          .then(() => {
            console.log('Ok');
          })
          .catch(() => {
            setLoginFail('Wrong email or password');
          });
      } else {
        loginByPhone();
      }
    }
  });
  const loginByPhone = async () => {
    const data = await getDocs(
      query(
        collection(db, 'users'),
        where('phone', '==', values.phone),
        where('password', '==', values.password)
      )
    );
    if (data.empty) {
      setLoginFail('Wrong phone number or password');
    } else {
      setLoginFail('');
      console.log(data.docs.at(0).data());
    }
  };
  const { errors, touched, values, handleSubmit, getFieldProps } = formik;
  return (
    <RootStyle>
      <HeaderAuth />
      <BoxLogin variant="h1">
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <BoxWayLogin direction="row">
              <ButtonWayLogin
                onClick={() => {
                  setWayLogin('email');
                  setInitialValuesState({
                    email: 'cc',
                    password: '',
                    phone: ''
                  });
                }}
                style={
                  wayLogin === 'email'
                    ? {
                        background:
                          'linear-gradient(to right, #06beb6 0%, #48b1bf  51%, #06beb6  100%)',
                        color: '#fff'
                      }
                    : null
                }
              >
                Email
              </ButtonWayLogin>
              <ButtonWayLogin
                onClick={() => {
                  setWayLogin('phone');
                }}
                style={
                  wayLogin === 'phone'
                    ? {
                        background:
                          'linear-gradient(to right, #06beb6 0%, #48b1bf  51%, #06beb6  100%)',
                        color: '#fff'
                      }
                    : null
                }
              >
                Phone
              </ButtonWayLogin>
            </BoxWayLogin>
            <Separate />
            <BoxInfoLogin spacing={2}>
              {wayLogin === 'email' ? (
                <TextField
                  fullWidth
                  autoComplete="email"
                  type="text"
                  label="Email"
                  {...getFieldProps('email')}
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                />
              ) : (
                <TextField
                  fullWidth
                  autoComplete="phone"
                  type="text"
                  label="Phone number"
                  {...getFieldProps('phone')}
                  error={Boolean(touched.phone && errors.phone)}
                  helperText={touched.phone && errors.phone}
                />
              )}
              <TextField
                fullWidth
                autoComplete="current-password"
                type="password"
                label="Password"
                {...getFieldProps('password')}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
              />
              <Typography sx={{ color: 'red' }}>{loginFail}</Typography>
              <BtnLogin type="submit">
                <TextLogin variant="h6">Login</TextLogin>
              </BtnLogin>
            </BoxInfoLogin>
          </Form>
        </FormikProvider>
        <ForgotPassword to="/home">Forgot password?</ForgotPassword>
        <Separate>
          <Typography style={{ color: '#30ab78' }}>OR</Typography>
        </Separate>
        <BoxWayLogin direction="row" spacing={1}>
          <GoogleLogin>
            <IconLogin src={google} alt="Login by Google" />
            Google
          </GoogleLogin>
          <GoogleLogin>
            <IconLogin src={facebook} alt="Login by Facebook" />
            Facebook
          </GoogleLogin>
        </BoxWayLogin>
      </BoxLogin>
    </RootStyle>
  );
}

export default LoginForm;
