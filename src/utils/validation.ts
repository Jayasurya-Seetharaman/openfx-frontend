export const validateAmount = (amount: string): string | null => {
  const numAmount = parseFloat(amount);
  
  if (isNaN(numAmount)) {
    return 'Please enter a valid number';
  }
  
  if (numAmount <= 0) {
    return 'Amount must be greater than 0';
  }
  
  if (numAmount > 1000000) {
    return 'Amount exceeds maximum limit of 1,000,000';
  }
  
  return null;
};

export const validateCurrency = (currency: string): boolean => {
  const validCurrencies = ['USD', 'EUR', 'GBP', 'INR'];
  return validCurrencies.includes(currency);
};
