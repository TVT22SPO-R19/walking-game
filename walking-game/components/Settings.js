import React, { useState, useEffect } from 'react';
import { View, Text, Button, Switch, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.title}>Settings Page</Text>
      <Button title="Close Settings" onPress={closeModal} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
});

export default SettingsModal;