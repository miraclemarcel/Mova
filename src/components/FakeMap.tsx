import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Text, View, type DimensionValue } from 'react-native';

import { shadow } from '@/lib/shadow';

/**
 * Illustrated stand-in for a real map (e.g. react-native-maps).
 * Points are percentages of the map's size and sit on the drawn roads, kept in the
 * upper half since bottom sheets cover the lower part of the screen.
 */

type Point = { x: number; y: number };

const PICKUP: Point = { x: 26, y: 42 };
const DROPOFF: Point = { x: 72, y: 18 };
const USER: Point = { x: 50, y: 42 };

/** Driver's route to the pickup, then the trip itself; both follow the roads. */
const APPROACH_PATH: Point[] = [{ x: 50, y: 88 }, { x: 50, y: 66 }, { x: 26, y: 66 }, PICKUP];
const RIDE_PATH: Point[] = [PICKUP, { x: 72, y: 42 }, DROPOFF];

/** Nearby cars cruising up and down their streets. */
const CRUISERS: { path: Point[]; duration: number; delay: number }[] = [
  { path: [{ x: 6, y: 18 }, { x: 44, y: 18 }, { x: 6, y: 18 }], duration: 9000, delay: 0 },
  { path: [{ x: 72, y: 52 }, { x: 72, y: 86 }, { x: 72, y: 52 }], duration: 8000, delay: 600 },
  { path: [{ x: 4, y: 66 }, { x: 40, y: 66 }, { x: 4, y: 66 }], duration: 10000, delay: 1200 },
  { path: [{ x: 50, y: 58 }, { x: 50, y: 86 }, { x: 50, y: 58 }], duration: 7000, delay: 300 },
  { path: [{ x: 92, y: 10 }, { x: 92, y: 60 }, { x: 92, y: 10 }], duration: 11000, delay: 900 },
  { path: [{ x: 58, y: 88 }, { x: 96, y: 88 }, { x: 58, y: 88 }], duration: 9500, delay: 1500 },
];

const H_ROADS = [18, 42, 66, 88];
const V_ROADS = [26, 50, 72, 92];

const pct = (n: number) => `${n}%` as DimensionValue;

/**
 * Where the driver is:
 * - `approach` / `ride`: animating along the path over `duration`, then `onDone` fires.
 * - `waiting` (at pickup) / `arrived` (at drop-off): parked at the end of the path.
 */
export type DriverState =
  | { phase: 'approach' | 'ride'; duration: number; onDone?: () => void }
  | { phase: 'waiting' | 'arrived' };

type Props = {
  route?: boolean;
  pickupLabel?: string;
  dropoffLabel?: string;
  showCars?: boolean;
  driver?: DriverState | null;
};

type Size = { w: number; h: number };

