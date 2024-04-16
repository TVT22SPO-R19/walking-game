
export default ItemDatabase = () => {
    allItemsDict = {
        baseBoots: { name: "Really bad boots.", effect: { baseMod: { walkingMultiplier: 5 }, skillMod: { stamina: 1 } }, cost: 800 },
        sunGlasses: { name: "Bad sunglasses.", effect: { baseMod: { walkingPower: 5 } }, cost: 223 },
        goodSunGlasses: { name: "Good sunglasses.", effect: { baseMod: { walkingPower: 1, walkingMultiplier: 1 }, skillMod: { stamina: 1, strenght: 1 } }, cost: 1232 },
        storeItem1: { name: "Store debug item 1.", effect: { baseMod: { walkingPower: 5 } }, cost: 223, restricted: "shop" },
        storeItem2: { name: "Store debug item 2.", effect: { baseMod: { walkingPower: 20 } }, cost: 223, restricted: "shop" },
        storeItem3: { name: "Store debug item 3.", effect: { baseMod: { walkingPower: 400 } }, cost: 223, restricted: "shop" },
    }

    return allItemsDict
}