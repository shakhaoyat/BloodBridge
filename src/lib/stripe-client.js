import { loadStripe } from '@stripe/stripe-js';

// loadStripe must only be called once — re-calling it on every render
// creates a new Stripe instance and breaks Elements re-mounting.
let stripePromise;

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.N_PC_S_PUBLISHABLE_KEY);
  }
  return stripePromise;
}
