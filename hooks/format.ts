export function formatAmount(amount: number) {
  return `$${amount.toLocaleString("en-US")}`;
}
