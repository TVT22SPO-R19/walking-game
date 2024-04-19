import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Button } from 'react-native';
import { state$ } from "./states";
import itemDatabase from './itemDatabase';
import { itemDefinations } from './itemDatabase';


export function initItems() {

    const [ownedItems, setOwnedItems] = useState([]);

    const allItemsDict = itemDatabase();

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

                const currentItem = state$.itemData[item].get();

                const itemEffects = allItemsDict[item].effect;

                curLevel -= initStage;

                for (const effectKey in itemEffects) {

                    if (itemEffects.hasOwnProperty(effectKey)) {

                        const effectValues = itemEffects[effectKey];

                        if (effectKey === 'baseMod') {
                            for (const modKey in effectValues) {

                                if (effectValues.hasOwnProperty(modKey)) {
                                    addedValue = effectValues[modKey] * curLevel;

                                    state$.modifiers[modKey].set(state$.modifiers[modKey].get() + addedValue);
                                    currentItem.currentStats[effectKey][modKey] += addedValue;
                                }
                            }
                        } else if (effectKey === 'skillMod') {
                            for (const skillKey in effectValues) {

                                if (effectValues.hasOwnProperty(skillKey)) {
                                    addedValue = effectValues[skillKey] * curLevel;
                                    state$.skills[skillKey].power.set(state$.skills[skillKey].power.get() + addedValue);
                                    currentItem.currentStats[effectKey][skillKey] += addedValue;

                                }
                            }
                        }
                    }
                }
                console.log("Current item:")
                console.log(currentItem)
                initStage = gottenData[item].level;
                state$.itemData[item].init.set(initStage);

                const newState = {
                    ...state$.itemData[item].get(), // Spread the existing state
                    currentStats: {
                        ...state$.itemData[item].currentStats.get(), // Spread the existing currentStats
                        ...currentItem.currentStats // Spread the properties from currentItem's currentStats
                    }
                };

                state$.itemData[item].set(newState);
            }
        }

    }
    const addItemToInventory = (itemId) => {
        if (ownedItems.includes(itemId)) {

            console.log("Already owned.")

        } else {
            console.log("Adding items.")
            setOwnedItems(prevItems => [...prevItems, itemId]);

            if (!state$.itemData.hasOwnProperty(itemId)) {
                state$.itemData[itemId].set({ level: 1, init: 1, currentStats: { baseMod: {}, skillMod: {} } })
            }

            const itemEffects = allItemsDict[itemId].effect;

            const currentItem = state$.itemData[itemId].get();
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

            state$.itemData[itemId].set(newState);
        }
    };

    return { allItemsDict, initializeItemData }
}

export default function ItemsComponent() {


    const { allItemsDict } = initItems(); //Decided to move items to own component so its easier to edit in the future.
    const effectDescriptions = itemDefinations(); //Has descriptions for all of the effects making it easier to read for user and for us to edit.

    const [itemValues, setItemValues] = useState(state$.itemData.get());
    const [ownedItems, setOwnedItems] = useState([]);

    const [runInit, setRunInit] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setRunInit(true);

        }, 1000); // Reload every second. For some reason trying to fuse these two useEffects breaks the code.

        return () => clearInterval(interval); // Cleanup the interval on component unmount
    }, []);

    useEffect(() => { //Simply checks the state for new items and add them to owned to show them in items view. Also loads every item to owned items when starting up the game.
        if (runInit) { 
            for (const item in state$.itemData.get()) {
                if (!ownedItems.includes(item)) {
                    setOwnedItems(prevItems => [...prevItems, item]);
                }
            }
        }
        setRunInit(false)
    }, [runInit])

    return (

        <ScrollView contentContainerStyle={styles.container}>
            {ownedItems.length > 0 && (
                <View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Owned Items:</Text>
                    {ownedItems.map(itemKey => {
                        const item = itemValues[itemKey];
                        const itemId = allItemsDict[itemKey]
                        return (
                            <View key={itemId.name} style={styles.itemContainer}>
                                <Text>Name: {itemId.name}</Text>
                                <Text>Effect:</Text>
                                {Object.entries(item.currentStats).map(([category, value]) => (
                                    Object.entries(item.currentStats[category]).map(([keyEffect, keyValue]) => (
                                        <Text key={keyEffect}>{effectDescriptions[keyEffect]}: {keyValue.toFixed(2)}</Text>
                                    ))
                                ))}
                                <Text> Level: {item.level}</Text>
                            </View>
                        );
                    })}
                </View>
            )}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0', // light gray background
        padding: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    itemContainer: {
        backgroundColor: '#e0e0e0', // gray background for item container
        borderColor: 'orange', // orange border color
        borderWidth: 2,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
});