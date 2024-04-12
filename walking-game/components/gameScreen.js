import { observe, computed } from "@legendapp/state";
import { state$, walkingResult, intmod } from "./states";
import { useInterval } from "usehooks-ts"
import { Text, View, Button } from "react-native";
import { observable } from '@legendapp/state';

const gameStates = observable({
  isStrActive: true,
  isAgiActive: false,
  isStaActive: false,
  isIntActive: false
});

export default function GameScreen() {


  const strengthXp = state$.skills.strength.xp.get() //Defining a variable that gets the corresponding global state so it can be used in code.
  const strengthCap = state$.skills.strength.xpToLevel.get()
  const strengthLvl = state$.skills.strength.level.get()

  const agilityXp = state$.skills.agility.xp.get()
  const agilityCap = state$.skills.agility.xpToLevel.get()
  const agilityLvl = state$.skills.agility.level.get()

  const staminaXp = state$.skills.stamina.xp.get()
  const staminaCap = state$.skills.stamina.xpToLevel.get()
  const staminaLvl = state$.skills.stamina.level.get()

  const intelligenceXp = state$.skills.intelligence.xp.get()
  const intelligenceCap = state$.skills.intelligence.xpToLevel.get()
  const intelligenceLvl = state$.skills.intelligence.level.get()

  const currSteps = state$.stepData.currSteps.get()



  useInterval(() => {

    if (currSteps > 0) {
      calcGold(currSteps)
      if (gameStates.isStrActive.get() === true) {
        calcStrengthProg(strengthXp, strengthCap)
      } else if (gameStates.isAgiActive.get() === true) {
         calcAgilityProg(agilityXp,agilityCap)
      } else if (gameStates.isStaActive.get() === true) {
         calcstaminaProg(staminaXp,staminaCap)
      } else if (gameStates.isIntActive.get() === true) {
        calcIntelligenceProg(intelligenceXp,intelligenceCap)
      } else { }
    }
  }, 1000);

  const activateStr = () => {

    gameStates.isStrActive.set(true)
    gameStates.isStaActive.set(false)
    gameStates.isAgiActive.set(false)
    gameStates.isIntActive.set(false)

  };


  const activateAgi = () => {

    gameStates.isStrActive.set(false)
    gameStates.isStaActive.set(false)
    gameStates.isAgiActive.set(true)
    gameStates.isIntActive.set(false)

  };

  const activateSta = () => {
    gameStates.isStrActive.set(false)
    gameStates.isStaActive.set(true)
    gameStates.isAgiActive.set(false)
    gameStates.isIntActive.set(false)
  };

  const activateInt = () => {
    gameStates.isStrActive.set(false)
    gameStates.isStaActive.set(false)
    gameStates.isAgiActive.set(false)
    gameStates.isIntActive.set(true)
  };

  return (
    <View>
      <Text> </Text>
      <Text>DELETE ME GOLD: {state$.currency.gold.get()}</Text>
      <Text>Strength XP: {strengthXp}/{strengthCap}</Text>
      <Text>Strength level: {strengthLvl} </Text>
      <Button onPress={activateStr} title={gameStates.isStrActive.get() ? 'Active' : 'Deactive'}></Button>

      <Text>Agility XP: {agilityXp}/{agilityCap}</Text>
      <Text>Agility level: {agilityLvl} </Text>
      <Button onPress={activateAgi} title={gameStates.isAgiActive.get() ? 'Active' : 'Deactive'}></Button>

      <Text>Stamina XP: {staminaXp}/{staminaCap}</Text>
      <Text>Stamina level: {staminaLvl} </Text>
      <Button onPress={activateSta} title={gameStates.isStaActive.get() ? 'Active' : 'Deactive'}></Button>

      <Text>Intelligence XP: {intelligenceXp}/{intelligenceCap}</Text>
      <Text>Intelligence level: {intelligenceLvl} </Text>
      <Button onPress={activateInt} title={gameStates.isIntActive.get() ? 'Active' : 'Deactive'}></Button>
    </View>
  );


}

