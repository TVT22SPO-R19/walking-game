import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { state$ } from "./states";

export default function ItemsComponent() {

    allItemsDict = {
        baseBoots: { name: "Really bad boots.", effect:{walkingMultiplier: 5}, cost: 800},
        sunGlasses: { name: "Bad sunglasses.", effect:{walkingPower: 5}, cost: 223},
        goodSunGlasses: { name: "Good sunglasses.", effect:{walkingPower: 1, walkingMultiplier: 1}, cost: 1232}

    }

    const [upgradeItemsDict, setUpgradeItemsDict] = useState({
        baseBoots: { effect:{walkingMultiplier: 0.5}, cost: 10, costMult: 1.2, level: 1},
        sunGlasses: { effect:{walkingPower: 0.5}, cost: 10, costMult: 1.2, level: 1},
        goodSunGlasses: { effect:{walkingPower: 0.1, walkingMultiplier: 0.1}, cost: 100, costMult: 1.1, level: 1}
    })

    const [ownedItems, setOwnedItems] = useState([]);

    const [resource, setResource] = useState(10000000); // Temporary for testing

    useEffect(() => {
        ownedItems.forEach(itemId => {
            console.log(allItemsDict[itemId].name);
        }); 

    }, [ownedItems]);

    const buyItem = (itemId) => {
        const itemCost = allItemsDict[itemId].cost

        if (resource > itemCost) {
            console.log("Buying" + itemId);
            setResource(resource - itemCost);
            addItemToInventory(itemId);
            console.log(resource)

        } else {
            console.log("Too poor.")
        }
    }

    const upgradeItem = (itemId) => {
        
        const upgradeCost = upgradeItemsDict[itemId].cost
    
        if (resource > upgradeCost) {

            console.log("Upgrading: " + itemId);
            setResource(resource - upgradeCost);
            console.log(resource);

            const updatedUpgradeItemsDict = { ...upgradeItemsDict }; //Variable to save all values


            updatedUpgradeItemsDict[itemId].cost *= updatedUpgradeItemsDict[itemId].costMult;
            console.log("New cost: " + updatedUpgradeItemsDict[itemId].cost);

            updatedUpgradeItemsDict[itemId].level++;

            setUpgradeItemsDict(updatedUpgradeItemsDict); // The dictionary needs to use state otherwise it wont update

            const itemEffects = upgradeItemsDict[itemId].effect;
            for (const effectKey in itemEffects) {
                if (itemEffects.hasOwnProperty(effectKey)) {
                    let prevStateMod = state$.modifiers[effectKey].get();
                    let newStateMod = prevStateMod + itemEffects[effectKey];
                    state$.modifiers[effectKey].set(newStateMod);
                }
            }

        } else {
            console.log("Too poor.")
        }
    }

    const addItemToInventory = (itemId) => {
        if (ownedItems.includes(itemId)){
            console.log("Already owned.")
            console.log(state$.modifiers.walkingPower.get())
        } else {
            setOwnedItems(prevItems => [...prevItems, itemId]);
            
            const itemEffects = allItemsDict[itemId].effect;
            console.log(itemEffects)

            for (const effectKey in itemEffects) {
                if (itemEffects.hasOwnProperty(effectKey)) {
                    let prevStateMod = state$.modifiers[effectKey].get();
                    let newStateMod = prevStateMod + itemEffects[effectKey];
                    state$.modifiers[effectKey].set(newStateMod);
                }
            }
        }
    };
    const itemsToDisplay = Object.keys(allItemsDict).filter(itemKey => !ownedItems.includes(itemKey));

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
                                    {Object.entries(item.effect).map(([effectKey, value]) => (
                                        <Text key={effectKey}>{effectKey}: {value}</Text>
                                    ))}
                                    <Text> Level: {itemUpgrade.level}</Text>
                                    <Button 
                                        onPress={() => {
                                            upgradeItem(itemKey);
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