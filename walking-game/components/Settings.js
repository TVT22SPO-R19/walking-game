import React, { useState, useEffect } from 'react';
import { View, Text, Button, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { state$ } from './states';

const SettingsModal = ({ closeModal, backgroundColor }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkmodeEnabled, setDarkmodeEnabled] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const soundSetting = await AsyncStorage.getItem('soundEnabled');
      const darkmodeSetting = await AsyncStorage.getItem('darkmodeEnabled');

      if (soundSetting !== null) {
        setSoundEnabled(JSON.parse(soundSetting));
      }
      if (darkmodeSetting !== null) {
        setDarkmodeEnabled(JSON.parse(darkmodeSetting));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('soundEnabled', JSON.stringify(soundEnabled));
      await AsyncStorage.setItem('darkmodeEnabled', JSON.stringify(darkmodeEnabled));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  const toggleDarkmode = () => {
    setDarkmodeEnabled(!darkmodeEnabled);
  };

  useEffect(() => {
    saveSettings();
  }, [soundEnabled, darkmodeEnabled]);

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      <View style={[styles.background, { backgroundColor: backgroundColor }]}>
        <View style={styles.setting}>
          <Text style={styles.title}>Settings</Text>
          <TouchableOpacity onPress={closeModal}>
            <Icon name='close' size={40} />
          </TouchableOpacity>
        </View>
        <View style={styles.setting}>
          <Text>Sound:</Text>
          <Switch
            value={soundEnabled}
            onValueChange={toggleSound}
          />
        </View>
        <View style={styles.setting}>
          <Text>Dark Mode:</Text>
          <Switch
            value={darkmodeEnabled}
            onValueChange={toggleDarkmode}
          />
        </View>
        <Text style={styles.title}>Stats</Text>
        <Text>Total steps taken: {state$.stepData.totalSteps.get()}</Text>
        <Text>Walking multiplier: {state$.modifiers.walkingMultiplier.get()}</Text>
        <Text>Walking power: {state$.modifiers.walkingPower.get()}</Text>
        <Text>Strenght power: {state$.skills.strength.power.get()}</Text>
        <Text>Agility power: {state$.skills.agility.power.get()}</Text>
        <Text>Stamina power: {state$.skills.stamina.power.get()}</Text>
        <Text>intelligence power: {state$.skills.intelligence.power.get()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    padding: 40
  },
  title: {
    fontSize: 24,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default SettingsModal;