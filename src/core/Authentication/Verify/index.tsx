import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  AuthContainer,
  AuthHeader,
  FormSection,
  OTPInput,
  Button,
  InfoBox,
} from '../../../common/components';
import { useAppDispatch } from '../../../redux/store';
import { ROUTES } from '../../../common/routes';
import { sendOtp, verifyOtp } from '../../../redux/reducer/auth';

type LocationState = { token?: string; phone_number?: string } | null;

export const Verifyotp = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) ?? {};
  const token = state.token ?? null;
  const phoneNumber = state.phone_number ?? null;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!token) navigate(ROUTES.SIGNIN, { replace: true });
  }, [token, navigate]);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = otp.join('');
    if (!token) return;
    dispatch(verifyOtp({ code, token }));
  };

  const handleResend = () => {
    if (!phoneNumber) return;
    setIsResending(true);
    dispatch(sendOtp({ phone_number: phoneNumber }));
    setTimeout(() => setIsResending(false), 2000);
  };

  const handleBack = () => navigate(ROUTES.SIGNIN);

  return (
    <AuthContainer>
      <AuthHeader
        title="Verify Your Phone"
        subtitle="Enter the 6-digit code sent to your phone"
      />
      <FormSection>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <OTPInput value={otp} onChange={setOtp} />
            <p className="mt-4 text-center text-xs text-gray-600">
              Didn&apos;t receive the code?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending || !phoneNumber}
                className="text-blue-600 hover:text-blue-800 font-bold hover:underline duration-200 disabled:opacity-50 disabled:cursor-not-allowed ml-1"
              >
                {isResending ? 'Sending...' : 'Resend'}
              </button>
            </p>
          </div>
          <div className="space-y-3">
            <Button type="submit" disabled={otp.some((d) => !d)}>
              Verify & Continue
            </Button>
            <Button variant="secondary" onClick={handleBack}>
              Back to Sign In
            </Button>
          </div>
        </form>
        <div className="mt-6">
          <InfoBox>
            For your security, this code will expire in 10 minutes. Never share it with anyone.
          </InfoBox>
        </div>
      </FormSection>
    </AuthContainer>
  );
};
