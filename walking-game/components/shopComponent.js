import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function ShopComponent() {
  const [gold, setGold] = useState(100);
  const [diamonds, setDiamonds] = useState(10);
  const [euros, setEuros] = useState(20);
  const [lootboxCount, setLootboxCount] = useState(0);
  const lootboxGoldPrice = 10;
  const lootboxDiamondPrice = 1;

  // Function to handle purchase with gold
  const handlePurchaseWithGold = () => {
    if (gold >= lootboxGoldPrice) {
      setGold(gold - lootboxGoldPrice);
      setLootboxCount(lootboxCount + 1);
    } else {
      alert("You don't have enough gold to purchase a lootbox.");
    }
  };

  // Function to handle purchase with diamonds
  const handlePurchaseWithDiamonds = () => {
    if (diamonds >= lootboxDiamondPrice) {
      setDiamonds(diamonds - lootboxDiamondPrice);
      setLootboxCount(lootboxCount + 1);
    } else {
      alert("You don't have enough diamonds to purchase a lootbox.");
    }
  };

  // Function to handle euro conversion to diamonds
  const handleEuroConversion = (euroAmount) => {
    const remainingEuros = euros - euroAmount;
    if (remainingEuros >= 0) {
      const euroToDiamondConversionRate = 1;
      const diamondAmount = euroAmount * euroToDiamondConversionRate;
      setEuros(remainingEuros); // Update euros with the remaining amount
      setDiamonds(diamonds + diamondAmount);
    } else {
      alert("Please spend more money on microtransactions. (Group 19 incorporated isn't liable for mental health and/or financial issues caused by spending money on our shop)");
    }
  };

  // Function to reset state (for testing purposes)
  const handleReset = () => {
    setGold(100);
    setDiamonds(10);
    setEuros(20);
    setLootboxCount(0);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.currencyContainer}>
        <Text style={styles.currencyText}>Gold: {gold} 💰</Text>
        <Text style={styles.currencyText}>Diamonds: {diamonds} 💎</Text>
        <Text style={styles.currencyText}>Euros: {euros} €</Text>
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Buy Item</Text>
        <TouchableOpacity
          style={styles.buyItemButton}
          onPress={() => alert("Placeholder: Buy Item")}>
          <Text style={styles.buyItemButtonText}>Buy</Text>
        </TouchableOpacity>
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
            <Text style={styles.euroConversionButtonText}>5 diamonds for 5€</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.euroConversionButton, { backgroundColor: 'green' }]}
            onPress={() => handleEuroConversion(10)}>
            <Text style={styles.euroConversionButtonText}>10 diamonds for 10€</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.euroConversionButton, { backgroundColor: 'green' }]}
            onPress={() => handleEuroConversion(20)}>
            <Text style={styles.euroConversionButtonText}>20 diamonds for 20€</Text>
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
  buyItemButton: {
    backgroundColor: 'blue',
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
