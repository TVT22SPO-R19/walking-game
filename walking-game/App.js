import { StatusBar } from 'expo-status-bar';
import { Button, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import StepCounter from './components/StepCounter';
import ItemsComponent from './components/ItemsComponent';
import GameScreen from './components/gameScreen';
import SettingsModal from './components/Settings';
import ShopComponent from './components/shopComponent';
import RandomItemView from './components/randomItemView';
import LootboxScreen from './components/lootboxScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons'
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import { enableReactTracking } from "@legendapp/state/config/enableReactTracking";
import { useEffect, useState } from 'react';
import { backgroundMusic } from './components/sounds';
import { state$ } from './components/states';
// This makes React components automatically track get() calls to re-render
enableReactTracking({ auto: true });

const Tab = createBottomTabNavigator();

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [ModalPrimaryColor, setModalPrimaryColor] = useState('white');
  
  useEffect(() => {
    backgroundMusic();
  }, [state$.settings.musicEnabled.get()]);

  return (
    <NavigationContainer>
      <StepCounter />
      <Tab.Navigator
        initialRouteName='Game'
        screenOptions={{
          tabBarShowLabel: false,
          lazy: false
        }}
      >
        <Tab.Screen name="Lootbox" component={LootboxScreen}
          options={({ navigation }) => ({
            headerStyle: { backgroundColor: 'paleturquoise' },
            headerRight: () => (
              <TouchableOpacity
                style={{ justifyContent: 'center', alignItems: 'center' }}
                onPress={() => {
                  setModalVisible(true)
                  setModalPrimaryColor('paleturquoise');
                }}
              >
                <Icon name='settings' size={40} />
              </TouchableOpacity>
            ),
            tabBarIcon: ({ focused }) => (
              <TouchableOpacity style={[StyleSheet.absoluteFillObject, { backgroundColor: 'paleturquoise', justifyContent: 'center', alignItems: 'center' }]}
                onPress={() => navigation.navigate('Lootbox')}>
                <IconMC name='treasure-chest' size={40} color={focused ? 'rgba(0,0,0,1)' : 'rgba(0,0,0,0.3)'} />
              </TouchableOpacity>
            ),
          })}
        />

        <Tab.Screen name="Store" component={ShopComponent}
          options={({ navigation }) => ({
            headerStyle: { backgroundColor: 'lightgreen' },
            headerRight: () => (
              <TouchableOpacity
                style={{ justifyContent: 'center', alignItems: 'center' }}
                onPress={() => {
                  setModalVisible(true)
                  setModalPrimaryColor('lightgreen');
                }}

              >
                <Icon name='settings' size={40} />
              </TouchableOpacity>
            ),
            tabBarIcon: ({ focused }) => (
              <TouchableOpacity style={[StyleSheet.absoluteFillObject, { backgroundColor: 'lightgreen', justifyContent: 'center', alignItems: 'center' }]}
                onPress={() => navigation.navigate('Store')}>
                <Icon name='store' size={40} color={focused ? 'rgba(0,0,0,1)' : 'rgba(0,0,0,0.3)'} />
              </TouchableOpacity>
            ),
          })}
        />

        <Tab.Screen name="Game" component={GameScreen}
          options={({ navigation }) => ({
            title: 'Walking game',
            headerStyle: { backgroundColor: 'yellow' },
            headerRight: () => (
              <TouchableOpacity
                style={{ justifyContent: 'center', alignItems: 'center' }}
                onPress={() => {
                  setModalVisible(true)
                  setModalPrimaryColor('yellow');
                }}
              >
                <Icon name='settings' size={40} />
              </TouchableOpacity>
            ),
            tabBarIcon: ({ focused }) => (
              <TouchableOpacity
                style={[StyleSheet.absoluteFillObject, { backgroundColor: 'yellow', justifyContent: 'center', alignItems: 'center' }]}
                onPress={() => navigation.navigate('Game')}
              >
                <Icon name='directions-walk' size={40} color={focused ? 'rgba(0,0,0,1)' : 'rgba(0,0,0,0.3)'} />
              </TouchableOpacity>
            )
          })}
        />

        <Tab.Screen name="Items" component={ItemsComponent}
          options={({ navigation }) => ({
            headerStyle: { backgroundColor: 'orange' },
            headerRight: () => (
              <TouchableOpacity
                style={{ justifyContent: 'center', alignItems: 'center' }}
                onPress={() => {
                  setModalVisible(true)
                  setModalPrimaryColor('orange');
                }}
              >
                <Icon name='settings' size={40} />
              </TouchableOpacity>
            ),
            tabBarIcon: ({ focused }) => (
              <TouchableOpacity
                style={[StyleSheet.absoluteFillObject, { backgroundColor: 'orange', justifyContent: 'center', alignItems: 'center' }]}
                onPress={() => navigation.navigate('Items')}
              >
                <Icon name='backpack' size={40} color={focused ? 'rgba(0,0,0,1)' : 'rgba(0,0,0,0.3)'} />
              </TouchableOpacity>
            ),
          })}
        />
      </Tab.Navigator>
      <StatusBar style="auto" />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <SettingsModal closeModal={() => setModalVisible(false)} primaryColor={ModalPrimaryColor} />
      </Modal>
    </NavigationContainer>
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
