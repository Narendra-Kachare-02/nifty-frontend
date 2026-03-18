// const API_VERSION = 'v1';

export const endpoints = {
  // Auth (phone OTP – backend users app)
  SEND_OTP: 'api/auth/phone/send-otp/',
  VERIFY_OTP: 'api/auth/phone/verify-otp/',
  REFRESH_TOKEN: 'api/auth/token/refresh/',

  // Nifty
  NIFTY_LATEST: 'api/nifty/latest/',


} as const;