export function FakeMap({ route, pickupLabel, dropoffLabel, showCars, driver }: Props) {
  const [size, setSize] = useState<Size | null>(null);

  return (
    <View
      className="absolute inset-0 overflow-hidden bg-[#EEF1EA]"
      onLayout={(e) => setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
    >
      {/* Water & parks */}
      <View className="absolute rounded-[48px] bg-[#CFE4F6]" style={{ left: '58%', top: '72%', width: '70%', height: '40%' }} />
      <View className="absolute rounded-3xl bg-[#D6EDCF]" style={{ left: '4%', top: '4%', width: '18%', height: '11%' }} />
      <View className="absolute rounded-3xl bg-[#D6EDCF]" style={{ left: '30%', top: '47%', width: '16%', height: '15%' }} />
      <View className="absolute rounded-3xl bg-[#D6EDCF]" style={{ left: '76%', top: '22%', width: '13%', height: '17%' }} />

      {/* Roads */}
      {H_ROADS.map((y) => (
        <View key={`h${y}`} className="absolute h-3 w-full bg-white" style={{ top: pct(y), marginTop: -6 }} />
      ))}
      {V_ROADS.map((x) => (
        <View key={`v${x}`} className="absolute h-full w-3 bg-white" style={{ left: pct(x), marginLeft: -6 }} />
      ))}
      <View
        className="absolute h-4 bg-[#FBE7B5]"
        style={{ left: '-20%', top: '60%', width: '140%', transform: [{ rotate: '-28deg' }] }}
      />

      {route && <RouteLine />}
      {route && driver?.phase === 'approach' && <PathLine points={APPROACH_PATH} color="#12B76A" />}

      {size && showCars && CRUISERS.map((c, i) => <Cruiser key={i} size={size} {...c} />)}

      {!route && <UserDot />}
      {route && <Marker point={PICKUP} label={pickupLabel} kind="pickup" />}
      {route && <Marker point={DROPOFF} label={dropoffLabel} kind="dropoff" />}
      {size && driver && <DriverCar key={driver.phase} size={size} state={driver} />}
    </View>
  );
}

/* ---------- Motion along a path ---------- */

/**
 * Builds translate/rotate interpolations that move a car along `points` (in %) as
 * `progress` goes 0 → 1, at constant speed, turning quickly at each corner.
 */
function followPath(progress: Animated.Value, points: Point[], size: Size, carW: number, carH: number) {
  const px = points.map((p) => ({ x: (p.x / 100) * size.w, y: (p.y / 100) * size.h }));
  const lengths = px.slice(1).map((p, i) => Math.hypot(p.x - px[i].x, p.y - px[i].y));
  const total = lengths.reduce((a, b) => a + b, 0) || 1;
  const stops = [0];
  lengths.forEach((l) => stops.push(stops[stops.length - 1] + l / total));
  stops[stops.length - 1] = 1;

  // Heading per segment; 0deg = facing up. Unwrapped so turns take the short way round.
  const headings: number[] = [];
  lengths.forEach((_, i) => {
    let deg = (Math.atan2(px[i + 1].x - px[i].x, -(px[i + 1].y - px[i].y)) * 180) / Math.PI;
    const prev = headings[i - 1];
    if (prev !== undefined) {
      while (deg - prev > 180) deg -= 360;
      while (deg - prev < -180) deg += 360;
    }
    headings.push(deg);
  });

  const rotIn: number[] = [];
  const rotOut: string[] = [];
  headings.forEach((deg, i) => {
    const turn = Math.min(0.03, (stops[i + 1] - stops[i]) / 3);
    const start = i === 0 ? 0 : stops[i] + turn;
    const end = i === headings.length - 1 ? 1 : stops[i + 1] - turn;
    rotIn.push(start, end);
    rotOut.push(`${deg}deg`, `${deg}deg`);
  });

  return [
    { translateX: progress.interpolate({ inputRange: stops, outputRange: px.map((p) => p.x - carW / 2) }) },
    { translateY: progress.interpolate({ inputRange: stops, outputRange: px.map((p) => p.y - carH / 2) }) },
    { rotate: progress.interpolate({ inputRange: rotIn, outputRange: rotOut }) },
  ];
}

/** Top-down car, like the ones on real ride-hailing maps. Faces up by default. */
function TopCar({ color, scale = 1, outlined }: { color: string; scale?: number; outlined?: boolean }) {
  const w = 14 * scale;
  const h = 26 * scale;
  return (
    <View
      style={[
        { width: w, height: h, borderRadius: 5 * scale, backgroundColor: color },
        outlined && { borderWidth: 2, borderColor: '#FFFFFF' },
        outlined && shadow.md,
      ]}
    >
      <View style={{ position: 'absolute', top: 5 * scale, left: 2 * scale, right: 2 * scale, height: 6 * scale, borderRadius: 2 * scale, backgroundColor: 'rgba(255,255,255,0.75)' }} />
      <View style={{ position: 'absolute', bottom: 3 * scale, left: 2.5 * scale, right: 2.5 * scale, height: 3 * scale, borderRadius: 1.5 * scale, backgroundColor: 'rgba(255,255,255,0.45)' }} />
    </View>
  );
}

function Cruiser({ size, path, duration, delay }: { size: Size; path: Point[]; duration: number; delay: number }) {
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const anim = Animated.sequence([
      Animated.delay(delay),
      Animated.loop(Animated.timing(progress, { toValue: 1, duration, easing: Easing.linear, useNativeDriver: true })),
    ]);
    anim.start();
    return () => anim.stop();
  }, [progress, duration, delay]);

  return (
    <Animated.View style={{ position: 'absolute', left: 0, top: 0, transform: followPath(progress, path, size, 14, 26) }}>
      <TopCar color="#1C1F26" />
    </Animated.View>
  );
}

