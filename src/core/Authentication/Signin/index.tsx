import { useState } from 'react';
import {
  AuthContainer,
  AuthHeader,
  AuthFooter,
  FormSection,
  PhoneInput,
  Button,
  Divider,
} from '../../../common/components';
import { useAppDispatch } from '../../../redux/store';
import { sendOtp } from '../../../redux/reducer/auth';
import { GoogleIcon } from '../../../assets/svg';

/** Pass phone with country code as-is (e.g. +91XXXXXXXXXX). No extra validation; saga handles API. */
export const Signin = () => {
  const dispatch = useAppDispatch();
  const [phoneNumber, setPhoneNumber] = useState('');

  const handlePhoneSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const normalized = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
    dispatch(sendOtp({ phone_number: normalized }));
  };

  const handleGoogleAuth = () => {
    // TODO: Google auth
  };

  return (
    <AuthContainer>
      <AuthHeader
        title="Login to Dashboard"
        subtitle="Sign in to continue to your account"
      />
      <FormSection>
        <form onSubmit={handlePhoneSubmit} className="space-y-5">
          <PhoneInput value={phoneNumber} onChange={setPhoneNumber} />
          <Button type="submit">Send Verification Code</Button>
        </form>
        <Divider />
        <Button variant="outline" onClick={handleGoogleAuth}>
          <div className="flex items-center justify-center gap-3">
            <GoogleIcon className="w-5 h-5" />
            <span>Continue with Google</span>
          </div>
        </Button>
        <AuthFooter />
      </FormSection>
    </AuthContainer>
  );
};
