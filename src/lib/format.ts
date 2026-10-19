import { CURRENCY, type Place, type RideOption } from '@/constants/data';

export const formatMoney = (amount: number) => `${CURRENCY}${amount.toFixed(2)}`;

export const estimateFare = (option: RideOption, place: Place) =>
  option.baseFare + option.perKm * Math.max(place.distanceKm, 1);

export const estimateTripMin = (place: Place) => Math.max(4, Math.round(place.distanceKm * 2.4));

export const initials = (first = '', last = '') =>
  `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || '?';