const DRIVER_SCALE = 1.3;

function DriverCar({ size, state }: { size: Size; state: DriverState }) {
  const moving = state.phase === 'approach' || state.phase === 'ride';
  const progress = useRef(new Animated.Value(moving ? 0 : 1)).current;
  const onDone = moving ? state.onDone : undefined;
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const duration = moving ? state.duration : 0;

  useEffect(() => {
    if (!moving) return;
    const anim = Animated.timing(progress, {
      toValue: 1,
      duration,
      easing: Easing.inOut(Easing.sin),
      useNativeDriver: true,
    });
    anim.start(({ finished }) => finished && onDoneRef.current?.());
    return () => anim.stop();
  }, [moving, duration, progress]);

  const path = state.phase === 'approach' || state.phase === 'waiting' ? APPROACH_PATH : RIDE_PATH;
  const w = 14 * DRIVER_SCALE;
  const h = 26 * DRIVER_SCALE;

  return (
    <Animated.View style={{ position: 'absolute', left: 0, top: 0, zIndex: 10, transform: followPath(progress, path, size, w, h) }}>
      <TopCar color="#12B76A" scale={DRIVER_SCALE} outlined />
    </Animated.View>
  );
}

/* ---------- Static overlays ---------- */

function RouteLine() {
  return <PathLine points={RIDE_PATH} />;
}

/** Draws a polyline of horizontal/vertical segments (all our roads are axis-aligned). */
function PathLine({ points, color = '#0B0D12' }: { points: Point[]; color?: string }) {
  return (
    <>
      {points.slice(1).map((p, i) => {
        const a = points[i];
        const horizontal = a.y === p.y;
        return (
          <View
            key={i}
            className="absolute rounded-full"
            style={
              horizontal
                ? { backgroundColor: color, height: 5, left: pct(Math.min(a.x, p.x)), top: pct(a.y), width: pct(Math.abs(p.x - a.x)), marginTop: -2.5 }
                : { backgroundColor: color, width: 5, left: pct(a.x), top: pct(Math.min(a.y, p.y)), height: pct(Math.abs(p.y - a.y)), marginLeft: -2.5 }
            }
          />
        );
      })}
    </>
  );
}

function Marker({ point, label, kind }: { point: Point; label?: string; kind: 'pickup' | 'dropoff' }) {
  return (
    <View className="absolute items-center" style={{ left: pct(point.x), top: pct(point.y), width: 160, marginLeft: -80, marginTop: -54 }}>
      {label ? (
        <View className="mb-2 max-w-[150px] rounded-lg bg-ink px-2.5 py-1.5" style={shadow.md}>
          <Text numberOfLines={1} className="text-xs font-semibold text-white">
            {label}
          </Text>
        </View>
      ) : (
        <View className="mb-2 h-[26px]" />
      )}
      <View className={`h-5 w-5 items-center justify-center bg-ink ${kind === 'pickup' ? 'rounded-full' : 'rounded-sm'}`}>
        <View className={`h-2 w-2 bg-white ${kind === 'pickup' ? 'rounded-full' : ''}`} />
      </View>
    </View>
  );
}

function UserDot() {
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.timing(pulse, { toValue: 1, duration: 1800, useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <View className="absolute items-center justify-center" style={{ left: pct(USER.x), top: pct(USER.y), width: 80, height: 80, marginLeft: -40, marginTop: -40 }}>
      <Animated.View
        style={{
          position: 'absolute',
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: '#12B76A',
          opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0] }),
          transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }) }],
        }}
      />
      <View className="h-5 w-5 rounded-full border-[3px] border-white bg-brand" style={shadow.md} />
    </View>
  );
}
