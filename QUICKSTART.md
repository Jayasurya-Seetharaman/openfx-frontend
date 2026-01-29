# Quick Start Guide

## Get Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open in Browser
Navigate to `http://localhost:5173`

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

## Need Help?

See [README.md](./README.md) for detailed documentation.
