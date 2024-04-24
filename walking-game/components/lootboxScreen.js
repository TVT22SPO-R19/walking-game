import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import ItemDatabase from './itemDatabase';
import { state$ } from './states';
import { initItems } from './ItemsComponent';
import chest from '../assets/chest.png';


const LootboxScreen = () => {

  const { initializeItemData } = initItems();

  const [tapCount, setTapCount] = useState(0); //lootboxin avauspainallusten määrä
  const tapThreshold = 49;  //kuinka monesti pitää painaa että lootbox aukeaa,
  //kannattaa laittaa -1 siitä lopullisesta halutusta summasta :D
  //alhaalla määritelty näkymään +1 niin ei renderöidy 0 taps remaining vaan 1

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

  const determineRarity = () => {
    //generate a random number between 1 and 100
    const randomNum = Math.floor(Math.random() * 100) + 1;

    //rarity table for the random number
    if (randomNum >= 86) {
      return 'Legendary';
    } else if (randomNum >= 51) {
      return 'Rare';
    } else {
      return 'Common';
    }
  };

  const filterItemsByRarity = (lootboxItems, selectedRarity) => {
    return Object.values(lootboxItems).filter(item => item.rarity === selectedRarity); //filters the items based on rarity
  };

  const selectRandomItem = (filteredItems) => {
    const randomIndex = Math.floor(Math.random() * filteredItems.length);
    return filteredItems[randomIndex];
  };

  //function to test rarity distribution, call in another function if needed
  /*  const testDetermineRarity = () => {
      const results = { 'Legendary': 0, 'Rare': 0, 'Common': 0 };
      const testCount = 10000;
  
      // Run the function a large number of times to see the distribution of rarities
      for (let i = 0; i < testCount; i++) {
          const rarity = determineRarity();
          results[rarity]++;
      }
  
      console.log('Distribution of Rarities:');
      console.log(`Legendary: ${results['Legendary']} (${(results['Legendary'] / testCount * 100).toFixed(2)}%)`);
      console.log(`Rare: ${results['Rare']} (${(results['Rare'] / testCount * 100).toFixed(2)}%)`);
      console.log(`Common: ${results['Common']} (${(results['Common'] / testCount * 100).toFixed(2)}%)`);
  };*/

  const openLootbox = () => {


    if (lootboxCount > 0 && tapCount >= tapThreshold) { //if there are lootboxes and threshold for taps is full then item drops
      setTapCount(0);
      state$.lootbox.lootboxCount.set(lootboxCount - 1); //removes one lootbox from lootboxCount when one is opened
      const lootboxItems = Object.values(itemFilter(items, "lootbox")); //uses the filter function to filter ItemDatabase's dictionary only retaining items tagged 'lootbox'

      const selectedRarity = determineRarity();
      const filteredItems = filterItemsByRarity(lootboxItems, selectedRarity);

      //item drop logic
      const selectedItem = selectRandomItem(filteredItems);
      const selectedItemName = selectedItem.name;
      console.log(selectedItem);
      const selectedItemID = Object.keys(items).find(key => items[key].name === selectedItemName);

      if (!state$.itemData.hasOwnProperty(selectedItemID)) {  //check whether item exists and if it doesn't then creates it
        state$.itemData[selectedItemID].set({ level: 1, init: 0 });
        initializeItemData();
        console.log(state$.itemData.get());
      } else if (state$.itemData.hasOwnProperty(selectedItemID)) { //if item exists, levels it up
        let curItem = { ...state$.itemData[selectedItemID].get() }
        curItem.level++;
        state$.itemData[selectedItemID].set(curItem);
        initializeItemData();
      }

      Alert.alert("Lootbox opened!", `You received: ${selectedItem.name} \n\nRarity: ${selectedItem.rarity}`); //lootbox opening alert
    } else if (lootboxCount > 0 && tapCount >= !tapThreshold) { //logic for tapping minigame
      setTapCount((prevCount) => prevCount + 1);
      console.log('count:', tapCount)
    } else {
      Alert.alert("No lootboxes", "You don't have any lootboxes to open."); //if try to open lootbox with zero then alerts this
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.welcomeMessage}>Welcome to the Lootbox Emporium 🎰</Text>
      <View style={styles.sectionContainer}>
        <Text style={styles.buttonDescription}>Price: {lootboxDiamondPrice} Diamonds</Text>
        <Text style={styles.currencyText}>Diamonds: {diamonds}💎</Text>
        <TouchableOpacity
          style={styles.buyLootboxButton}
          onPress={handlePurchaseWithDiamonds}>
          <Text style={styles.lootboxButtonText}>Buy with Diamonds</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.buttonDescription}>Price: {lootboxGoldPrice} Gold</Text>
        <Text style={styles.currencyText}>Gold: {gold}💰</Text>
        <TouchableOpacity
          style={styles.buyLootboxButton}
          onPress={handlePurchaseWithGold}>
          <Text style={styles.lootboxButtonText}>Buy with Gold</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.currencyText}>Lootboxes: {lootboxCount}🧰</Text>
        <TouchableOpacity
          style={styles.buyLootboxButton}
          onPress={openLootbox}>
          <Image
            source={chest}
            style={styles.lootboxImage}
          />
          <Text style={styles.lootboxButtonText}>Keep tapping to open a Lootbox!</Text>
          <Text style={styles.lootboxButtonText}>Taps remaining: {tapThreshold + 1 - tapCount}</Text>
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
    padding: 15,
  },
  welcomeMessage: {
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#453C67',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#46C2CB',
    fontWeight: 'bold',
    fontSize: 20,
  },
  currencyText: {
    fontSize: 16,
    marginRight: 10,
    fontWeight: 'bold',
  },
  sectionContainer: {
    borderColor: '#453C67',
    borderRadius: 10,
    borderWidth: 2,
    padding: 10,
    marginBottom: 15,
    width: '85%',
    backgroundColor: '#46C2CB',
  },
  buyLootboxButton: {
    backgroundColor: '#6D67E4',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  lootboxButtonText: {
    fontSize: 16,
    marginRight: 10,
    fontWeight: 'bold',
  },
  buttonDescription: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  lootboxImage: {
    width: 50,
    height: 50,
  },

});

export default LootboxScreen;
