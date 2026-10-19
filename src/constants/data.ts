import type { MaterialCommunityIcons } from '@expo/vector-icons';

export type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

export type Place = {
  id: string;
  name: string;
  address: string;
  distanceKm: number;
};

export type RideOption = {
  id: string;
  name: string;
  description: string;
  icon: IconName;
  seats: number;
  baseFare: number;
  perKm: number;
  etaMin: number;
};

export type PaymentMethod = {
  id: string;
  label: string;
  detail: string;
  icon: IconName;
};

export type Driver = {
  id: string;
  name: string;
  rating: number;
  trips: number;
  car: string;
  color: string;
  plate: string;
};

// Locale settings live here so they're easy to swap.
export const CURRENCY = '$';
export const COUNTRY_CODE = '+1';
export const COUNTRY_FLAG = '🇺🇸';

export const CURRENT_LOCATION: Place = {
  id: 'current',
  name: 'Current location',
  address: '24 Harbour Street',
  distanceKm: 0,
};

export const SAVED_PLACES: (Place & { icon: IconName })[] = [
  { id: 'home', name: 'Home', address: '18 Maple Avenue, Westside', distanceKm: 6.2, icon: 'home-variant' },
  { id: 'work', name: 'Work', address: '400 Market Street, Downtown', distanceKm: 4.1, icon: 'briefcase' },
];

export const PLACES: Place[] = [
  { id: 'p1', name: 'Central Station', address: '1 Station Plaza, Downtown', distanceKm: 3.4 },
  { id: 'p2', name: 'City Airport, Terminal 2', address: 'Airport Road', distanceKm: 18.7 },
  { id: 'p3', name: 'Riverside Mall', address: '220 River Road', distanceKm: 5.9 },
  { id: 'p4', name: 'Greenfield Park', address: 'Park Lane, Northside', distanceKm: 7.3 },
  { id: 'p5', name: "St. Mary's Hospital", address: '90 Hope Street', distanceKm: 2.8 },
  { id: 'p6', name: 'The Grand Hotel', address: '12 Kings Road', distanceKm: 4.6 },
  { id: 'p7', name: 'Tech Hub Co-working', address: '55 Innovation Drive', distanceKm: 9.1 },
  { id: 'p8', name: 'University Campus', address: 'College Avenue', distanceKm: 11.4 },
  ...SAVED_PLACES,
];

export const RECENT_PLACES: Place[] = [PLACES[0], PLACES[2], PLACES[6]];

export const RIDE_OPTIONS: RideOption[] = [
  { id: 'moto', name: 'Mova Moto', description: 'Beat the traffic', icon: 'motorbike', seats: 1, baseFare: 1.5, perKm: 0.6, etaMin: 2 },
  { id: 'go', name: 'Mova Go', description: 'Affordable, everyday rides', icon: 'car-hatchback', seats: 4, baseFare: 2.5, perKm: 1.1, etaMin: 3 },
  { id: 'comfort', name: 'Comfort', description: 'Newer cars, extra legroom', icon: 'car-side', seats: 4, baseFare: 3.5, perKm: 1.5, etaMin: 5 },
  { id: 'xl', name: 'Mova XL', description: 'Rides for groups up to 6', icon: 'van-passenger', seats: 6, baseFare: 4.5, perKm: 1.9, etaMin: 7 },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'cash', label: 'Cash', detail: 'Pay the driver directly', icon: 'cash' },
  { id: 'visa', label: 'Visa •••• 4242', detail: 'Expires 08/28', icon: 'credit-card-outline' },
  { id: 'wallet', label: 'Mova Wallet', detail: `Balance ${CURRENCY}24.50`, icon: 'wallet-outline' },
];

export const DRIVERS: Driver[] = [
  { id: 'd1', name: 'Daniel Okafor', rating: 4.92, trips: 2140, car: 'Toyota Corolla', color: 'Silver', plate: 'KJA 482 XY' },
  { id: 'd2', name: 'Sarah Mensah', rating: 4.88, trips: 1320, car: 'Honda Civic', color: 'Black', plate: 'LND 219 AB' },
  { id: 'd3', name: 'Michael Chen', rating: 4.97, trips: 3605, car: 'Hyundai Elantra', color: 'White', plate: 'ABC 731 MK' },
];
