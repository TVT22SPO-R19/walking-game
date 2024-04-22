import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { state$ } from './states';

const SettingsModal = ({ closeModal, primaryColor }) => {
  const soundEnabled = state$.settings.soundEnabled.get();
  const musicEnabled = state$.settings.musicEnabled.get();

  const toggleSound = () => {
    state$.settings.soundEnabled.set(!soundEnabled);
  };

  const toggleMusic = () => {
    state$.settings.musicEnabled.set(!musicEnabled);
  };
  
  return (
    <View style={[styles.container]}>
      <View style={[styles.background]}>
        <View style={styles.setting}>
          <Text style={styles.title}>Settings</Text>
          <TouchableOpacity onPress={closeModal}>
            <Icon name='close' size={40} />
          </TouchableOpacity>
        </View>

        <View style={styles.setting}>
          <Text style={styles.text}>Sound:</Text>
          <Switch
            trackColor={{true: 'white'}}
            thumbColor={primaryColor}
            value={soundEnabled}
            onValueChange={toggleSound}
          />
        </View>

        <View style={styles.setting}>
          <Text style={styles.text}>Music:</Text>
          <Switch
            trackColor={{true: 'white'}}
            thumbColor={primaryColor}
            value={musicEnabled}
            onValueChange={toggleMusic}
          />
        </View>
        
        <Text style={styles.title}>Stats</Text>
        <Text style={styles.text}>Total steps taken: {state$.stepData.totalSteps.get()}</Text>
        <Text style={styles.text}>Walking multiplier: {state$.modifiers.walkingMultiplier.get()}</Text>
        <Text style={styles.text}>Walking power: {state$.modifiers.walkingPower.get()}</Text>
        <Text style={styles.text}>Strenght power: {state$.skills.strength.power.get()}</Text>
        <Text style={styles.text}>Agility power: {state$.skills.agility.power.get()}</Text>
        <Text style={styles.text}>Stamina power: {state$.skills.stamina.power.get()}</Text>
        <Text style={styles.text}>intelligence power: {state$.skills.intelligence.power.get()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)'
  },
  background: {
    padding: 40,
    backgroundColor: '#313338'
  },
  title: {
    fontSize: 24,
    color: 'white'
  },
  text: {
    color: 'white'
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default SettingsModal;