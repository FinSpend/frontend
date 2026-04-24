const IDR = new Intl.NumberFormat('id-ID');

export function formatIDR(amount: number): string {
  return `Rp ${IDR.format(amount)}`;
}

// Prefixes positive/zero with '+', negative with '-'
export function formatIDRSigned(amount: number): string {
  const sign = amount >= 0 ? '+' : '-';
  return `${sign}Rp ${IDR.format(Math.abs(amount))}`;
}
