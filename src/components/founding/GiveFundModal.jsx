'use client';

import { useState } from 'react';
import { X, Heart, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe-client';

const QUICK_AMOUNTS = [10, 25, 50, 100];

/**
 * Inner form — only rendered once a PaymentIntent (and thus clientSecret)
 * exists, since Stripe Elements needs the clientSecret to mount.
 */
function PaymentForm({ amount, user, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setError('');

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (stripeError) {
      setError(stripeError.message || 'Payment failed. Try again.');
      setSubmitting(false);
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fundings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            name: user?.name,
            email: user?.email,
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.message || 'Payment succeeded but recording it failed.');
        }
        onSuccess(amount);
      } catch (err) {
        setError(err.message);
      } finally {
        setSubmitting(false);
      }
    } else {
      setError('Payment did not complete. Try again.');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement />

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400">
          <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="flex-1 rounded-xl border border-white/[0.1] bg-white/[0.03] py-3 text-sm font-semibold text-slate-300 hover:bg-white/[0.06] transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || submitting}
          className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:from-red-500 hover:to-rose-400 transition-all disabled:opacity-60"
        >
          {submitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            `Donate $${amount}`
          )}
        </button>
      </div>

      <p className="text-center text-[11px] text-slate-500">
        Payments are processed securely by Stripe. Card details never touch our servers.
      </p>
    </form>
  );
}

export default function GiveFundModal({ user, onClose, onDonated }) {
  const [amount, setAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState('');
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const effectiveAmount = customAmount ? Number(customAmount) : amount;

  const handleProceed = async () => {
    setError('');
    if (!effectiveAmount || effectiveAmount < 0.5) {
      setError('Enter at least $0.50.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fundings/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: effectiveAmount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Could not start payment.');
      setClientSecret(data.clientSecret);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (donatedAmount) => {
    setDone(true);
    onDonated?.(donatedAmount);
    setTimeout(() => onClose(), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.1] bg-[#0c1424] p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Heart size={18} className="text-rose-500" />
            <h2 className="text-lg font-bold text-white">Give a fund</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {done ? (
          <div className="py-8 text-center">
            <CheckCircle2 size={40} className="mx-auto mb-3 text-emerald-400" />
            <p className="text-base font-semibold text-white">Thank you for your donation</p>
            <p className="mt-1 text-sm text-slate-400">Your contribution helps save lives.</p>
          </div>
        ) : !clientSecret ? (
          <div className="space-y-5">
            <div>
              <label className="mb-2 ml-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Choose an amount
              </label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {QUICK_AMOUNTS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => {
                      setAmount(a);
                      setCustomAmount('');
                      setError('');
                    }}
                    className={`rounded-xl border py-2.5 text-sm font-semibold transition-all ${
                      !customAmount && amount === a
                        ? 'border-rose-500/50 bg-rose-500/10 text-rose-400'
                        : 'border-white/[0.08] bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]'
                    }`}
                  >
                    ${a}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <input
                  type="number"
                  min="0.5"
                  step="0.01"
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setError('');
                  }}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-3 pl-7 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 focus:ring-4 focus:ring-red-500/10 transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400">
                <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleProceed}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:from-red-500 hover:to-rose-400 transition-all disabled:opacity-60"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : 'Continue to payment'}
            </button>
          </div>
        ) : (
          <Elements stripe={getStripe()} options={{ clientSecret, appearance: { theme: 'night' } }}>
            <PaymentForm
              amount={effectiveAmount}
              user={user}
              onSuccess={handleSuccess}
              onCancel={onClose}
            />
          </Elements>
        )}
      </div>
    </div>
  );
}
