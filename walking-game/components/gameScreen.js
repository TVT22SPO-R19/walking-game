import { observe, computed } from "@legendapp/state";
import { state$, walkingResult } from "./states";
import { useInterval } from "usehooks-ts"
import { Text, View } from "react-native";

export default function GameScreen() {

  const strengthXp = state$.skills.strength.xp.get() //Defining a variable that gets the corresponding global state so it can be used in code.
  const strengthCap = state$.skills.strength.xpToLevel.get()
  const strengthLvl = state$.skills.strength.level.get()

useInterval(() => {
  
  calcStrengthProg(strengthXp, strengthCap)
  
}, 1000);


return (
  <View>
  <Text>Strength XP: {strengthXp}/{strengthCap}</Text>
  <Text>Strength level: {strengthLvl} </Text>
  </View>
);
    

}

function calcStrengthProg(xp, cap) {                        //function that
  const newStrengthXp = xp + walkingResult.get();
  state$.stepData.currSteps.set(0);                         //Reset the steps since they were used
  state$.skills.strength.xp.set(newStrengthXp);

  if(newStrengthXp >= cap){                                 //if xp is over the cap we do the skill level up calculation
    const overflow = newStrengthXp - cap;                              //calculating overflow of xp so none is wasted
    if(overflow > 0){
      state$.skills.strength.xp.set(overflow)               //sets the overflown xp as the new xp value
    } else {
          state$.skills.strength.xp.set(0)
    }
                     
    state$.skills.strength.level.set((v) => v+1)            //increment skill level
    const newStrengthcap = Math.round(cap ** 1.01)          //calculating exponential increase for the new xp to levelling up requirement
    state$.skills.strength.xpToLevel.set(newStrengthcap)    //setting the new xp requirement
    
  }
}