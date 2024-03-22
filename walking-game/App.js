import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import ItemsComponent from './components/ItemsComponent';
import GameScreen from './components/gameScreen';


export default function App() {
  return (
    <View style={styles.container}>
      <Text>Walking game!</Text>
      <GameScreen></GameScreen>
      <ItemsComponent />

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