function calcStrengthProg(xp, cap) {                        //function that calculates the strength xp progress
  const newStrengthXp = xp + walkingResult.get();
  state$.stepData.currSteps.set(0);                         //Reset the steps since they were used
  state$.skills.strength.xp.set(newStrengthXp);

  if (newStrengthXp >= cap) {                                 //if xp is over the cap we do the skill level up calculation
    const overflow = newStrengthXp - cap;                              //calculating overflow of xp so none is wasted
    if (overflow > 0) {
      state$.skills.strength.xp.set(overflow)               //sets the overflown xp as the new xp value
    } else {
      state$.skills.strength.xp.set(0)
    }
    state$.stepData.currSteps.set(0)
    state$.skills.strength.level.set((v) => v + 1)            //increment skill level
    const newStrengthcap = Math.round((cap * intmod.get()) ** 1.01)          //calculating exponential increase for the new xp to levelling up requirement
    state$.skills.strength.xpToLevel.set(newStrengthcap)    //setting the new xp requirement

  }
}

function calcAgilityProg(xp, cap) {                        //function that calculates the agility xp progress
  const newAgilityXp = xp + walkingResult.get();
  state$.stepData.currSteps.set(0);                         //Reset the steps since they were used
  state$.skills.agility.xp.set(newAgilityXp);

  if (newAgilityXp >= cap) {                                 //if xp is over the cap we do the skill level up calculation
    const overflow = newAgilityXp - cap;                              //calculating overflow of xp so none is wasted
    if (overflow > 0) {
      state$.skills.agility.xp.set(overflow)               //sets the overflown xp as the new xp value
    } else {
      state$.skills.agility.xp.set(0)
    }
    state$.stepData.currSteps.set(0)
    state$.skills.agility.level.set((v) => v + 1)            //increment skill level
    const newAgilityCap = Math.round((cap * intmod.get()) ** 1.01)          //calculating exponential increase for the new xp to levelling up requirement
    state$.skills.agility.xpToLevel.set(newAgilityCap)    //setting the new xp requirement

  }
}

function calcstaminaProg(xp, cap) {                        //function that calculates the stamina xp progress
  const newStaminaXp = xp + walkingResult.get();
  state$.stepData.currSteps.set(0);                         //Reset the steps since they were used
  state$.skills.stamina.xp.set(newStaminaXp);

  if (newStaminaXp >= cap) {                                 //if xp is over the cap we do the skill level up calculation
    const overflow = newStaminaXp - cap;                              //calculating overflow of xp so none is wasted
    if (overflow > 0) {
      state$.skills.stamina.xp.set(overflow)               //sets the overflown xp as the new xp value
    } else {
      state$.skills.stamina.xp.set(0)
    }
    state$.stepData.currSteps.set(0)
    state$.skills.stamina.level.set((v) => v + 1)            //increment skill level
    const newStaminaCap = Math.round((cap * intmod.get()) ** 1.01)          //calculating exponential increase for the new xp to levelling up requirement
    state$.skills.stamina.xpToLevel.set(newStaminaCap)    //setting the new xp requirement

  }
}

function calcIntelligenceProg(xp, cap) {                        //function that calculates the intelligence xp progress
  const newIntelligenceXp = xp + walkingResult.get();
  state$.stepData.currSteps.set(0);                         //Reset the steps since they were used
  state$.skills.intelligence.xp.set(newIntelligenceXp);

  if (newIntelligenceXp >= cap) {                                 //if xp is over the cap we do the skill level up calculation
    const overflow = newIntelligenceXp - cap;                              //calculating overflow of xp so none is wasted
    if (overflow > 0) {
      state$.skills.intelligence.xp.set(overflow)               //sets the overflown xp as the new xp value
    } else {
      state$.skills.intelligence.xp.set(0)
    }
    state$.stepData.currSteps.set(0)
    state$.skills.intelligence.level.set((v) => v + 1)            //increment skill level
    const newIntelligenceCap = Math.round((cap * intmod.get()) ** 1.01)          //calculating exponential increase for the new xp to levelling up requirement
    state$.skills.intelligence.xpToLevel.set(newIntelligenceCap)    //setting the new xp requirement

  }
}

function calcGold(steps) {
  state$.currency.gold.set((prev) => prev + steps)
}

