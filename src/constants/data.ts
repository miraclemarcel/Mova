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

// Mova operates in Nigeria only.
export const CURRENCY = '₦';
export const COUNTRY_CODE = '+234';
export const COUNTRY_FLAG = '🇳🇬';

export const CURRENT_LOCATION: Place = {
  id: 'current',
  name: 'Current location',
  address: '12 Admiralty Way, Lekki Phase 1',
  distanceKm: 0,
};

export const SAVED_PLACES: (Place & { icon: IconName })[] = [
  { id: 'home', name: 'Home', address: '7 Bourdillon Road, Ikoyi', distanceKm: 8.4, icon: 'home-variant' },
  { id: 'work', name: 'Work', address: 'Adeola Odeku Street, Victoria Island', distanceKm: 6.1, icon: 'briefcase' },
];

export const PLACES: Place[] = [
  { id: 'p1', name: 'Eko Hotel & Suites', address: 'Adetokunbo Ademola St, Victoria Island', distanceKm: 6.8 },
  { id: 'p2', name: 'Murtala Muhammed Airport', address: 'Airport Road, Ikeja', distanceKm: 32.5 },
  { id: 'p3', name: 'Ikeja City Mall', address: 'Obafemi Awolowo Way, Alausa', distanceKm: 27.9 },
  { id: 'p4', name: 'Lekki Conservation Centre', address: 'Lekki-Epe Expressway', distanceKm: 5.2 },
  { id: 'p5', name: 'Lagos University Teaching Hospital', address: 'Ishaga Road, Idi-Araba', distanceKm: 21.3 },
  { id: 'p6', name: 'Eko Atlantic City', address: 'Ahmadu Bello Way, Victoria Island', distanceKm: 9.4 },
  { id: 'p7', name: 'Co-Creation Hub', address: '294 Herbert Macaulay Way, Yaba', distanceKm: 17.6 },
  { id: 'p8', name: 'University of Lagos', address: 'Akoka, Yaba', distanceKm: 19.8 },
  { id: 'p9', name: 'The Palms Shopping Mall', address: 'Lekki Phase 1', distanceKm: 3.1 },
  ...SAVED_PLACES,
];

export const RECENT_PLACES: Place[] = [PLACES[0], PLACES[8], PLACES[6]];

// Fares in naira: baseFare + perKm * distance.
export const RIDE_OPTIONS: RideOption[] = [
  { id: 'moto', name: 'Mova Moto', description: 'Beat the traffic', icon: 'motorbike', seats: 1, baseFare: 600, perKm: 120, etaMin: 2 },
  { id: 'go', name: 'Mova Go', description: 'Affordable, everyday rides', icon: 'car-hatchback', seats: 4, baseFare: 1500, perKm: 250, etaMin: 3 },
  { id: 'comfort', name: 'Comfort', description: 'Newer cars with AC, extra legroom', icon: 'car-side', seats: 4, baseFare: 2000, perKm: 350, etaMin: 5 },
  { id: 'xl', name: 'Mova XL', description: 'Rides for groups up to 6', icon: 'van-passenger', seats: 6, baseFare: 2800, perKm: 450, etaMin: 7 },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'cash', label: 'Cash', detail: 'Pay the driver directly', icon: 'cash' },
  { id: 'card', label: 'Verve •••• 4242', detail: 'Expires 08/28', icon: 'credit-card-outline' },
  { id: 'transfer', label: 'Bank transfer', detail: 'Pay to a one-time account', icon: 'bank-outline' },
  { id: 'wallet', label: 'Mova Wallet', detail: 'Balance ₦18,500', icon: 'wallet-outline' },
];

export const DRIVERS: Driver[] = [
  { id: 'd1', name: 'Chinedu Okafor', rating: 4.92, trips: 2140, car: 'Toyota Corolla', color: 'Silver', plate: 'KJA 482 XY' },
  { id: 'd2', name: 'Aisha Bello', rating: 4.88, trips: 1320, car: 'Honda Accord', color: 'Black', plate: 'LND 219 AB' },
  { id: 'd3', name: 'Tunde Adeyemi', rating: 4.97, trips: 3605, car: 'Toyota Camry', color: 'White', plate: 'EKY 731 MK' },
];
