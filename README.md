# OpenFX Frontend

A simplified frontend application for international money transfers with real-time quote management, payment processing, and transaction tracking.

## Overview

This application demonstrates a complete FX transfer flow:
1. **Get Quote** - Request an FX quote with real-time expiry countdown
2. **Confirm & Pay** - Review and submit payment with double-submit prevention
3. **Track Status** - Monitor transaction status with automatic polling

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Installation

```bash
npm install
```

## Running the Application

### Development Mode
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── QuoteScreen.tsx           # Step 1: Get FX quote
│   ├── ConfirmPayScreen.tsx      # Step 2: Confirm and pay
│   ├── TransactionStatus.tsx     # Step 3: Track transaction
│   ├── CountdownTimer.tsx        # Reusable timer component
│   ├── LoadingSpinner.tsx        # Loading state component
│   └── ErrorBoundary.tsx         # Error handling boundary
├── hooks/               # Custom React hooks
│   ├── useQuote.ts               # Quote fetching & expiry logic
│   ├── usePayment.ts             # Payment submission logic
│   └── useTransactionStatus.ts   # Status polling logic
├── services/            # API layer
│   ├── api.ts                    # API client interface
│   └── mockApi.ts                # Mock API implementations
├── types/               # TypeScript definitions
│   └── index.ts                  # Shared interfaces
├── utils/               # Utility functions
│   ├── formatters.ts             # Currency & time formatting
│   └── validation.ts             # Input validation
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

## Key Design Decisions

### 1. State Management
**Decision:** Use React hooks (useState, useEffect, useCallback) without external state management libraries.

**Rationale:**
- The application has a simple linear flow (quote → confirm → status)
- State is mostly screen-specific with minimal sharing
- Custom hooks encapsulate complex logic (polling, timers)
- Reduces bundle size and complexity for a 3-screen app

**Trade-off:** For a larger app with complex state sharing, Redux or Zustand would be more appropriate.

### 2. Timer Implementation
**Decision:** Use `setInterval` in `useEffect` with proper cleanup.

**Implementation:**
- Updates every second for smooth countdown
- Visual progress bar with color coding (green → yellow → orange → red)
- Automatically marks quote as expired when timer reaches zero
- Cleanup on component unmount to prevent memory leaks

**Trade-off:** More frequent updates (100ms) would be smoother but increase CPU usage unnecessarily.

### 3. Double Submit Prevention
**Decision:** Track `isSubmitting` flag in state and disable button during submission.

**Implementation:**
- Button disabled while `isSubmitting` is true
- Early return in submit handler if already submitting
- Re-enable only after success or error
- Visual feedback with loading spinner

**Trade-off:** Could add idempotency keys for additional backend protection, but not needed for mock API.

### 4. Polling Strategy
**Decision:** Poll every 3 seconds with automatic stop on terminal states.

**Rationale:**
- 3 seconds balances UX responsiveness with server load
- Stops automatically on 'settled' or 'failed' status
- Includes 5-minute timeout with user notification
- Continues polling despite temporary errors (with exponential backoff)

**Trade-off:** WebSockets would provide real-time updates but add complexity. Polling is simpler and sufficient for this use case.

### 5. Error Handling
**Decision:** Multi-layered approach with Error Boundary, try-catch blocks, and user-friendly messages.

**Implementation:**
- Error Boundary catches unexpected React errors
- Try-catch in async operations with specific error messages
- Retry buttons for recoverable errors
- Clear user guidance for each error type

**Trade-off:** Could add error reporting service (Sentry) in production.

### 6. Mock API Design
**Decision:** Simulate realistic delays, error rates, and state progression.

**Features:**
- 500-1000ms delay for quote requests
- 1-2s delay for payment submission
- 10% random error rate for payments
- 5% random failure rate for transactions
- Status progression: processing (0-5s) → sent (5-10s) → settled (10-15s)

**Rationale:** Helps test loading states, error handling, and race conditions.

### 7. TypeScript Usage
**Decision:** Strict TypeScript with comprehensive type definitions.

**Benefits:**
- Catch errors at compile time
- Better IDE autocomplete and refactoring
- Self-documenting interfaces
- Safer refactoring

**Trade-off:** Slightly more verbose code, but worth it for maintainability.

### 8. Styling Approach
**Decision:** Tailwind CSS for rapid UI development.

**Rationale:**
- Fast prototyping without writing custom CSS
- Consistent design system out of the box
- Small bundle size with purging
- Easy to customize and extend

