import { observable, computed } from "@legendapp/state";
import { configureObservablePersistence } from '@legendapp/state/persist'
import { persistObservable } from '@legendapp/state/persist'
import { ObservablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage'
import AsyncStorage from '@react-native-async-storage/async-storage';

// Global configuration
configureObservablePersistence({
    // Use AsyncStorage in React Native
    pluginLocal: ObservablePersistAsyncStorage,
    localOptions: {
        asyncStorage: {
            // The AsyncStorage plugin needs to be given the implementation of AsyncStorage
            AsyncStorage
        }
    }
})

export const state$ = observable({
    modifiers: {
        walkingPower: 1,
        walkingMultiplier: 1,
    },
    skills: {
        strength: {
            xp: 0,
            xpToLevel: 100,
            level: 1,
            power: 1
        },
        agility: {
            xp: 0,
            xpToLevel: 100,
            level: 0,
            power: 1
        },
        stamina: {
            xp: 0,
            xpToLevel: 100,
            level: 0,
            power: 1
        },
        intelligence: {
            xp: 0,
            xpToLevel: 100,
            level: 0,
            power: 1
        },
    },
    stepData: {
        totalSteps: 0, //Total number of steps taken
        currSteps: 0 //Number of steps taken since the last update
    },

    itemData: {

    },


    currency: {
        gold: 0,
        diamonds: 0,
        currStepToDia: 0,
        stepToDia: 1000

    },

    lootbox: {
        lootboxCount: 0,
        lootboxGoldPrice: 15000,
        lootboxDiamondPrice: 15

    },

    settings: {
        soundEnabled: true,
        musicEnabled: false
    },

    gameStates: {
        isStrActive: true,
        isAgiActive: false,
        isStaActive: false,
        isIntActive: false
    },

})

persistObservable(state$, {
    local: 'state'
})

export const walkingResult = computed(() => 
(((state$.skills.strength.level.get() * state$.skills.strength.power.get()) * (state$.stepData.currSteps.get() * state$.modifiers.walkingPower.get() )) + 
(state$.skills.agility.level.get() * state$.skills.agility.power.get()) + 
(state$.skills.stamina.level.get() * state$.skills.stamina.power.get()) )  * (state$.modifiers.walkingMultiplier.get() + intmod.get())); //This is used in every xp calculation as 
                                                                                                                      //the walking result modified my skills
export const intmod = computed(() => (state$.skills.intelligence.level.get()/10));