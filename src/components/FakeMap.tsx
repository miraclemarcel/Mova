import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Text, View, type DimensionValue } from 'react-native';

import { shadow } from '@/lib/shadow';

/**
 * Illustrated stand-in for a real map (e.g. react-native-maps).
 * Positions are percentages of the map's size and kept in the upper half,
 * since bottom sheets cover the lower part of the screen.
 */

type Point = { x: number; y: number };

const PICKUP: Point = { x: 26, y: 42 };
const DROPOFF: Point = { x: 72, y: 18 };
const USER: Point = { x: 50, y: 42 };

const DRIVER_POSITIONS = {
  approaching: { x: 8, y: 42 },
  pickup: { x: 26, y: 42 },
  enRoute: { x: 72, y: 32 },
} satisfies Record<string, Point>;

export type DriverPosition = keyof typeof DRIVER_POSITIONS;

const H_ROADS = [18, 42, 66, 88];
const V_ROADS = [26, 50, 72, 92];
const IDLE_CARS: (Point & { rotate: string })[] = [
  { x: 38, y: 18, rotate: '90deg' },
  { x: 72, y: 54, rotate: '0deg' },
  { x: 14, y: 66, rotate: '90deg' },
  { x: 50, y: 26, rotate: '0deg' },
  { x: 86, y: 42, rotate: '90deg' },
];

const pct = (n: number) => `${n}%` as DimensionValue;

type Props = {
  route?: boolean;
  pickupLabel?: string;
  dropoffLabel?: string;
  showCars?: boolean;
  driver?: DriverPosition | null;
};

export function FakeMap({ route, pickupLabel, dropoffLabel, showCars, driver }: Props) {
  return (
    <View className="absolute inset-0 overflow-hidden bg-[#EEF1EA]">
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

      {showCars &&
        IDLE_CARS.map((car, i) => (
          <View key={i} className="absolute" style={{ left: pct(car.x), top: pct(car.y), marginLeft: -12, marginTop: -12 }}>
            <View style={{ transform: [{ rotate: car.rotate }] }}>
              <MaterialCommunityIcons name="car" size={24} color="#1C1F26" />
            </View>
          </View>
        ))}

      {!route && <UserDot />}
      {route && <Marker point={PICKUP} label={pickupLabel} kind="pickup" />}
      {route && <Marker point={DROPOFF} label={dropoffLabel} kind="dropoff" />}
      {driver && <DriverMarker point={DRIVER_POSITIONS[driver]} />}
    </View>
  );
}

function RouteLine() {
  return (
    <>
      <View
        className="absolute h-[5px] rounded-full bg-ink"
        style={{ left: pct(PICKUP.x), top: pct(PICKUP.y), width: pct(DROPOFF.x - PICKUP.x), marginTop: -2.5 }}
      />
      <View
        className="absolute w-[5px] rounded-full bg-ink"
        style={{ left: pct(DROPOFF.x), top: pct(DROPOFF.y), height: pct(PICKUP.y - DROPOFF.y), marginLeft: -2.5 }}
      />
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

function DriverMarker({ point }: { point: Point }) {
  return (
    <View
      className="absolute h-10 w-10 items-center justify-center rounded-full bg-white"
      style={[shadow.md, { left: pct(point.x), top: pct(point.y), marginLeft: -20, marginTop: -20 }]}
    >
      <MaterialCommunityIcons name="car" size={22} color="#12B76A" />
    </View>
  );
}
