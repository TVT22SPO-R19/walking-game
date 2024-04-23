import { Audio } from 'expo-av';
import { state$ } from './states';

export async function LevelUpSound() {
  if (state$.settings.soundEnabled.get() == true) {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(require('../sounds/levelUp.mp3'));
    console.log('Setting Volume');
    await sound.setVolumeAsync(0.1);
    console.log('Playing Sound');
    await sound.playAsync();
    let status = await sound.getStatusAsync();
    while (status.isPlaying) {
      status = await sound.getStatusAsync();
    }
    console.log('Unloading Sound');
    await sound.unloadAsync();
  }
}

let soundObject = null;

export async function backgroundMusic() {
  if (soundObject) {
    console.log('Stopping Sound');
    await soundObject.stopAsync();
    console.log('Unloading Sound');
    await soundObject.unloadAsync();
    soundObject = null;
  }

  if (state$.settings.musicEnabled.get() == true) {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(require('../sounds/backgroundMusic.mp3'));
    soundObject = sound;
    console.log('Setting Volume');
    await soundObject.setVolumeAsync(0.1);
    console.log('Playing Sound');
    await soundObject.playAsync();
  }
}