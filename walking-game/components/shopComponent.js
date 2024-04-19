import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { state$ } from './states';
import itemDatabase from './itemDatabase';
import RandomItemView from './randomItemView'; 
import { initItems } from './ItemsComponent';



export default function ShopComponent() {
  const gold = state$.currency.gold.get();                                              //Getting the current values from states.js
  const diamonds = state$.currency.diamonds.get();                                      
  const [euros, setEuros] = useState(20);                                               //and setting some values
  const lootboxCount = state$.lootbox.lootboxCount.get();
  const lootboxGoldPrice = state$.lootbox.lootboxGoldPrice.get();
  const lootboxDiamondPrice = state$.lootbox.lootboxDiamondPrice.get();
  const bundleItems = itemDatabase();

  //The function that needs to be run to init items. 
  const { initializeItemData } = initItems();


  const handlePurchaseBundle = () => {                                                //Function to purchase a starter bundle
    const bundlePrice = bundleItems.itemBundle.cost;
    
    if (gold >= bundlePrice) {
      state$.currency.gold.set(gold - bundlePrice);
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


  
  const handleEuroConversion = (euroAmount) => {                                // Function to handle converting euros into diamonds
    const remainingEuros = euros - euroAmount;
    if (remainingEuros >= 0) {
      const euroToDiamondConversionRate = 2;
      const diamondAmount = euroAmount * euroToDiamondConversionRate;
      setEuros(remainingEuros);
      state$.currency.diamonds.set(diamonds + diamondAmount);
    } else {
      alert("Please spend more money on microtransactions. (Group 19 incorporated isn't liable for mental health and/or financial issues caused by spending money on our shop)");
    }
  };

  // Function to reset state (for testing purposes)
  const handleReset = () => {
    state$.currency.gold.set(1000);
    state$.currency.diamonds.set(10);
    setEuros(20);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.currencyContainer}>
        <Text style={styles.currencyText}>Gold: {gold} 💰</Text>
        <Text style={styles.currencyText}>Diamonds: {diamonds} 💎</Text>
        <Text style={styles.currencyText}>Euros: {euros} €</Text>
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Item Bundle</Text>
        <Text style={styles.bundleDescription}>Bundle includes:</Text>
        {bundleItems.itemBundle.items.map(itemId => (
          <Text key={itemId}>{bundleItems[itemId].name}</Text>
        ))}
        <Text style={styles.bundlePrice}>Price: {bundleItems.itemBundle.cost} Diamonds</Text>
        <TouchableOpacity
          style={styles.buyBundleButton}
          onPress={handlePurchaseBundle}>
          <Text style={styles.buyBundleButtonText}>Buy Bundle</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Buy Random Item</Text>
        <RandomItemView />
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Lootbox</Text>
        <View style={styles.lootboxButtonsContainer}>
          <TouchableOpacity
            style={[styles.lootboxButton, { backgroundColor: 'gold' }]}
            onPress={handlePurchaseWithGold}>
            <Text style={styles.lootboxButtonText}>Buy with Gold</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.lootboxButton, { backgroundColor: 'lightblue' }]}
            onPress={handlePurchaseWithDiamonds}>
            <Text style={styles.lootboxButtonText}>Buy with Diamonds</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Buy more diamonds!</Text>
        <View style={styles.euroConversionButtonsContainer}>
          <TouchableOpacity
            style={[styles.euroConversionButton, { backgroundColor: 'green' }]}
            onPress={() => handleEuroConversion(5)}>
            <Text style={styles.euroConversionButtonText}>Spend 5€ on Diamonds</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.euroConversionButton, { backgroundColor: 'green' }]}
            onPress={() => handleEuroConversion(10)}>
            <Text style={styles.euroConversionButtonText}>Spend 10€ on Diamonds</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.euroConversionButton, { backgroundColor: 'green' }]}
            onPress={() => handleEuroConversion(20)}>
            <Text style={styles.euroConversionButtonText}>Spend 20€ on Diamonds</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetButtonText}>Reset</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'left',
    alignItems: 'left',
  },
  currencyContainer: {
    flexDirection: 'row',
    justifyContent: 'left',
    marginLeft: 15,
    marginTop: 20,
    marginBottom: 20,
  },
  currencyText: {
    fontSize: 16,
  },
  sectionContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: 'left',
    width: '75%',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buyBundleButton: {
    backgroundColor: 'lightgreen',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buyItemButton: {
    backgroundColor: 'lightgreen',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buyItemButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lootboxButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  lootboxButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  lootboxButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  euroConversionButtonsContainer: {
    flexDirection: 'row',
  },
  euroConversionButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  euroConversionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
