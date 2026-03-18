// Keep constants close to the feature screen for easy tuning.
export const NIFTY_POLL_INTERVAL_MS = Number(import.meta.env.VITE_NIFTY_POLL_INTERVAL_MS ?? 5000);

// NSE option-chain openInterest in our payload is in lots; display in contracts.
// Make it configurable per environment.
export const NIFTY_OPTION_LOT_SIZE = Number(import.meta.env.VITE_NIFTY_OPTION_LOT_SIZE ?? 65);

