import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { state$ } from "./states";
import itemDatabase from './itemDatabase';
import { itemDefinations } from './itemDatabase';


export function initItems() {

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
        console.log("Adding items.")

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
    const [selectedRarity, setSelectedRarity] = useState('All'); // State to track the selected rarity
    const [selectedEffect, setSelectedEffect] = useState('All'); // State to track the selected effect category

    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setRunInit(true);
            setItemValues(state$.itemData.get());
            setDataLoaded(true);
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

    const filterItemsByRarityAndEffect = () => {
        let filteredItems = ownedItems;
            if (selectedRarity !== 'All') {
                filteredItems = filteredItems.filter(itemKey => {
                    const itemId = allItemsDict[itemKey];
                    return itemId.rarity === selectedRarity;
                });
            }
    
            // Filter by effect category
            if (selectedEffect !== 'All') {
                filteredItems = filteredItems.filter(itemKey => {
                    const item = itemValues[itemKey];
                    // Check if the item has skillMod and if the selected effect is present in skillMod
                    const hasSkillMod = item.currentStats && item.currentStats.skillMod && item.currentStats.skillMod[selectedEffect] !== undefined;
                    // Check if the item has baseMod and if the selected effect is present in baseMod
                    const hasBaseMod = item.currentStats && item.currentStats.baseMod && item.currentStats.baseMod[selectedEffect] !== undefined;
                    // Include the item in the filtered list if the selected effect is found in either skillMod or baseMod
                    return hasSkillMod || hasBaseMod;
                });
            }
    
            return filteredItems;
    
    };

    return (

        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.filterContainer}>
                <View style={styles.pickerContainer}>
                    <Text style={styles.filterText}>Filter by Rarity:</Text>
                    <Picker
                        selectedValue={selectedRarity}
                        style={styles.picker}
                        onValueChange={(itemValue, itemIndex) => setSelectedRarity(itemValue)}
                    >
                        <Picker.Item label="All" value="All" />
                        <Picker.Item label="Common" value="Common" />
                        <Picker.Item label="Rare" value="Rare" />
                        <Picker.Item label="Legendary" value="Legendary" />
                    </Picker>
                </View>
                <View style={styles.pickerContainer}>
                    <Text style={styles.filterText}>Filter by Effect:</Text>
                    <Picker
                        selectedValue={selectedEffect}
                        style={styles.picker}
                        onValueChange={(itemValue, itemIndex) => setSelectedEffect(itemValue)}
                    >
                        <Picker.Item label="All" value="All" />
                        {Object.keys(effectDescriptions).map(effect => (
                            <Picker.Item key={effect} label={effectDescriptions[effect]} value={effect} />
                        ))}
                    </Picker>
                </View>
            </View>
            {dataLoaded && (
                <View>
                    {filterItemsByRarityAndEffect().length > 0 && (
                        <View style={styles.allItems}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Owned Items:</Text>
                            {filterItemsByRarityAndEffect().map(itemKey => {
                                const item = itemValues[itemKey];
                                const itemId = allItemsDict[itemKey];

                                if (item) {
                                    return (
                                        <View key={itemId.name} style={styles.itemContainer}>
                                            <Text>Rarity: {itemId.rarity}</Text>
                                            <Text>Name: {itemId.name}</Text>
                                            <Text>Effect:</Text>
                                            {Object.entries(item.currentStats).map(([category, value]) => (
                                                Object.entries(item.currentStats[category]).map(([keyEffect, keyValue]) => (
                                                    <Text key={keyEffect}>{effectDescriptions[keyEffect]}: {keyValue.toFixed(2)}</Text>
                                                ))
                                            ))}
                                            <Text>Level: {item?.level}</Text>
                                        </View>
                                    );
                                    } else {
                                    console.log("Item", itemKey, "is undefined");
                                }
                                
                            })}
                        </View>
                    )
                    }
                </View>
            )}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#313338',
    },
    allItems: {
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: '#656565',
        padding: 10,
        borderColor: '#C95B0C', // orange border color
        borderWidth: 2,
        borderRadius: 5,

    },
    filterContainer: {

        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#e0e0e0', // gray background for item container
        borderColor: '#C95B0C', // orange border color
        borderWidth: 2,
        borderRadius: 5,
        padding: 10,
        margin: 10,
    },
    pickerContainer: {
        flex: 1,
        marginRight: 10,
        marginLeft: 10,
    },
    filterText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#C95B0C',
        marginBottom: 5,
    },
    picker: {
        height: 50,
        backgroundColor: '#a8a8a8',
        color: '#C95B0C',
        borderWidth: 2,
        borderColor: '#C95B0C',
    },
    itemContainer: {
        backgroundColor: '#e0e0e0', // gray background for item container
        borderColor: '#C95B0C', // orange border color
        borderWidth: 2,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
});