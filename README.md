# Mova

A ride-hailing mobile app for Nigeria (in the spirit of Uber / Bolt) built with **Expo**, **React Native** and **TypeScript**.

> **Status: UI prototype.** The full auth and booking flows are built and navigable, but everything is driven by mock data and timers. There is no backend, real map or payments yet. See [Roadmap](#roadmap).

---

## Features

### Authentication
- Animated branded splash screen
- Welcome / onboarding screen
- Phone-number-only sign-up and sign-in — Nigerian numbers (🇳🇬 +234), formatted as you type, leading 0 optional
- 4-digit OTP verification with auto-submit and a resend countdown
- Profile setup (first name, last name, optional email)
- Session persisted to device storage — you stay signed in across restarts
- Sign out from the Account tab

### Booking
- **Home** — map, "Where to?" search, saved places (Home / Work), promo card, recent destinations
- **Search** — pickup + destination fields with live filtering of places
- **Choose a ride** — Moto, Go, Comfort and XL with fare estimate, ETA and seat count
- **Payment** — pick Cash, card, bank transfer or Mova Wallet
- **Finding a driver** — radar search with nearby cars cruising the map, and cancel
- **Live trip** — the driver's car drives along the streets to your pickup, waits (pickup PIN), then drives the route to your destination; "You've arrived" only shows once it gets there. Includes driver details, plate, call / message / share / safety actions
- **Rate & tip** — fare breakdown, star rating, compliments and tip
- **Activity** — trip history including cancelled rides

## Tech stack

| Area | Library |
| --- | --- |
| Framework | [Expo](https://expo.dev) SDK 57, React Native 0.86, React 19 |
| Language | TypeScript (strict) |
| Navigation | [Expo Router](https://docs.expo.dev/router/introduction/) (file-based, protected routes) |
| Styling | [NativeWind v4](https://www.nativewind.dev) (Tailwind CSS 3) |
| State | [Zustand](https://zustand.docs.pmnd.rs) (+ `persist` with AsyncStorage for auth) |
| Icons | `@expo/vector-icons` (MaterialCommunityIcons) |

## Getting started

### Prerequisites
- Node.js 20+
- The **Expo Go** app on your phone, **SDK 57** ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779)) — or an Android emulator / iOS simulator

> The project is pinned to SDK 57. If Expo Go says *"Project is incompatible with this version of Expo Go"*, your Expo Go and the project SDK don't match.

### Install & run

```bash
npm install
npx expo start
```

Then scan the QR code with Expo Go (Android) or the Camera app (iOS), or press `a` for Android, `i` for iOS, `w` for web.

If you hit odd bundling or styling issues after changing config or dependencies, clear the cache:

```bash
npx expo start -c
```

### Trying the app
- Use any valid Nigerian mobile number, e.g. `0803 123 4567` or `803 123 4567`.
- **Any 4-digit code** is accepted on the verification screen.
- After booking, the trip plays out on its own (driver match, drive to pickup, ride to destination) and reaches the rating screen in about 30 seconds.

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the Expo dev server |
| `npm run android` | Start and open on Android |
| `npm run ios` | Start and open on iOS |
| `npm run web` | Start and open in the browser |
| `npm run typecheck` | Run the TypeScript compiler (`tsc --noEmit`) |

Always add packages with `npx expo install <package>` so versions stay compatible with the SDK. `npx expo-doctor` checks project health.

## Project structure

```
src/
├── app/                      # Routes (Expo Router) — every file is a screen
│   ├── _layout.tsx           # Root stack, auth guard, status bar
│   ├── (auth)/               # Shown when signed out
│   │   ├── welcome.tsx
│   │   ├── phone.tsx
│   │   ├── verify.tsx
│   │   └── profile.tsx
│   └── (app)/                # Shown when signed in
│       ├── (tabs)/           # Bottom tabs: Home, Activity, Account
│       ├── search.tsx        # Destination search
│       ├── payment.tsx       # Payment method (modal)
│       └── ride/             # Booking flow
│           ├── select.tsx    #   choose ride type
│           ├── searching.tsx #   finding a driver
│           ├── trip.tsx      #   live trip
│           └── rate.tsx      #   rate & tip
├── components/               # Reusable UI (AnimatedSplash, DriveLoader, FakeMap, Button, ...)
├── constants/data.ts         # Mock places, ride options, drivers, payment methods, locale
├── lib/                      # Formatting helpers and shared shadow styles
├── store/
│   ├── auth.ts               # Auth store (persisted)
│   └── booking.ts            # Booking / trip store
└── global.css                # Tailwind directives
```

### How navigation works
The root layout uses `Stack.Protected` to show either the `(auth)` group or the `(app)` group, depending on whether a user exists in the auth store. Finishing profile setup sets the user, which switches to the app; signing out switches back. No manual redirects are needed.

### How the booking flow works
`store/booking.ts` holds the current trip as a small state machine:

```
idle → searching → arriving → arrived → in_progress → completed
```

Driver matching and the pickup wait use timers (`MATCH_DELAY_MS` in `searching.tsx`, `PICKUP_WAIT_MS` in `trip.tsx`); the driving stages advance when the car on the map reaches the end of its path (`APPROACH_MS` / `RIDE_MS`). Finished and cancelled trips are added to `history`, which feeds the Activity tab.

## Customisation

- **Currency (₦), country code (+234) & flag** — `CURRENCY`, `COUNTRY_CODE`, `COUNTRY_FLAG` in [`src/constants/data.ts`](src/constants/data.ts)
- **Places (Lagos), ride types, naira fares, drivers** — same file
- **App icon & splash** — images in [`assets/`](assets/), splash animation in [`src/components/AnimatedSplash.tsx`](src/components/AnimatedSplash.tsx)
- **Brand colours** — `ink` and `brand` in [`tailwind.config.js`](tailwind.config.js)

## Roadmap

The mocks are isolated so they can be swapped for real services:

- [ ] Real OTP (replace `sendCode` / `verifyCode` in `store/auth.ts`)
- [ ] Real map, location and routing (replace `components/FakeMap.tsx`, e.g. with `react-native-maps` + `expo-location`)
- [ ] Places autocomplete for search
- [ ] Backend for fares, dispatch and live driver updates (replace the timers in the ride screens)
- [ ] Payments
- [ ] Push notifications for trip updates
- [ ] Dark mode

## License

[MIT](LICENSE)
