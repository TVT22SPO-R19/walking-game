
export default ItemDatabase = () => {
    allItemsDict = {

        // Walking multiplier

        badBoots: { name: "Crocs.", effect: { baseMod: { walkingMultiplier: 0.5 } }, cost: 800, restricted: "lootbox", rarity: "Common" },
        goodBoots: { name: "Running shoes.", effect: { baseMod: { walkingMultiplier: 1.5 } }, cost: 800, restricted: "lootbox", rarity: "Rare" },
        bestBoots: { name: "Terrabolt boots.", effect: { baseMod: { walkingMultiplier: 3 } }, cost: 800, restricted: "lootbox", rarity: "Legendary" },

        // Walking power

        badSocks: { name: "Socks with holes.", effect: { baseMod: { walkingPower: 0.5 } }, cost: 800, restricted: "lootbox", rarity: "Common" },
        goodSocks: { name: "They are socks.", effect: { baseMod: { walkingMultiplier: 1.5 } }, cost: 800, restricted: "lootbox", rarity: "Rare" },
        bestSocks: { name: "Way too expensive socks.", effect: { baseMod: { walkingMultiplier: 3 } }, cost: 800, restricted: "lootbox", rarity: "Legendary" },

        // Agility

        badGloves: { name: "One glove.", effect: { skillMod: { agility: 1.5 } }, cost: 800, restricted: "lootbox", rarity: "Common" },
        goodGloves: { name: "Fingerless gloves.", effect: { skillMod: { agility: 3 } }, cost: 800, restricted: "lootbox", rarity: "Rare" },
        bestGloves: { name: "Gloves that you got from opening hundreds of boxes.", effect: { skillMod: { agility: 5 } }, cost: 800, restricted: "lootbox", rarity: "Legendary" },

        //Stamina

        badBottle: { name: "Half empty water bottle.", effect: { skillMod: { stamina: 1.5 } }, cost: 800, restricted: "lootbox", rarity: "Common" },
        goodBottle: { name: "A sports drink.", effect: { skillMod: { stamina: 3 } }, cost: 800, restricted: "lootbox", rarity: "Rare" },
        bestBottle: { name: "Legally distinct energy drink.", effect: { skillMod: { stamina: 5 } }, cost: 800, restricted: "lootbox", rarity: "Legendary" },

        //Strenght

        badPills: { name: "Vitamin pills.", effect: { skillMod: { strenght: 0.5 } }, cost: 800, restricted:  "lootbox", rarity: "Common" },
        goodPills: { name: "Protean powder.", effect: { skillMod: { strenght: 1.5 } }, cost: 800, restricted: "lootbox", rarity: "Rare" },
        bestPills: { name: "'Legal' power enhancing pills.", effect: { skillMod: { strenght: 3 } }, cost: 800, restricted: "lootbox", rarity: "Legendary" },

        //Intelligence

        badGlasses: { name: "Broken glasses.", effect: { skillMod: { intelligence: 0.5 } }, cost: 800, restricted: "lootbox", rarity: "Common" },
        goodGlasses: { name: "Just normal glasses. Nerd.", effect: { skillMod: { intelligence: 1.5 } }, cost: 800, restricted: "lootbox", rarity: "Rare" },
        bestGlasses: { name: "Cool sunglasses.", effect: { skillMod: { intelligence: 3 } }, cost: 800, restricted: "lootbox", rarity: "Legendary" },


        //Agi + Stam

        badWatch: { name: "Broken watch.", effect: { skillMod: { stamina: 0.5, agility: 0.5 } }, cost: 800, restricted: "lootbox", rarity: "Common" },
        goodWatch: { name: "Your grandpas working watch.", effect: { skillMod: { stamina: 1.5, agility: 1.5 } }, cost: 800, restricted: "lootbox", rarity: "Rare" },
        bestWatch: { name: "Diamond encrusted watch?", effect: { skillMod: { stamina: 3, agility: 3 } }, cost: 800, restricted: "lootbox", rarity: "Legendary" },

        //Agi + Str

        badHeadband: { name: "Paper headband.", effect: { skillMod: { strenght: 0.5, agility: 0.5 } }, cost: 800, restricted: "lootbox", rarity: "Common" },
        goodHeadband: { name: "Proper headband.", effect: { skillMod: { strenght: 1.5, agility: 1.5 } }, cost: 800, restricted: "lootbox", rarity: "Rare" },
        bestHeadband: { name: "Leaf village headband. Weeb.", effect: { skillMod: { strenght: 3, agility: 3 } }, cost: 800, restricted: "lootbox", rarity: "Legendary" },

        //Sta + Str

        badTowel: { name: "Half rotten towel.", effect: { skillMod: { stamina: 0.5, strenght: 0.5 } }, cost: 800, restricted: "lootbox", rarity: "Common" },
        goodTowel: { name: "A good smelling towel.", effect: { skillMod: { stamina: 1.5, strenght: 1.5 } }, cost: 800, restricted:"lootbox", rarity: "Rare" },
        bestTowel: { name: "Towel that has too many sponsors on it.", effect: { skillMod: { stamina: 3, strenght: 3 } }, cost: 800, restricted: "lootbox", rarity: "Legendary" },

        itemBundle: { 
            name: "Store Item Bundle", 
            items: ["badPills", "goodWatch", "bestGlasses"],
            effect: { 
              baseMod: {
                strenght: 0.5,
                stamina: 1.5,
                agility: 1.5,
                intelligence: 3
              } 
            }, 
            cost: 20, 
            restricted: "bundle" 
          } 
        };

    return allItemsDict
}

export function itemDefinations() {
    const effectDescriptions = {
        walkingMultiplier: "Step multiplier",
        walkingPower: "Additive step increase",
        stamina: "Stamina power",
        strenght: "Strenght power",
        agility: "Agility power",
        intelligence: "Intelligence power",
        // Add more descriptions as needed
    };

    return effectDescriptions
}