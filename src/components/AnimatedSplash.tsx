import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

const LOGO_SIZE = 120; // Must match `imageWidth` of expo-splash-screen in app.json for a seamless handoff.
const ROAD_WIDTH = 180;
const WORD = ['m', 'o', 'v', 'a'];
const INK = '#0B0D12';
const GREEN = '#12B76A';

type Props = {
  /** The app is ready to be shown (e.g. persisted state has loaded). */
  ready: boolean;
  onFinish: () => void;
};

export function AnimatedSplash({ ready, onFinish }: Props) {
  const pop = useRef(new Animated.Value(1)).current;
  const lift = useRef(new Animated.Value(0)).current;
  const ripple = useRef(new Animated.Value(0)).current;
  const letters = useRef(WORD.map(() => new Animated.Value(0))).current;
  const road = useRef(new Animated.Value(0)).current;
  const tagline = useRef(new Animated.Value(0)).current;
  const exit = useRef(new Animated.Value(0)).current;
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const ease = Easing.out(Easing.cubic);
    const ripples = Animated.loop(
      Animated.timing(ripple, { toValue: 1, duration: 1400, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    );
    ripples.start();

    Animated.sequence([
      Animated.delay(200),
      // Little "tap" on the logo before it launches.
      Animated.timing(pop, { toValue: 0.86, duration: 160, easing: ease, useNativeDriver: true }),
      Animated.spring(pop, { toValue: 1, friction: 4, tension: 160, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(lift, { toValue: 1, duration: 650, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
        Animated.sequence([
          Animated.delay(250),
          Animated.stagger(
            80,
            letters.map((l) => Animated.spring(l, { toValue: 1, friction: 6, tension: 90, useNativeDriver: true })),
          ),
        ]),
      ]),
      Animated.parallel([
        Animated.timing(road, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(tagline, { toValue: 1, duration: 500, delay: 250, easing: ease, useNativeDriver: true }),
      ]),
      Animated.delay(250),
    ]).start(() => setIntroDone(true));

    return () => ripples.stop();
  }, [pop, lift, ripple, letters, road, tagline]);

  useEffect(() => {
    if (!introDone || !ready) return;
    Animated.timing(exit, { toValue: 1, duration: 450, easing: Easing.in(Easing.cubic), useNativeDriver: true }).start(
      () => onFinish(),
    );
  }, [introDone, ready, exit, onFinish]);

  const rippleRing = (offset: number) => {
    const p = Animated.modulo(Animated.add(ripple, offset), 1);
    return (
      <Animated.View
        style={[
          styles.ring,
          {
            opacity: Animated.multiply(
              p.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] }),
              lift.interpolate({ inputRange: [0, 0.6], outputRange: [1, 0], extrapolate: 'clamp' }),
            ),
            transform: [{ scale: p.interpolate({ inputRange: [0, 1], outputRange: [0.7, 2.6] }) }],
          },
        ]}
      />
    );
  };

  return (
    <Animated.View
      // Hide the native splash only once this identical-looking screen is on screen.
      onLayout={() => SplashScreen.hide()}
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        styles.container,
        {
          opacity: exit.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
          transform: [{ scale: exit.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] }) }],
        },
      ]}
    >
      <View style={styles.center}>
        {rippleRing(0)}
        {rippleRing(0.5)}
        <Animated.Image
          source={require('../../assets/splash-icon.png')}
          style={{
            width: LOGO_SIZE,
            height: LOGO_SIZE,
            transform: [
              { translateY: lift.interpolate({ inputRange: [0, 1], outputRange: [0, -84] }) },
              { scale: Animated.multiply(pop, lift.interpolate({ inputRange: [0, 1], outputRange: [1, 0.58] })) },
              { rotate: lift.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) },
            ],
          }}
        />
      </View>

      <View style={[styles.center, { paddingTop: 76 }]}>
        <View style={styles.wordRow}>
          {WORD.map((char, i) => (
            <Animated.Text
              key={char}
              style={[
                styles.word,
                {
                  opacity: letters[i],
                  transform: [{ translateY: letters[i].interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }],
                },
              ]}
            >
              {char}
            </Animated.Text>
          ))}
          <Animated.Text style={[styles.word, { color: GREEN, opacity: letters[WORD.length - 1] }]}>.</Animated.Text>
        </View>

        <View style={styles.roadWrap}>
          <View style={styles.road}>
            <Animated.View
              style={[
                styles.roadFill,
                { transform: [{ translateX: road.interpolate({ inputRange: [0, 1], outputRange: [-ROAD_WIDTH, 0] }) }] },
              ]}
            />
          </View>
          <Animated.View
            style={[
              styles.car,
              {
                opacity: road.interpolate({ inputRange: [0, 0.05, 1], outputRange: [0, 1, 1] }),
                transform: [{ translateX: road.interpolate({ inputRange: [0, 1], outputRange: [-12, ROAD_WIDTH - 12] }) }],
              },
            ]}
          >
            <MaterialCommunityIcons name="car-side" size={24} color="#FFFFFF" />
          </Animated.View>
        </View>

        <Animated.View
          style={{
            opacity: tagline,
            transform: [{ translateY: tagline.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }],
          }}
        >
          <Text style={styles.tagline}>Go anywhere, in minutes.</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: INK, zIndex: 100, elevation: 100 },
  center: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE / 2,
    borderWidth: 2,
    borderColor: GREEN,
  },
  wordRow: { flexDirection: 'row', alignItems: 'flex-end' },
  word: { color: '#FFFFFF', fontSize: 56, fontWeight: '800', letterSpacing: -1.5 },
  roadWrap: { width: ROAD_WIDTH, height: 30, marginTop: 6, justifyContent: 'flex-end' },
  road: { height: 4, borderRadius: 2, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.12)' },
  roadFill: { width: ROAD_WIDTH, height: 4, backgroundColor: GREEN },
  car: { position: 'absolute', left: 0, bottom: 2 },
  tagline: { marginTop: 14, fontSize: 15, color: '#8A909C', fontWeight: '500' },
});
