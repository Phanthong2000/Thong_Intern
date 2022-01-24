import React from 'react';
import OtpInput from 'react-otp-input';

function Home() {
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
    marginTop: '100px'
  };
  return (
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
  );
}

export default Home;