**Trade-off:** Class names can be verbose, but utility-first approach is faster than component libraries.

## What Would Be Improved With More Time

### 1. Optimistic UI Updates
- Show "processing" status immediately after payment
- Rollback on error with clear messaging
- Smoother perceived performance

### 2. Offline Support
- Queue requests when offline
- Retry automatically when connection restored
- Show offline indicator

### 3. Form Persistence
- Save draft quote in localStorage
- Resume incomplete transactions
- Prevent data loss on accidental refresh

### 4. Better Error Recovery
- Automatic retry with exponential backoff
- Detailed error codes for debugging
- Fallback to alternative endpoints

### 5. Accessibility Enhancements
- ARIA live regions for status updates
- Keyboard shortcuts for common actions
- Screen reader announcements for timer
- High contrast mode support

### 6. Testing
- Unit tests for utility functions
- Integration tests for user flows
- E2E tests with Playwright
- Visual regression testing

### 7. Performance Optimizations
- React.memo for expensive components
- useMemo for computed values
- Code splitting for faster initial load
- Image optimization

### 8. Analytics & Monitoring
- Track user actions and drop-off points
- Monitor API response times
- Error tracking with Sentry
- Performance monitoring

### 9. Security Improvements
- CSRF token validation
- Rate limiting on client side
- Input sanitization
- Content Security Policy headers

### 10. Internationalization
- Multi-language support
- Currency formatting per locale
- RTL layout support
- Timezone handling

## Production Risks & Mitigations

### 1. Quote Expiry Race Condition
**Risk:** User clicks "Continue" exactly when quote expires.

**Mitigation:**
- Backend must validate quote expiry timestamp
- Client-side check is for UX only, not security
- Return clear error if quote expired

### 2. Polling Overload
**Risk:** Thousands of users polling simultaneously could overload servers.

**Mitigation:**
- Implement WebSocket for real-time updates
- Add jitter to polling intervals (±500ms)
- Use server-sent events as alternative
- Backend rate limiting per user

### 3. Stale Status Display
**Risk:** Backend delay causes UI to show outdated status.

**Mitigation:**
- Display "Last updated" timestamp
- Add manual refresh button
- Show warning if status hasn't updated in 30s
- Backend includes timestamp in response

### 4. Double Payment
**Risk:** Network retry or race condition causes duplicate charge.

**Mitigation:**
- Backend idempotency keys (client-generated UUID)
- Backend deduplication within time window
- Transaction ID returned immediately
- Client prevents multiple submissions

### 5. Memory Leaks
**Risk:** Unmounted components still polling or running timers.

**Mitigation:**
- Cleanup in useEffect return functions
- Clear intervals on unmount
- Cancel pending requests on navigation
- Use AbortController for fetch requests

### 6. Browser Compatibility
**Risk:** Modern JS features not supported in older browsers.

**Mitigation:**
- Vite includes polyfills automatically
- Test on target browsers
- Graceful degradation for unsupported features
- Display browser upgrade notice if needed

## Technical Highlights

### State Correctness
- No race conditions in timer or polling logic
- Proper cleanup prevents memory leaks
- Loading states prevent UI flickering
- Error states are always actionable

### User Experience
- Clear progress indicator across all screens
- Never ambiguous states (always loading, success, or error)
- Countdown timer with visual feedback
- Disabled states prevent invalid actions
- Success/error messages in plain language

### Code Quality
- TypeScript for type safety
- Custom hooks for reusable logic
- Clear separation of concerns
- Consistent naming conventions
- Comprehensive error handling

## Testing the Application

### Happy Path
1. Enter amount (e.g., 100 USD → EUR)
2. Click "Get Quote"
3. Wait for quote to load
4. Click "Continue to Payment"
5. Check confirmation checkbox
6. Click "Pay Now"
7. Watch transaction status progress
8. See success message

### Error Scenarios
1. **Invalid Amount:** Enter negative or very large amount
2. **Quote Expiry:** Wait 30 seconds without clicking Continue
3. **Payment Failure:** Submit payment (10% chance of error)
4. **Transaction Failure:** Wait for status (5% chance of failure)
5. **Network Error:** Simulate by checking browser DevTools

### Edge Cases
1. Rapid quote requests (debouncing)
2. Browser back button during payment
3. Page refresh during transaction
4. Multiple clicks on Pay button

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This is a demo project for evaluation purposes.

## Contact

For questions or issues, please contact the development team.
