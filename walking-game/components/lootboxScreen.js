import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import ItemDatabase from './itemDatabase';
import { state$ } from './states';
import { initItems } from './ItemsComponent';


const LootboxScreen = () => {

  const { initializeItemData } = initItems();

  const gold = state$.currency.gold.get();
  const diamonds = state$.currency.diamonds.get();

  const lootboxCount = state$.lootbox.lootboxCount.get();
  const lootboxGoldPrice = state$.lootbox.lootboxGoldPrice.get();
  const lootboxDiamondPrice = state$.lootbox.lootboxDiamondPrice.get();

  const items = ItemDatabase();


  //filter for item keyword, lootboxes give only items marked as lootbox items
  const itemFilter = (items, keyword) => {
    const filteredItems = {};
    for (const key in items) {
        if (items.hasOwnProperty(key)) {
            const item = items[key];
            if (item.restricted === keyword) {
                filteredItems[key] = item;
            }
        }
    }
    return filteredItems;
};

  //function to purchase lootboxes with gold
  const handlePurchaseWithGold = () => {
    if (gold >= lootboxGoldPrice) {
      state$.currency.gold.set(gold - lootboxGoldPrice);
      state$.lootbox.lootboxCount.set(lootboxCount + 1);
    } else {
      Alert.alert("Not enough gold", "You don't have enough gold to purchase a lootbox.");
    }
  };

  //function to purchase lootboxes with diamonds
  const handlePurchaseWithDiamonds = () => {
    if (diamonds >= lootboxDiamondPrice) {
      state$.currency.diamonds.set(diamonds - lootboxDiamondPrice);
      state$.lootbox.lootboxCount.set(lootboxCount + 1);
    } else {
      Alert.alert("You don't have enough diamonds to purchase a lootbox.");
    }
  };

  //function that checks if there are more than zero lootboxes and then displays a pop-up alert with the opened item
  const openLootbox = () => {
    if (lootboxCount > 0) {
      state$.lootbox.lootboxCount.set(lootboxCount - 1); //removes one lootbox from lootboxCount when one is opened
      const lootboxItems = Object.values(itemFilter(items, "lootbox")); //uses the filter function to filter ItemDatabase's dictionary only retaining items tagged 'lootbox'
      const randomIndex = Math.floor(Math.random() * lootboxItems.length); //selects a random item
      const selectedItem = lootboxItems[randomIndex]; //inserts the random item into selectedItem

      const selectedItemName = selectedItem.name; //get the name of the selected item
      console.log(selectedItem);
      const selectedItemID = Object.keys(items).find(key => items[key].name === selectedItemName);

      //tarkistaa onko esinettä, lisää jos ei
      if (!state$.itemData.hasOwnProperty(selectedItemID)) {
        state$.itemData[selectedItemID].set({ level: 1, init: 0 });
        initializeItemData();
        console.log(state$.itemData.get());
      } else if (state$.itemData.hasOwnProperty(selectedItemID)) { //jos esine on, levelaa sitä
        let curItem = { ...state$.itemData[selectedItemID].get() }
        curItem.level++;
        state$.itemData[selectedItemID].set(curItem);
        initializeItemData();
      }

      Alert.alert("Lootbox opened!", `You received: ${selectedItem.name} \n\nRarity: ${selectedItem.rarity}`);
    } else {
      Alert.alert("No lootboxes", "You don't have any lootboxes to open.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.currencyContainer}>
        <Text style={styles.currencyText}>Gold: {gold}💰</Text>
        <Text style={styles.currencyText}>Diamonds: {diamonds}💎</Text>
        <Text style={styles.currencyText}>Lootboxes: {lootboxCount}🧰</Text>
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.buttonDescription}>Price: {lootboxDiamondPrice} Diamonds</Text>
        <TouchableOpacity
          style={styles.buyLootboxButton}
          onPress={handlePurchaseWithDiamonds}>
          <Text style={styles.lootboxButtonText}>Buy with Diamonds</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.buttonDescription}>Price: {lootboxGoldPrice} Gold</Text>
          <TouchableOpacity
              style={styles.buyLootboxButton}
              onPress={handlePurchaseWithGold}>
              <Text style={styles.lootboxButtonText}>Buy with Gold</Text>
          </TouchableOpacity>
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.buttonDescription}>You have {lootboxCount} lootboxes</Text>
          <TouchableOpacity
            style={styles.buyLootboxButton}
            onPress={openLootbox}>
            <Text style={styles.lootboxButtonText}>Open lootbox</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#313338',
    padding: 10,
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
  },
  currencyContainer: {
    
    marginLeft: 10,
    marginRight: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: '15%',
    borderWidth: 2,
    borderColor: '#453C67',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#46C2CB',
  },
  currencyText: {
    fontSize: 16,
    marginRight: 10,
  },
  sectionContainer: {
    borderWidth: 1,
    borderColor: '#453C67',
    borderRadius: 10,
    borderWidth: 2,
    padding: 10,
    marginBottom: 10,
    width: '90%',
    backgroundColor: '#46C2CB',
  },
  buyLootboxButton: {
    backgroundColor: '#6D67E4',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  lootboxButtonText: {
    fontSize: 16,
    marginRight: 10,
  },
  buttonDescription: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 16,
    marginRight: 10,
  },

});

export default LootboxScreen;
