import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { state$ } from './states';
import itemDatabase from './itemDatabase';
import RandomItemView from './randomItemView'; 
import { initItems } from './ItemsComponent';



export default function ShopComponent() {
  const gold = state$.currency.gold.get();                                              //Getting the current values from states.js
  const diamonds = state$.currency.diamonds.get();                                      
  const [euros, setEuros] = useState(50);                                               //and setting some values
  const lootboxCount = state$.lootbox.lootboxCount.get();
  const lootboxGoldPrice = state$.lootbox.lootboxGoldPrice.get();
  const lootboxDiamondPrice = state$.lootbox.lootboxDiamondPrice.get();
  const bundleItems = itemDatabase();

  //The function that needs to be run to init items. 
  const { initializeItemData } = initItems();


  const handlePurchaseBundle = () => {                                                    //Function to purchase a starter bundle  
    const bundlePrice = bundleItems.itemBundle.cost;
    const bundleItemsFiltered  = bundleItems.itemBundle.items.filter(itemId => bundleItems[itemId].restricted.includes("bundle"));
    
    if (diamonds >= bundlePrice) {
      state$.currency.diamonds.set(diamonds - bundlePrice);
      alert('Bundle purchased successfully!');
      
      // Add items from the bundle to the inventory
      bundleItems.itemBundle.items.forEach((itemId) => {
        if (!state$.itemData.hasOwnProperty(itemId)) {
          state$.itemData[itemId].set({ level: 1, init: 0 });
          initializeItemData();
        } else {
          let curItem = { ...state$.itemData[itemId].get() };
          curItem.level++;
          state$.itemData[itemId].set(curItem);
          initializeItemData();
          console.log(state$.modifiers.get())

        }
      });
    } else {
      alert("You don't have enough diamonds to purchase the bundle.");
    }
  };


  const handlePurchaseWithGold = () => {                                                // Function to handle lootbox purchase with gold
    if (gold >= lootboxGoldPrice) {
      state$.currency.gold.set(gold - lootboxGoldPrice);
      state$.lootbox.lootboxCount.set(lootboxCount + 1);
    } else {
      alert("You don't have enough gold to purchase a lootbox.");
    }
  };


  const handlePurchaseWithDiamonds = () => {                                      // Function to handle lootbox purchase with diamonds
    if (diamonds >= lootboxDiamondPrice) {
      state$.currency.diamonds.set(diamonds - lootboxDiamondPrice);
      state$.lootbox.lootboxCount.set(lootboxCount + 1);
    } else {
      alert("You don't have enough diamonds to purchase a lootbox.");
    }
  };

  const handleEuroConversion = (euroAmount) => {                                   // Function to handle converting euros into diamonds
    const remainingEuros = euros - euroAmount;
    let diamondAmount;
  
    if (remainingEuros >= 0) {
      if (euroAmount === 1) {
          diamondAmount = 15;
      } else if (euroAmount === 3) {
          diamondAmount = 50;
      } else if (euroAmount === 5) {
          diamondAmount = 90;
      } else if (euroAmount === 10) {
          diamondAmount = 200;
      } else if (euroAmount === 20) {
          diamondAmount = 900;
      } else if (euroAmount === 50) {
          diamondAmount = 1500;
      }
  
      setEuros(remainingEuros);
      state$.currency.diamonds.set(diamonds + diamondAmount);
    } else {
      alert("Please spend more money on microtransactions. (Group 19 incorporated isn't liable for mental health and/or financial issues caused by spending money on our shop)");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.currencyContainer}>
        <Text style={styles.currencyText}>Gold: {gold}💰</Text>
        <Text style={styles.currencyText}>Diamonds: {diamonds}💎</Text>
        <Text style={styles.currencyText}>Euros: {euros}€</Text>
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Beginner Bundle</Text>
        <Text style={styles.bundleDescription}>Bundle includes:</Text>
        {bundleItems.itemBundle.items.map(itemId => (
          <Text key={itemId}>{bundleItems[itemId].name}</Text>
        ))}
        <Text style={styles.bundlePrice}>Price: {bundleItems.itemBundle.cost} Diamonds</Text>
        <TouchableOpacity
          style={styles.buyBundleButton}
          onPress={handlePurchaseBundle}>
          <Text style={styles.buyBundleButtonText}>Buy with Diamonds</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Random Item</Text>
        <RandomItemView />
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Lootbox</Text>
        <View style={styles.lootboxButtonsContainer}>
          <TouchableOpacity
            style={[styles.lootboxButton, { backgroundColor: 'gold' }]}
            onPress={handlePurchaseWithGold}>
            <Text style={styles.lootboxButtonText}>Buy with {lootboxGoldPrice} Gold</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.lootboxButton, { backgroundColor: 'lightblue' }]}
            onPress={handlePurchaseWithDiamonds}>
            <Text style={styles.lootboxButtonText}>Buy with {lootboxDiamondPrice} Diamonds</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Buy more diamonds!</Text>
        <View style={styles.euroConversionButtonsContainer}>
          <TouchableOpacity
            style={styles.euroConversionButton}
            onPress={() => handleEuroConversion(1)}>
            <Text style={styles.euroConversionButtonText}>Spend 1€ on 15 Diamonds</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.euroConversionButton}
            onPress={() => handleEuroConversion(3)}>
            <Text style={styles.euroConversionButtonText}>Spend 3€ on 50 Diamonds</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.euroConversionButton}
            onPress={() => handleEuroConversion(5)}>
            <Text style={styles.euroConversionButtonText}>Spend 5€ on 90 Diamonds</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.euroConversionButton}
            onPress={() => handleEuroConversion(10)}>
            <Text style={styles.euroConversionButtonText}>Spend 10€ on 200 Diamonds</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.euroConversionButton}
            onPress={() => handleEuroConversion(20)}>
            <Text style={styles.euroConversionButtonText}>Spend 20€ on 900 Diamonds</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.euroConversionButton}
            onPress={() => handleEuroConversion(50)}>
            <Text style={styles.euroConversionButtonText}>Spend 50€ on 1500 Diamonds</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );  
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#313338',
    padding: 10,
  },
  currencyContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: '#77dd77',
  },
  currencyText: {
    fontSize: 16,
    marginRight: 10,
  },
  sectionContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: '80%',
    backgroundColor: '#77dd77',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buyBundleButton: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buyBundleButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  lootboxButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    width: '57%',
  },
  lootboxButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: 'lightblue',
  },
  lootboxButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  euroConversionButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  euroConversionButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    margin: 5,
    backgroundColor: 'darkorange',
    width: '45%',
  },
  euroConversionButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  }
});
