import * as React from 'react';

interface VerificationEmailProps {
  username: string;
  verificationCode: string;
}

const VerificationEmail: React.FC<VerificationEmailProps> = ({username, verificationCode }) => (
  <div>
    <h1>Welcome, {username}!</h1>
    <p>Your Verification Code: <span font-family="Roboto">{verificationCode}</span></p>
    <hr />
    <p>If you did not request this account verification, please ignore this email</p>
    {/* 
      TODO: Try to add button here 
    */}
  </div>
);

export default VerificationEmail;
