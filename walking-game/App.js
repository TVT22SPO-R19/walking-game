import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StepCounter from './components/StepCounter';
import ItemsComponent from './components/ItemsComponent';
import GameScreen from './components/gameScreen';

import { enableReactTracking } from "@legendapp/state/config/enableReactTracking";
import ShopComponent from './components/shopComponent';
// This makes React components automatically track get() calls to re-render
enableReactTracking({ auto: true });

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Walking game!</Text>
      {<StepCounter />}
      {<GameScreen></GameScreen>}
      {<ItemsComponent />}
      {<ShopComponent />}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
