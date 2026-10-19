import { COUNTRY_CODE, CURRENCY, type Place, type RideOption } from '@/constants/data';

/** ₦1,250 — whole naira with thousands separators. */
export const formatMoney = (amount: number) =>
  `${CURRENCY}${Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

export const estimateFare = (option: RideOption, place: Place) =>
  option.baseFare + option.perKm * Math.max(place.distanceKm, 1);

export const estimateTripMin = (place: Place) => Math.max(4, Math.round(place.distanceKm * 2.4));

export const initials = (first = '', last = '') =>
  `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || '?';

/**
 * Nigerian mobile numbers are 10 digits after +234 (e.g. 803 123 4567),
 * usually written locally with a leading 0 (0803 123 4567).
 */
export const toLocalDigits = (input: string) => input.replace(/\D/g, '').replace(/^234/, '').replace(/^0/, '').slice(0, 10);

export const isValidNigerianNumber = (digits: string) => /^[789][01]\d{8}$/.test(digits);

/** 8031234567 → "803 123 4567" (formats progressively while typing). */
export const formatLocalNumber = (digits: string) =>
  [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6)].filter(Boolean).join(' ');

/** "+2348031234567" → "+234 803 123 4567" */
export const formatPhone = (phone: string) =>
  phone.startsWith(COUNTRY_CODE) ? `${COUNTRY_CODE} ${formatLocalNumber(phone.slice(COUNTRY_CODE.length))}` : phone;
