# OpenFX Frontend

A frontend application for international money transfers with quote management, payment processing, and transaction tracking.

## How to Run the App

**Prerequisites:** Node.js 18+

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Key Design Decisions

**1. Custom hooks for state management**  
Used React hooks (useState, useEffect, useCallback) and custom hooks (useQuote, usePayment, useTransactionStatus) instead of Redux or Zustand. The flow is linear (quote → confirm → status) and state is mostly screen-specific, so custom hooks keep the logic encapsulated without extra dependencies.

**2. Double submit prevention**  
Three layers: an `isSubmitting` flag in the payment hook with an early return if already submitting, the Pay button disabled while submitting, and visual feedback (spinner + "Processing..."). Prevents duplicate payment requests.

**3. Quote expiry handling**  
Countdown timer updates every second from the quote’s `expiresAt`. When time reaches zero, the quote is marked expired, "Continue to Payment" is disabled, and a "Refresh Quote" button is shown. Backend should still validate expiry; the UI is for clarity only.

**4. Status polling**  
Transaction status is polled every 3 seconds. Polling stops when status is `settled` or `failed`, or after 5 minutes. Intervals are cleared on unmount to avoid leaks. Errors during polling don’t stop retries; the user sees a warning but polling continues.

**5. Error handling**  
Async flows use try/catch, errors are stored in state and shown in the UI with clear messages, and retry/refresh actions (e.g. refresh quote, try again after failure) are available where it makes sense.

## What Would Be Improved With More Time

- **Testing** – Unit tests for hooks (useQuote, usePayment, useTransactionStatus) and utils (validation, formatters); integration tests for the main flows (get quote → confirm → status).
- **Request cancellation** – Use AbortController in fetch/API calls and cancel in-flight requests when the user navigates away or the component unmounts.
- **Optimistic UI** – After "Pay Now", show a processing/sent state immediately and only roll back with a clear message if the request fails.
- **Error recovery** – Automatic retries with exponential backoff for transient failures (e.g. network errors) instead of only manual retry.
- **Accessibility** – ARIA labels, live regions for status updates, keyboard navigation, and screen reader–friendly announcements for the countdown and status changes.
- **Form persistence** – Persist quote/form data (e.g. in localStorage) so a refresh or accidental back doesn’t lose the user’s inputs; allow resuming from the last step where possible.

## Try the Application

### Test the Happy Path

1. Enter **100** in the amount field
2. Select **USD** → **EUR**
3. Click **Get Quote**
4. Wait for the quote to load (with countdown timer)
5. Click **Continue to Payment**
6. Check the confirmation checkbox
7. Click **Pay Now**
8. Watch the transaction status update automatically

### Test Error Handling

- **Invalid Amount**: Enter `-50` or `9999999`
- **Quote Expiry**: Wait 30 seconds after getting a quote
- **Payment Failure**: Keep clicking "Pay Now" (10% chance of error)
- **Transaction Failure**: Watch status updates (5% chance of failure)

## Project Features

✅ Real-time quote expiry countdown  
✅ Double-submit prevention  
✅ Automatic status polling  
✅ Error handling with retry  
✅ Loading states  
✅ Responsive design  
✅ TypeScript type safety
