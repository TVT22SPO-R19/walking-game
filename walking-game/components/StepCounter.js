import { useState, useEffect } from 'react';
import { Alert, Linking, Text, View } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { state$ } from './states';

export default function StepCounter() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');

  const subscribe = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(String(isAvailable));

    if (isAvailable) {
      const savedSteps = state$.stepData.totalSteps.get(); //Load saved steps
      let lastTotalSteps = savedSteps;
      Pedometer.watchStepCount(result => {
        if (result.steps !== 1) {
          const totalSteps = result.steps + savedSteps; // New total steps
          state$.stepData.totalSteps.set(totalSteps);
          state$.stepData.currSteps.set(totalSteps - lastTotalSteps + state$.stepData.currSteps.get()); // Steps between updates
          lastTotalSteps = totalSteps;
        }
      });
    }
  };

  async function requestPermissions() {
    await Pedometer.requestPermissionsAsync();
    const { status } = await Pedometer.getPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        "Permission Required",
        "This game needs physical activity permission to function.",
        [
          {
            text: "Open Settings",
            onPress: () => Linking.openSettings() // Open permission settings
          }
        ]
      );
    }
  }

  useEffect(() => {
    let subscription;
    (async () => {
      await requestPermissions();
      subscription = await subscribe();
    })();
    return () => subscription && subscription.remove();
  }, []);

  return null;
}