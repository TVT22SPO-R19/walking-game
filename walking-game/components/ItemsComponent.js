import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { state$ } from "./states";

export function initItems() {

    const [ownedItems, setOwnedItems] = useState([]);

    allItemsDict = {
        baseBoots: { name: "Really bad boots.", effect: { baseMod: { walkingMultiplier: 5 }, skillMod: { stamina: 1 } }, cost: 800 },
        sunGlasses: { name: "Bad sunglasses.", effect: { baseMod: { walkingPower: 5 } }, cost: 223 },
        goodSunGlasses: { name: "Good sunglasses.", effect: { baseMod: { walkingPower: 1, walkingMultiplier: 1 }, skillMod: { stamina: 1, strenght: 1 } }, cost: 1232 },
        storeItem1: { name: "Store debug item 1.", effect: { walkingPower: 5 }, cost: 223, restricted: true },
        storeItem2: { name: "Store debug item 1.", effect: { walkingPower: 5 }, cost: 223, restricted: true },
        storeItem3: { name: "Store debug item 1.", effect: { walkingPower: 5 }, cost: 223, restricted: true },

    }

    const [upgradeItemsDict, setUpgradeItemsDict] = useState({
        baseBoots: { currentStats: {}, effect: { walkingMultiplier: 0.5 }, cost: 10, costMult: 1.2, level: 1 },
        sunGlasses: { currentStats: {}, effect: { walkingPower: 0.5 }, cost: 10, costMult: 1.2, level: 1 },
        goodSunGlasses: { currentStats: {}, effect: { walkingPower: 0.1, walkingMultiplier: 0.1 }, cost: 100, costMult: 1.1, level: 1 }
    })

    useEffect(() => {
        initializeItemData();
    }, []);

    //The following code is to initialize and load saved values from states. This code should only run at the start though it shouldnt cause problems if it ran again.
    function initializeItemData() {
        gottenData = state$.itemData.get();
        console.log(gottenData);
        const updatedUpgradeItemsDict = { ...upgradeItemsDict };

        for (const item in gottenData) {
            initStage = gottenData[item].init
            if (initStage < gottenData[item].level) {
                console.log("Init is smaller than level")
                if (initStage == 0) {
                    addItemToInventory(item);
                    initStage = 1;
                    console.log(item + " Stage " + initStage)
                }
                curLevel = gottenData[item].level;

                updatedUpgradeItemsDict[item].level = curLevel;
                const currentItem = updatedUpgradeItemsDict[item];

                const itemEffects = upgradeItemsDict[item].effect;

                curLevel -= initStage;
                newCost = updatedUpgradeItemsDict[item].costMult ** curLevel;
                updatedUpgradeItemsDict[item].cost *= newCost;

                for (const effectKey in itemEffects) {

                    if (itemEffects.hasOwnProperty(effectKey)) {

                        const effectValue = itemEffects[effectKey];

                        if (!currentItem.currentStats[effectKey]) { //Ensures that there isnt a null value
                            currentItem.currentStats[effectKey] = 0;
                        }
                        newValue = effectValue * curLevel;

                        currentItem.currentStats[effectKey] += newValue;

                        const prevStateMod = state$.modifiers[effectKey].get();
                        const newStateMod = prevStateMod + effectValue;
                        state$.modifiers[effectKey].set(newStateMod);
                    }
                }
                initStage = gottenData[item].level;
                state$.itemData[item].init.set(initStage);
                console.log(state$.itemData[item].init.get());
            }

        }

        setUpgradeItemsDict(updatedUpgradeItemsDict);  // The dictionary needs to use state otherwise it wont update

    }
    const addItemToInventory = (itemId) => {
        if (ownedItems.includes(itemId)) {

            console.log("Already owned.")

        } else {

            setOwnedItems(prevItems => [...prevItems, itemId]);

            if (!state$.itemData.hasOwnProperty(itemId)) {
                state$.itemData[itemId].set({ level: 1 })
            }

            const itemEffects = allItemsDict[itemId].effect;

            const updatedUpgradeItemsDict = { ...upgradeItemsDict };
            const currentItem = updatedUpgradeItemsDict[itemId];

            for (const effectKey in itemEffects) {
                if (itemEffects.hasOwnProperty(effectKey)) {
                    const effectValues = itemEffects[effectKey];

                    // Check if it's baseMod or skillMod
                    if (effectKey === 'baseMod') {
                        for (const modKey in effectValues) {
                            if (effectValues.hasOwnProperty(modKey)) {
                                state$.modifiers[modKey].set(state$.modifiers[modKey].get() + effectValues[modKey]);
                            }
                        }
                    } else if (effectKey === 'skillMod') {
                        for (const skillKey in effectValues) {
                            if (effectValues.hasOwnProperty(skillKey)) {
                                state$.skills[skillKey].power.set(state$.skills[skillKey].power.get() + effectValues[skillKey]);
                            }
                        }
                    }
                }
            }
            updatedUpgradeItemsDict[itemId] = currentItem;
            currentItem.currentStats = { ...currentItem.currentStats, ...itemEffects };

            setUpgradeItemsDict(updatedUpgradeItemsDict); // The dictionary needs to use state otherwise it wont update
            console.log(state$.get())
        }
    };

    return { allItemsDict, upgradeItemsDict }
}

