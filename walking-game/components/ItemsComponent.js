import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function ItemsComponent() {

    allItemsDict = {
        baseBoots: {id: 1, name: "Really bad boots.", effect:{}, cost: 1},
        sunGlasses: {id: 2, name: "Bad sunglasses.", effect:{}, cost: 1},
        goodSunGlasses: {id: 3, name: "Good sunglasses.", effect:{}, cost: 1}

    }
    const [ownedItems, setOwnedItems] = useState([]);

    useEffect(() => {
        ownedItems.forEach(itemId => {
            const itemName = Object.keys(allItemsDict).find(key => allItemsDict[key].id === itemId);
            if (itemName) {
                console.log(allItemsDict[itemName].name);
            }
        }); 
    }, [ownedItems]);

    const addItemToInventory = (itemId) => {
        if (ownedItems.includes(itemId)){
            console.log("Already owned.")
        } else {
            setOwnedItems(prevItems => [...prevItems, itemId]);
        }
    };

    return (
        <View>
            <Text> {allItemsDict.baseBoots.name}</Text>
            <Button 
                onPress={() => {
                    addItemToInventory(1)
                }}
                title='Add boots to inv.'
            />
        </View>
    )
}