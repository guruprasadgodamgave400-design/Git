import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Image } from 'react-native';

export default function SplashScreen({ onFinish }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    try {
      // Start animation: Fade in (0 to 1) and Scale (0.9 to 1)
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1500, // 1.5 seconds fade
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1500, // 1.5 seconds zoom
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Hold briefly before signaling navigation readiness
        setTimeout(() => {
          if (onFinish) onFinish();
        }, 500); // 0.5 sec delay (Total exactly 2.0 seconds)
      });
    } catch (error) {
      console.warn("Splash animation skipped due to error:", error);
      if (onFinish) onFinish(); // Failsafe navigation
    }
  }, [fadeAnim, scaleAnim, onFinish]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image 
          source={require('../../assets/branding/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
          onError={(e) => console.warn("Failed to load logo image", e.nativeEvent.error)}
        />
        <Text style={styles.title}>SaarthiMitra</Text>
        <Text style={styles.tagline}>Driving Safety, Delivering Trust</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Clean white background to match your logo
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  logo: {
    width: 180, 
    height: 180,
    marginBottom: 20,
  },
  title: {
    fontSize: 42,
    fontFamily: 'sans-serif', // Clean modern font
    fontWeight: 'bold',
    color: '#333333', // Matched to the dark grey text in your logo
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 18,
    color: '#4A4A4A',
    fontWeight: '600',
  },
});
