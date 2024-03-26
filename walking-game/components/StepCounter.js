import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { state$, stepCount } from './states';

export default function StepCounter() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');

  const subscribe = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(String(isAvailable));

    if (isAvailable) {
      return Pedometer.watchStepCount(result => {
        state$.stepData.currSteps.set(result.steps - state$.stepData.totalSteps.get());
        state$.stepData.totalSteps.set(result.steps);
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
    <View style={styles.container}>
      <Text>Total steps taken {state$.stepData.totalSteps.get()}</Text>
      <Text>Steps since last update {state$.stepData.currSteps.get()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});