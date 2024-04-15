import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { initItems } from './ItemsComponent';
import { state$ } from './states';
import itemDatabase from './itemDatabase';


export default RandomItemView = () => {

    const [currentItem, setCurrentItem] = useState(null);
    const [intervalId, setIntervalId] = useState(null);
    const allItemsDict = itemDatabase(); //Decided to move items to own component so its easier to edit in the future.

    //The function that needs to be run to init items. 
    const { initializeItemData } = initItems();

    useEffect(() => {
        // Function to select a random item from allItemsDict. Items require the key restricted with the value shop. 
        const selectRandomItem = () => {
            const filteredItems = Object.entries(allItemsDict)
                .filter(([id, item]) => item.restricted === "shop")
                .reduce((obj, [id, item]) => {
                    obj[id] = { ...item, id };
                    return obj;
                }, {});

            const keys = Object.keys(filteredItems);
            const randomId = keys[Math.floor(Math.random() * keys.length)];
            setCurrentItem(filteredItems[randomId]);
        };

        // Start timer to change store item. 1000 = 1 second.
        const id = setInterval(selectRandomItem, 5000);

        setIntervalId(id);

        selectRandomItem();

        return () => clearInterval(intervalId);
    }, []);
    const handleBuy = () => {

        if (!state$.itemData.hasOwnProperty(currentItem.id)) {
            state$.itemData[currentItem.id].set({ level: 1, init: 0 });
            initializeItemData();
            console.log(state$.itemData.get());
        } else {
            console.log("Already owned.")
        }
    };

    return (
        <View>
            {currentItem && (
                <>
                    <Text>Name: {currentItem.name}</Text>
                    <Text>Effects:</Text>
                    <View>
                        {Object.keys(currentItem.effect).map((key) => (
                            <View key={key}>
                                <View>
                                    {Object.keys(currentItem.effect[key]).map((subKey) => (
                                        <Text key={subKey}>{subKey}: {currentItem.effect[key][subKey]}</Text>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </View>
                    <Button title="Buy" onPress={handleBuy} />
                </>
            )}
        </View>
    );
};

