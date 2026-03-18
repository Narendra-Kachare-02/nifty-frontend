// const API_VERSION = 'v1';

export const endpoints = {
  // Auth (phone OTP – backend users app)
  SEND_OTP: 'api/auth/phone/send-otp/',
  VERIFY_OTP: 'api/auth/phone/verify-otp/',
  REFRESH_TOKEN: 'api/auth/token/refresh/',

  // Nifty
  NIFTY_LATEST: 'api/nifty/latest/',
  NIFTY_SERIES: 'api/nifty/series/',
  NIFTY_OPTION_CHAIN_LATEST: 'api/nifty/option-chain/latest/',
  NIFTY_BOOTSTRAP: 'api/nifty/bootstrap/',


} as const;
