import { observable, computed } from "@legendapp/state";

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
    },
    stepData: {
        totalSteps: 0, //Total number of steps taken
        currSteps: 0 //Number of steps taken since the last update
    },
    itemData: {
        baseBoots: {level: 1},
    }

})

export const walkingResult = computed(() => (state$.skills.strength.level.get() + state$.stepData.currSteps.get() )  * state$.modifiers.walkingMultiplier.get());