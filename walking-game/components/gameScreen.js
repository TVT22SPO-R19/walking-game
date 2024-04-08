import { observe, computed } from "@legendapp/state";
import { state$, walkingResult } from "./states";
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
    if (gameStates.isStrActive.get() === true) {
      if (currSteps > 0) {
        calcStrengthProg(strengthXp, strengthCap)
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
      <Text></Text>
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

function calcStrengthProg(xp, cap) {                        //function that
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
    const newStrengthcap = Math.round(cap ** 1.01)          //calculating exponential increase for the new xp to levelling up requirement
    state$.skills.strength.xpToLevel.set(newStrengthcap)    //setting the new xp requirement

  }
}

