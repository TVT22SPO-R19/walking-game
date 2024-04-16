import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { state$ } from "./states";
import itemDatabase from './itemDatabase';


export function initItems() {

    const [ownedItems, setOwnedItems] = useState([]);


    const allItemsDict = itemDatabase();

    const [upgradeItemsDict, setUpgradeItemsDict] = useState({

    })

    useEffect(() => {
        initializeItemData();
    }, []);

    //The following code is to initialize and load saved values from states. This code should only run at the start though it shouldnt cause problems if it ran again.
    function initializeItemData() {
        gottenData = state$.itemData.get();

        for (const item in gottenData) {
            initStage = gottenData[item].init
            if (initStage < gottenData[item].level) {
                console.log("Init is smaller than level")
                if (initStage == 0) {
                    addItemToInventory(item);
                    initStage = 1;
                }
                //I use curLevel to keep track how many upgrades it should given.
                curLevel = gottenData[item].level;

                console.log(state$.itemData[item].get());
                const currentItem = state$.itemData[item].get();

                console.log("current item:")
                console.log(currentItem);
                const itemEffects = allItemsDict[item].effect;

                curLevel -= initStage;

                for (const effectKey in itemEffects) {

                    if (itemEffects.hasOwnProperty(effectKey)) {

                        const effectValues = itemEffects[effectKey];

                        if (effectKey === 'baseMod') {
                            console.log("Item had base modifier")
                            for (const modKey in effectValues) {

                                console.log("Item had " + modKey)
        
                                if (effectValues.hasOwnProperty(modKey)) {
                                    addedValue = effectValues[modKey] * curLevel;

                                    state$.modifiers[modKey].set(state$.modifiers[modKey].get() + addedValue);
                                    currentItem.currentStats[effectKey][modKey] += addedValue; 
                                    console.log("Item should have added " + addedValue);
                                    console.log(currentItem);
                                }
                            }
                        } else if (effectKey === 'skillMod') {
                            console.log("Item had skill modifier")
                            for (const skillKey in effectValues) {

                                console.log("Item had " + skillKey)    
    
                                if (effectValues.hasOwnProperty(skillKey)) {
                                    addedValue = effectValues[skillKey] * curLevel;
                                    state$.skills[skillKey].power.set(state$.skills[skillKey].power.get() + addedValue );
                                    currentItem.currentStats[effectKey][skillKey] += addedValue; 
                                    console.log("Item should have added " + addedValue)

                                }
                            }
                        }
                        }
                }
                console.log("Current item:")
                console.log(currentItem)
                initStage = gottenData[item].level;
                state$.itemData[item].init.set(initStage);
                //state$.itemData[item].currentItem.set(currentItem)
                const newState = {
                    ...state$.itemData[item].get(), // Spread the existing state
                    currentStats: {
                      ...state$.itemData[item].currentStats.get(), // Spread the existing currentStats
                      ...currentItem.currentStats // Spread the properties from currentItem's currentStats
                    }
                  };
                  
                state$.itemData[item].set(newState);
                setUpgradeItemsDict(newState)
                console.log("State logs below.")
                console.log(state$.itemData[item].get());
                console.log(state$.itemData[item].currentStats.baseMod.get());
            }

        }


    }
    const addItemToInventory = (itemId) => {
        if (ownedItems.includes(itemId)) {

            console.log("Already owned.")

        } else {

            setOwnedItems(prevItems => [...prevItems, itemId]);

            if (!state$.itemData.hasOwnProperty(itemId)) {
                state$.itemData[itemId].set({ level: 1, init: 1, currentStats: { baseMod: {}, skillMod:{} } })
            }

            const itemEffects = allItemsDict[itemId].effect;

            const currentItem = state$.itemData[itemId].get();
            console.log("CurrentItem in adding items: ")
            console.log(currentItem);
            for (const effectKey in itemEffects) {
                if (itemEffects.hasOwnProperty(effectKey)) {
                    const effectValues = itemEffects[effectKey];

                    if (!currentItem.currentStats) {
                        currentItem.currentStats = {}
                    }
                    if (!currentItem.currentStats[effectKey]) { //Ensures that there isnt a null value
                        currentItem.currentStats[effectKey] = {}
                    }


                    // Check if it's baseMod or skillMod
                    if (effectKey === 'baseMod') {
                        for (const modKey in effectValues) {
                            console.log("Item had " + modKey)
                            if (!currentItem[effectKey]) { //Ensures that there isnt a null value
                                currentItem.currentStats[effectKey][modKey] = 0;
                            }
    

                            if (effectValues.hasOwnProperty(modKey)) {
                                state$.modifiers[modKey].set(state$.modifiers[modKey].get() + effectValues[modKey]);
                                currentItem.currentStats[effectKey][modKey] += effectValues[modKey]; 

                            }
                        }
                    } else if (effectKey === 'skillMod') {
                        for (const skillKey in effectValues) {
                            console.log("Item had " + skillKey)
                            if (!currentItem[effectKey]) { //Ensures that there isnt a null value
                                currentItem.currentStats[effectKey][skillKey] = 0;
                            }

                            if (effectValues.hasOwnProperty(skillKey)) {
                                state$.skills[skillKey].power.set(state$.skills[skillKey].power.get() + effectValues[skillKey]);
                                currentItem.currentStats[effectKey][skillKey] += effectValues[skillKey]; 

                            }
                        }
                    }
                }
            }

            const newState = {
                ...state$.itemData[itemId].get(), // Spread the existing state
                currentStats: {
                  ...state$.itemData[itemId].currentStats.get(), // Spread the existing currentStats
                  ...currentItem.currentStats // Spread the properties from currentItem's currentStats
                }
              };
            setUpgradeItemsDict(newState)

            state$.itemData[itemId].set(newState);
        }
    };

    return { allItemsDict, initializeItemData }
}

export default function ItemsComponent() {

    //Gets the dictionaries and array from init.
    const { allItemsDict } = initItems();
    const [itemValues, setItemValues] = useState(state$.itemData.get());
    const [ownedItems, setOwnedItems] = useState([]);

    let runInit = true;
    useEffect(() => {
        if (runInit) {
            for (const item in state$.itemData.get()) {
                if (!ownedItems.includes(item)) {
                    setOwnedItems(prevItems => [...prevItems, item]);
                }
            }
            runInit = false;
        }
        console.log("Item values below")
        console.log(itemValues);
    }, [itemValues])

    return (
        <View>
            {ownedItems.length > 0 && (
                <View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Owned Items:</Text>
                    {ownedItems.map(itemKey => {
                        const item = itemValues[itemKey];
                        const itemId = allItemsDict[itemKey]
                        return (
                            <View key={itemId.name}>
                                <Text>Name: {itemId.name}</Text>
                                <Text>Effect:</Text>
                                {Object.entries(item.currentStats).map(([category, value]) => (
                                    Object.entries(item.currentStats[category]).map(([keyEffect, keyValue]) => (
                                        <Text key={keyEffect}>{keyEffect}: {keyValue.toFixed(2)}</Text>
                                    ))
                                ))}
                                <Text> Level: {item.level}</Text>
                            </View>
                        );
                    })}
                </View>
            )}
        </View>
    )
}