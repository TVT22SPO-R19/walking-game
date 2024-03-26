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
        totalSteps: 0,
        currSteps: 0
    }

})

export const walkingResult = computed(() => state$.modifiers.walkingPower.get() * state$.modifiers.walkingMultiplier.get());