// Helper functions to format currency
export const formatARS = (amount: number) => new Intl.NumberFormat("de-DE", { style: "currency", currency: "ARS" }).format(amount);
export const formatUSD = (amount: number) => new Intl.NumberFormat("de-DE", { style: "currency", currency: "USD", currencyDisplay: 'code' }).format(amount);