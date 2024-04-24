import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { initItems } from './ItemsComponent';
import { state$ } from './states';
import itemDatabase from './itemDatabase';
import { itemDefinations } from './itemDatabase';

export default RandomItemView = () => {

    const [currentItem, setCurrentItem] = useState(null);
    const [intervalId, setIntervalId] = useState(null);
    const allItemsDict = itemDatabase(); //Decided to move items to own component so its easier to edit in the future.
    const effectDescriptions = itemDefinations(); //Has descriptions for all of the effects making it easier to read for user and for us to edit.

    //The function that needs to be run to init items. 
    const { initializeItemData } = initItems();

    useEffect(() => {
        // Function to select a random item from allItemsDict. Items require the key restricted with the value shop. 
        const selectRandomItem = () => {
            const filteredItems = Object.entries(allItemsDict)
                .filter(([id, item]) => !item.restricted.includes("bundle"))
                .reduce((obj, [id, item]) => {
                    obj[id] = { ...item, id };
                    return obj;
                }, {});

            const keys = Object.keys(filteredItems);
            const randomId = keys[Math.floor(Math.random() * keys.length)];
            setCurrentItem(filteredItems[randomId]);
        };

        // Start timer to change store item. 1000 = 1 second.
        const id = setInterval(selectRandomItem, 10000);

        setIntervalId(id);

        selectRandomItem();

        return () => clearInterval(intervalId);
    }, []);
    const handleBuy = () => {
        itemCost = allItemsDict[currentItem.id].cost;
        const gold = state$.currency.gold.get();

        if (gold >= itemCost) {
            state$.currency.gold.set(gold - itemCost);

            //if (true) {
            if (!state$.itemData.hasOwnProperty(currentItem.id)) {
                state$.itemData[currentItem.id].set({ level: 1, init: 0 });
                initializeItemData();
                console.log(state$.itemData.get());
            } else if (state$.itemData.hasOwnProperty(currentItem.id)) {
                let curItem = { ...state$.itemData[currentItem.id].get() }
                curItem.level++;
                state$.itemData[currentItem.id].set(curItem);
                initializeItemData();

                console.log(state$.modifiers.get())
            } else {
                console.log("Shouldnt run.")
            }

        } else {
            alert("You don't have enough gold.")
            console.log("No money")
        }
    };
    const getItemRarityColor = (rarity) => {
        switch (rarity) {
          case 'Common':
            return styles.common;
          case 'Rare':
            return styles.rare;
          case 'Legendary':
            return styles.legendary;
          default:
            return {}; // Default style if rarity is not recognized
        }
      };
      
    return (
        <View>
            {currentItem && (
                <>
                    <Text style={[ getItemRarityColor(currentItem.rarity)]}>{currentItem.rarity}</Text>

                    <Text style={{ fontSize: 16, }}>{currentItem.name}</Text>
                    <Text>Effects:</Text>
                    <View>
                        {Object.keys(currentItem.effect).map((key) => (
                            <View key={key}>
                                <View>
                                    {Object.keys(currentItem.effect[key]).map((subKey) => {
                                        let effectColorStyle;
                                        switch (subKey) {
                                            case 'agility':
                                                effectColorStyle = styles.agility;
                                                break;
                                            case 'strenght':
                                                effectColorStyle = styles.strenght;
                                                break;
                                            case 'stamina':
                                                effectColorStyle = styles.stamina;
                                                break;
                                            case 'intelligence':
                                                effectColorStyle = styles.intelligence;
                                                break;
                                            default:
                                                effectColorStyle = styles.baseMod;
                                        }
                                        return (
                                            <Text key={subKey} style={effectColorStyle}>{effectDescriptions[subKey]}: {currentItem.effect[key][subKey]}</Text>
                                        )
                                    })}
                                </View>
                            </View>
                        ))}
                    </View>
                    <Text>Price: {allItemsDict[currentItem.id].cost} Gold</Text>
                    <TouchableOpacity style={styles.Button} onPress={handleBuy}>
                        <Text style={styles.buttonText}>Buy with Gold</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    Button: {
        backgroundColor: 'gold',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        fontWeight: 'bold',
    },
    baseMod: {
        color: 'black'
    },
    stamina: {
        color: 'darkgreen'
    },
    strenght: {
        color: 'red'
    },
    agility: {
        color: 'mediumorchid'
    },
    intelligence: {
        color: 'blue'
    },
    common: {
        color: 'green',
    },
    rare: {
        color: 'blue',
    },
    legendary: {
        color: '#DAA520',
    },

});
