import { StatusBar } from 'expo-status-bar';
import { Button, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import StepCounter from './components/StepCounter';
import ItemsComponent from './components/ItemsComponent';
import GameScreen from './components/gameScreen';
import SettingsModal from './components/Settings';
import ShopComponent from './components/shopComponent';
import RandomItemView from './components/randomItemView';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { enableReactTracking } from "@legendapp/state/config/enableReactTracking";
import { useState } from 'react';
// This makes React components automatically track get() calls to re-render
enableReactTracking({ auto: true });

function Placeholder() { //Placeholder screen, remove when all screens are implemented
  return (
    <View>
      <Text>Hello!</Text>
    </View>
  )
}

const Tab = createBottomTabNavigator();

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
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
        <Tab.Screen name="Lootbox" component={Placeholder}
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity
                style={{ justifyContent: 'center', alignItems: 'center' }}
                onPress={() => setModalVisible(true)}
              >
                <Image source={require('./assets/favicon.png')} />
              </TouchableOpacity>
            ),
            tabBarIcon: ({ focused }) => (
              <TouchableOpacity style={[StyleSheet.absoluteFillObject, { backgroundColor: focused ? 'cyan' : 'paleturquoise', justifyContent: 'center', alignItems: 'center' }]}
                onPress={() => navigation.navigate('Lootbox')}>
                <Image source={require('./assets/favicon.png')} />
              </TouchableOpacity>
            ),
          })}
        />

        <Tab.Screen name="Store" component={ShopComponent}
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity
                style={{ justifyContent: 'center', alignItems: 'center' }}
                onPress={() => setModalVisible(true)}
              >
                <Image source={require('./assets/favicon.png')} />
              </TouchableOpacity>
            ),
            tabBarIcon: ({ focused }) => (
              <TouchableOpacity style={[StyleSheet.absoluteFillObject, { backgroundColor: focused ? 'green' : 'lightgreen', justifyContent: 'center', alignItems: 'center' }]}
                onPress={() => navigation.navigate('Store')}>
                <Image source={require('./assets/favicon.png')} />
              </TouchableOpacity>
            ),
          })}
        />

        <Tab.Screen name="Game" component={GameScreen}
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity
                style={{ justifyContent: 'center', alignItems: 'center' }}
                onPress={() => setModalVisible(true)}
              >
                <Image source={require('./assets/favicon.png')} />
              </TouchableOpacity>
            ),
            tabBarIcon: ({ focused }) => (
              <TouchableOpacity style={[StyleSheet.absoluteFillObject, { backgroundColor: focused ? 'gold' : 'yellow', justifyContent: 'center', alignItems: 'center' }]}
                onPress={() => navigation.navigate('Game')}>
                <Image source={require('./assets/favicon.png')} />
              </TouchableOpacity>
            ),
          })}
        />

        <Tab.Screen name="Items" component={ItemsComponent}
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity
                style={{ justifyContent: 'center', alignItems: 'center' }}
                onPress={() => setModalVisible(true)}
              >
                <Image source={require('./assets/favicon.png')} />
              </TouchableOpacity>
            ),
            tabBarIcon: ({ focused }) => (
              <TouchableOpacity
                style={[StyleSheet.absoluteFillObject, { backgroundColor: focused ? 'darkorange' : 'orange', justifyContent: 'center', alignItems: 'center' }]}
                onPress={() => navigation.navigate('Items')}
              >
                <Image source={require('./assets/favicon.png')} />
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
        <SettingsModal closeModal={() => setModalVisible(false)} />
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