export default function ItemsComponent() {

    const [resource, setResource] = useState(10000000); // Temporary for testing

    //Gets the dictionaries and array from init.
    const { allItemsDict, upgradeItemsDict: initialUpgradeItemsDict } = initItems();
    const [upgradeItemsDict, setUpgradeItemsDict] = useState(initialUpgradeItemsDict);
    const [ownedItems, setOwnedItems] = useState([]);

    let runInit = true;
    useEffect(() => {
        if (runInit) {
            for (const item in state$.itemData) {
                if (!ownedItems.includes(item)) {
                    setOwnedItems(prevItems => [...prevItems, item]);

                }
            }
            console.log("Ran runInit");
            runInit = false;
        }
        console.log("Ran useEffect.")
    }, [])

    // This function should only exist as a way to manage buying items. addItemToInventory should simply add an item with ID so we can add items without buying them with this.
    const buyItem = (itemId) => {
        const itemCost = allItemsDict[itemId].cost

        if (resource > itemCost) {
            console.log("Buying " + itemId);
            setResource(resource - itemCost);
            addItemToInventory(itemId);
            console.log(resource)

        } else {
            console.log("Too poor.")
        }
    }

    //Like previous function this only exists to manage buying upgrades.
    const buyUpgrade = (itemId) => {
        const upgradeCost = upgradeItemsDict[itemId].cost
        if (resource > upgradeCost) {

            console.log("Upgrading: " + itemId);
            setResource(resource - upgradeCost);
            console.log(resource);
            upgradeItem(itemId);
        } else {
            console.log("Too poor.");
        }
    }


    const upgradeItem = (itemId) => {

        const updatedUpgradeItemsDict = { ...upgradeItemsDict }; //Variable to save all values
        const currentItem = updatedUpgradeItemsDict[itemId];


        updatedUpgradeItemsDict[itemId].cost *= updatedUpgradeItemsDict[itemId].costMult;
        console.log("New cost: " + updatedUpgradeItemsDict[itemId].cost);

        updatedUpgradeItemsDict[itemId].level++;
        state$.itemData[itemId].level.set(updatedUpgradeItemsDict[itemId].level)


        const itemEffects = upgradeItemsDict[itemId].effect;
        for (const effectKey in itemEffects) {
            if (itemEffects.hasOwnProperty(effectKey)) {

                const effectValue = itemEffects[effectKey];

                if (!currentItem.currentStats[effectKey]) { //Ensures that there isnt a null value
                    currentItem.currentStats[effectKey] = 0;
                }

                currentItem.currentStats[effectKey] += effectValue;

                const prevStateMod = state$.modifiers[effectKey].get();
                const newStateMod = prevStateMod + effectValue;
                state$.modifiers[effectKey].set(newStateMod);
            }
        }
        state$.itemData[itemId].init.set(updatedUpgradeItemsDict[itemId].level);


        updatedUpgradeItemsDict[itemId] = currentItem;
        console.log(state$.itemData.get())

        setUpgradeItemsDict(updatedUpgradeItemsDict);  // The dictionary needs to use state otherwise it wont update
    }


    const addItemToInventory = (itemId) => {
        if (ownedItems.includes(itemId)) {

            console.log("Already owned.")

        } else {

            setOwnedItems(prevItems => [...prevItems, itemId]);

            if (!state$.itemData.hasOwnProperty(itemId)) {
                state$.itemData[itemId].set({ level: 1, init: 1 })

            }

            const itemEffects = allItemsDict[itemId].effect;

            const updatedUpgradeItemsDict = { ...upgradeItemsDict };
            const currentItem = updatedUpgradeItemsDict[itemId];

            for (const effectKey in itemEffects) {
                if (itemEffects.hasOwnProperty(effectKey)) {
                    const effectValues = itemEffects[effectKey];

                    // Check if it's baseMod or skillMod
                    if (effectKey === 'baseMod') {
                        for (const modKey in effectValues) {
                            if (effectValues.hasOwnProperty(modKey)) {
                                state$.modifiers[modKey].set(state$.modifiers[modKey].get() + effectValues[modKey]);
                            }
                        }
                    } else if (effectKey === 'skillMod') {
                        for (const skillKey in effectValues) {
                            if (effectValues.hasOwnProperty(skillKey)) {
                                state$.skills[skillKey].power.set(state$.skills[skillKey].power.get() + effectValues[skillKey]);
                            }
                        }
                    }
                }
            }
            updatedUpgradeItemsDict[itemId] = currentItem;
            currentItem.currentStats = { ...currentItem.currentStats, ...itemEffects };

            setUpgradeItemsDict(updatedUpgradeItemsDict); // The dictionary needs to use state otherwise it wont update

        }
    };

    const itemsToDisplay = Object.keys(allItemsDict)
        .filter(itemKey => !ownedItems.includes(itemKey)) // Filter out owned items
        .filter(itemKey => !allItemsDict[itemKey].restricted); // Filter out restricted items

    return (
        <View>
            {itemsToDisplay.length > 0 && (
                <View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Buy Items:</Text>
                    {itemsToDisplay.map(itemKey => {

                        const item = allItemsDict[itemKey];
                        return (
                            <View key={item.id}>
                                <Text>{item.name}</Text>
                                <Button
                                    onPress={() => {
                                        buyItem(itemKey);
                                    }}
                                    title={`Buy ${item.name}.`}
                                />
                            </View>
                        );
                    })}
                </View>

            )}
            {ownedItems.length > 0 && (
                <View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Owned Items:</Text>
                    {ownedItems.map(itemKey => {
                        const item = allItemsDict[itemKey];
                        const itemUpgrade = upgradeItemsDict[itemKey];
                        return (
                            <View key={item.id}>
                                <Text>Name: {item.name}</Text>
                                <Text>Effect:</Text>
                                {Object.entries(itemUpgrade.currentStats).map(([category, value]) => (
                                    Object.entries(itemUpgrade.currentStats[category]).map(([keyEffect, keyValue]) => (
                                        <Text key={keyEffect}>{keyEffect}: {keyValue.toFixed(2)}</Text>
                                    ))
                                ))}
                                <Text> Level: {itemUpgrade.level}</Text>
                                <Text> Cost: {itemUpgrade.cost.toFixed(2)}</Text>
                                <Button
                                    onPress={() => {
                                        buyUpgrade(itemKey);
                                    }}
                                    title={`Upgrade ${item.name}.`}
                                />
                            </View>
                        );
                    })}
                </View>
            )}
        </View>
    )
}