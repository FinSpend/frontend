import { describe, it, expect } from 'vitest';
import { formatIDR, formatIDRSigned } from './format';

describe('formatIDR', () => {
  it('formats a whole number with Rp prefix', () => {
    expect(formatIDR(1500000)).toBe('Rp 1.500.000');
  });

  it('formats zero', () => {
    expect(formatIDR(0)).toBe('Rp 0');
  });

  it('formats small amount', () => {
    expect(formatIDR(45000)).toBe('Rp 45.000');
  });
});

describe('formatIDRSigned', () => {
  it('prefixes positive amounts with +', () => {
    expect(formatIDRSigned(6000000)).toBe('+Rp 6.000.000');
  });

  it('keeps negative sign for expenses', () => {
    expect(formatIDRSigned(-45000)).toBe('-Rp 45.000');
  });

  it('treats zero as positive', () => {
    expect(formatIDRSigned(0)).toBe('+Rp 0');
  });
});
