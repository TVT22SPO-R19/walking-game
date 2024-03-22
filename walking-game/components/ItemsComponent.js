import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { state$ } from "./states";

export default function ItemsComponent() {

    allItemsDict = {
        baseBoots: {id: 1, name: "Really bad boots.", effect:{walkingMultiplier: 5}, cost: 1},
        sunGlasses: {id: 2, name: "Bad sunglasses.", effect:{walkingPower: 5}, cost: 1},
        goodSunGlasses: {id: 3, name: "Good sunglasses.", effect:{walkingPower: 1, walkingMultiplier: 1}, cost: 1}

    }
    const [ownedItems, setOwnedItems] = useState([]);
    useEffect(() => {
        ownedItems.forEach(itemId => {
            console.log(allItemsDict[itemId].name);
        }); 

    }, [ownedItems]);

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

            console.log(state$.modifiers.walkingPower.get())
            console.log(state$.modifiers.walkingMultiplier.get())


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
                                        addItemToInventory(itemKey);
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
                            return (
                                <View key={item.id}>
                                    <Text>Name: {item.name}</Text>
                                    <Text>Effect:</Text>
                                    {Object.entries(item.effect).map(([effectKey, value]) => (
                                        <Text key={effectKey}>{effectKey}: {value}</Text>
                                    ))}
                                </View>
                            );
                        })}
                </View>
            )}

        </View>
    )
}