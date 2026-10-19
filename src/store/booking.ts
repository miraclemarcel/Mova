import { create } from 'zustand';

import {
  CURRENT_LOCATION,
  DRIVERS,
  PAYMENT_METHODS,
  PLACES,
  RIDE_OPTIONS,
  type Driver,
  type Place,
} from '@/constants/data';
import { estimateFare } from '@/lib/format';

export type TripStatus = 'idle' | 'searching' | 'arriving' | 'arrived' | 'in_progress' | 'completed';

export type Trip = {
  id: string;
  date: string;
  pickup: Place;
  destination: Place;
  rideId: string;
  fare: number;
  driverName: string;
  rating: number | null;
  status: 'completed' | 'cancelled';
};

const NEXT_STATUS: Partial<Record<TripStatus, TripStatus>> = {
  arriving: 'arrived',
  arrived: 'in_progress',
  in_progress: 'completed',
};

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();

const SEED_HISTORY: Trip[] = [
  { id: 't1', date: daysAgo(1), pickup: CURRENT_LOCATION, destination: PLACES[0], rideId: 'go', fare: 6.24, driverName: 'Sarah Mensah', rating: 5, status: 'completed' },
  { id: 't2', date: daysAgo(4), pickup: CURRENT_LOCATION, destination: PLACES[1], rideId: 'comfort', fare: 31.55, driverName: 'Michael Chen', rating: 4, status: 'completed' },
  { id: 't3', date: daysAgo(9), pickup: CURRENT_LOCATION, destination: PLACES[3], rideId: 'go', fare: 0, driverName: 'Daniel Okafor', rating: null, status: 'cancelled' },
];

type BookingState = {
  pickup: Place;
  destination: Place | null;
  rideId: string;
  paymentId: string;
  status: TripStatus;
  driver: Driver | null;
  history: Trip[];
  setPickup: (place: Place) => void;
  setDestination: (place: Place) => void;
  selectRide: (id: string) => void;
  selectPayment: (id: string) => void;
  requestRide: () => void;
  assignDriver: () => void;
  advanceTrip: () => void;
  cancelRide: () => void;
  finishTrip: (rating: number | null, tip: number) => void;
};

const initialTrip = {
  destination: null,
  rideId: RIDE_OPTIONS[1].id,
  status: 'idle' as TripStatus,
  driver: null,
};

export const useBookingStore = create<BookingState>()((set, get) => ({
  pickup: CURRENT_LOCATION,
  paymentId: PAYMENT_METHODS[0].id,
  history: SEED_HISTORY,
  ...initialTrip,

  setPickup: (pickup) => set({ pickup }),
  setDestination: (destination) => set({ destination }),
  selectRide: (rideId) => set({ rideId }),
  selectPayment: (paymentId) => set({ paymentId }),
  requestRide: () => set({ status: 'searching' }),
  assignDriver: () =>
    set({ status: 'arriving', driver: DRIVERS[Math.floor(Math.random() * DRIVERS.length)] }),
  advanceTrip: () => {
    const next = NEXT_STATUS[get().status];
    if (next) set({ status: next });
  },
  cancelRide: () => {
    const { pickup, destination, rideId, driver, history } = get();
    // Only log a cancellation once a driver has been matched.
    const cancelled: Trip[] =
      destination && driver
        ? [{ id: `t${Date.now()}`, date: new Date().toISOString(), pickup, destination, rideId, fare: 0, driverName: driver.name, rating: null, status: 'cancelled' }]
        : [];
    set({ ...initialTrip, history: [...cancelled, ...history] });
  },
  finishTrip: (rating, tip) => {
    const { pickup, destination, rideId, driver, history } = get();
    const ride = RIDE_OPTIONS.find((r) => r.id === rideId);
    if (!destination || !ride) return set(initialTrip);
    const trip: Trip = {
      id: `t${Date.now()}`,
      date: new Date().toISOString(),
      pickup,
      destination,
      rideId,
      fare: estimateFare(ride, destination) + tip,
      driverName: driver?.name ?? 'Your driver',
      rating,
      status: 'completed',
    };
    set({ ...initialTrip, history: [trip, ...history] });
  },
}));

export const useSelectedRide = () => {
  const rideId = useBookingStore((s) => s.rideId);
  return RIDE_OPTIONS.find((r) => r.id === rideId) ?? RIDE_OPTIONS[0];
};

export const useSelectedPayment = () => {
  const paymentId = useBookingStore((s) => s.paymentId);
  return PAYMENT_METHODS.find((p) => p.id === paymentId) ?? PAYMENT_METHODS[0];
};
