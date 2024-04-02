import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { state$ } from './states';

export default function StepCounter() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');

  const savedSteps = state$.stepData.totalSteps.get(); //Load saved steps
  const subscribe = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(String(isAvailable));

    if (isAvailable) {
      let lastTotalSteps = savedSteps;
      Pedometer.watchStepCount(result => {
        const totalSteps = result.steps + savedSteps; // New total steps
        state$.stepData.totalSteps.set(totalSteps);
        state$.stepData.currSteps.set(totalSteps - lastTotalSteps + state$.stepData.currSteps.get()); // Steps between updates
        lastTotalSteps = totalSteps;
      });
    }
  };

  useEffect(() => {
    let subscription;
    subscribe().then((sub) => {
      subscription = sub;
    });

    return () => subscription && subscription.remove();
  }, []);

  //Temp visuals for testing
  return (
    <View>
      <Text>Total steps taken: {state$.stepData.totalSteps.get()}</Text>
      <Text>Unused steps: {state$.stepData.currSteps.get()}</Text>
    </View>
  );
}