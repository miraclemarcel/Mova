import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View } from 'react-native';

type Props = {
  /** Track width in px. Omit to fill the parent's width. */
  width?: number;
  carSize?: number;
  carColor?: string;
  fillColor?: string;
  trackColor?: string;
  /** Duration of one drive across, in ms. */
  duration?: number;
};

/**
 * Mova's loading indicator: a car drives along a road that fills in behind it, on a loop.
 * Same motif as the launch animation, used everywhere something is loading.
 */
export function DriveLoader({
  width,
  carSize = 22,
  carColor = '#0B0D12',
  fillColor = '#12B76A',
  trackColor = 'rgba(11,13,18,0.1)',
  duration = 1300,
}: Props) {
  const [measured, setMeasured] = useState(0);
  const w = width ?? measured;
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(t, { toValue: 1, duration, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.delay(120),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [t, duration]);

  const trackHeight = Math.max(3, Math.round(carSize / 7));
  const travel = Math.max(w - carSize, 0);
  // The car arrives, drives across, then "drives off" (fades) before the next lap.
  const opacity = t.interpolate({ inputRange: [0, 0.08, 0.86, 1], outputRange: [0, 1, 1, 0] });

  return (
    <View
      onLayout={width ? undefined : (e) => setMeasured(e.nativeEvent.layout.width)}
      style={{ width: width ?? '100%', height: carSize + trackHeight }}
    >
      {w > 0 && (
        <>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: trackHeight,
              borderRadius: trackHeight,
              overflow: 'hidden',
              backgroundColor: trackColor,
            }}
          >
            <Animated.View
              style={{
                width: w,
                height: trackHeight,
                backgroundColor: fillColor,
                opacity,
                transform: [
                  { translateX: t.interpolate({ inputRange: [0, 1], outputRange: [carSize * 0.6 - w, travel + carSize * 0.6 - w] }) },
                ],
              }}
            />
          </View>
          <Animated.View
            style={{
              position: 'absolute',
              left: 0,
              bottom: trackHeight - 1,
              opacity,
              transform: [{ translateX: t.interpolate({ inputRange: [0, 1], outputRange: [0, travel] }) }],
            }}
          >
            <MaterialCommunityIcons name="car-side" size={carSize} color={carColor} />
          </Animated.View>
        </>
      )}
    </View>
  );
}
