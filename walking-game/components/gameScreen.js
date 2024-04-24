import { observe, computed } from "@legendapp/state";
import { state$, walkingResult, intmod } from "./states";
import { useInterval } from "usehooks-ts"
import { Text, View, Button, StyleSheet, TouchableOpacity } from "react-native";
import { observable } from '@legendapp/state';
import { LinearProgress } from '@rneui/themed';
import { LevelUpSound } from "./sounds";


const capMult = 1.23

export default function GameScreen() {


  const strengthXp = state$.skills.strength.xp.get() //Defining a variable that gets the corresponding global state so it can be used in code.
  const strengthCap = state$.skills.strength.xpToLevel.get()
  const strengthLvl = state$.skills.strength.level.get()
  const strenghtProg = computed(() => Math.min(strengthXp / strengthCap, 1)); //used is progress bar as progress, math.min ensures that the value never exceedes 1

  const agilityXp = state$.skills.agility.xp.get()
  const agilityCap = state$.skills.agility.xpToLevel.get()
  const agilityLvl = state$.skills.agility.level.get()
  const agilityProg = computed(() => Math.min(agilityXp / agilityCap, 1));

  const staminaXp = state$.skills.stamina.xp.get()
  const staminaCap = state$.skills.stamina.xpToLevel.get()
  const staminaLvl = state$.skills.stamina.level.get()
  const staminaProg = computed(() => Math.min(staminaXp / staminaCap, 1));

  const intelligenceXp = state$.skills.intelligence.xp.get()
  const intelligenceCap = state$.skills.intelligence.xpToLevel.get()
  const intelligenceLvl = state$.skills.intelligence.level.get()
  const intelligenceProg = computed(() => Math.min(intelligenceXp / intelligenceCap, 1));

  const currSteps = state$.stepData.currSteps.get()



  useInterval(() => {
    if (currSteps > 0) {         //basic gameplay loop, if there are steps when interval happens, give coins exp etc.
      calcCurrency(currSteps)
      if (state$.gameStates.isStrActive.get() === true) {
        calcStrengthProg(strengthXp, strengthCap)
      } else if (state$.gameStates.isAgiActive.get() === true) {
        calcAgilityProg(agilityXp, agilityCap)
      } else if (state$.gameStates.isStaActive.get() === true) {
        calcstaminaProg(staminaXp, staminaCap)
      } else if (state$.gameStates.isIntActive.get() === true) {
        calcIntelligenceProg(intelligenceXp, intelligenceCap)
      } else { }
    }
  }, 1000);

  const activateStr = () => {

    state$.gameStates.isStrActive.set(true)
    state$.gameStates.isStaActive.set(false)
    state$.gameStates.isAgiActive.set(false)
    state$.gameStates.isIntActive.set(false)

  };


  const activateAgi = () => {

    state$.gameStates.isStrActive.set(false)
    state$.gameStates.isStaActive.set(false)
    state$.gameStates.isAgiActive.set(true)
    state$.gameStates.isIntActive.set(false)

  };

  const activateSta = () => {
    state$.gameStates.isStrActive.set(false)
    state$.gameStates.isStaActive.set(true)
    state$.gameStates.isAgiActive.set(false)
    state$.gameStates.isIntActive.set(false)
  };

  const activateInt = () => {
    state$.gameStates.isStrActive.set(false)
    state$.gameStates.isStaActive.set(false)
    state$.gameStates.isAgiActive.set(false)
    state$.gameStates.isIntActive.set(true)
  };

  return (
    <View style={gamestyles.container}>
      <Text> </Text>
      <Text style={gamestyles.text}>Strength level: {strengthLvl} </Text>
      <Text style={gamestyles.text2} >Strength XP: {strengthXp}/{strengthCap}</Text>
      <LinearProgress
        value={strenghtProg.get()}
        animation={{ duration: 500 }}
        variant="determinate"
        style={gamestyles.progress}
        color="#FCDC2A"
      />
      <TouchableOpacity
        onPress={activateStr}
        style={gamestyles.button}
      >
        <Text style={gamestyles.buttonText}>
          {state$.gameStates.isStrActive.get() ? 'Training your Strength' : 'Click to train Strength'}
        </Text>
      </TouchableOpacity>
     
      <Text style={gamestyles.text}>Agility level: {agilityLvl} </Text>
      <Text style={gamestyles.text2}>Agility XP: {agilityXp}/{agilityCap}</Text>
      <LinearProgress
        value={agilityProg.get()}
        animation={{ duration: 500 }}
        variant="determinate"
        style={gamestyles.progress}
        color="#FCDC2A"
      />
      <TouchableOpacity
        onPress={activateAgi}
        style={gamestyles.button}
      >
        <Text style={gamestyles.buttonText}>
          {state$.gameStates.isAgiActive.get() ? 'Training your Agility' : 'Click to train Agility'}
        </Text>
      </TouchableOpacity>

      <Text style={gamestyles.text}>Stamina level: {staminaLvl} </Text>
      <Text style={gamestyles.text2}>Stamina XP: {staminaXp}/{staminaCap}</Text>
      <LinearProgress
        value={staminaProg.get()}
        animation={{ duration: 500 }}
        variant="determinate"
        style={gamestyles.progress}
        color="#FCDC2A"
      />
      <TouchableOpacity
        onPress={activateSta}
        style={gamestyles.button}
      >
        <Text style={gamestyles.buttonText}>
        {state$.gameStates.isStaActive.get() ? 'Training your Stamina' : 'Click to train Stamina'}
        </Text>
      </TouchableOpacity>

      <Text style={gamestyles.text}>Intelligence level: {intelligenceLvl} </Text>
      <Text style={gamestyles.text2}>Intelligence XP: {intelligenceXp}/{intelligenceCap}</Text>
      <LinearProgress
        value={intelligenceProg.get()}
        animation={{ duration: 500 }}
        variant="determinate"
        style={gamestyles.progress}
        color="#FCDC2A"
      />
      <TouchableOpacity
        onPress={activateInt}
        style={gamestyles.button}
      >
        <Text style={gamestyles.buttonText}>
        {state$.gameStates.isIntActive.get() ? 'Training your Intelligence' : 'Click to train Intelligence'}
        </Text>
      </TouchableOpacity>
    </View>
  );


}

const gamestyles = StyleSheet.create({
  container: {
    backgroundColor: '#313338' ,
    color: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: 10,
    marginBottom: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  text2: {
    marginBottom: -30,
    color: 'black',
    zIndex: 1, // Ensure the text is on top by setting a higher z-index
    fontWeight: 'bold',
  },
  progress: {
    width: "90%",
    height: 40,
    marginBottom: 5,
    
  },
  button: {
    backgroundColor: '#87A922',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '90%',
    height: 40,
    
    
  },
  buttonText: {
    fontWeight: 'bold'

    
    
  },
});

function calcStrengthProg(xp, cap) {                        //function that calculates the strength xp progress
  const newStrengthXp = xp + walkingResult.get();
  state$.stepData.currSteps.set(0);                         //Reset the steps since they were used
  state$.skills.strength.xp.set(Math.round(newStrengthXp));

  if (newStrengthXp >= cap) {                                 //if xp is over the cap we do the skill level up calculation
    const overflow = newStrengthXp - cap;                              //calculating overflow of xp so none is wasted
    if (overflow > 0) {
      state$.skills.strength.xp.set(Math.round(overflow))               //sets the overflown xp as the new xp value
    } else {
      state$.skills.strength.xp.set(0)
    }
    state$.stepData.currSteps.set(0)
    state$.skills.strength.level.set((v) => v + 1)            //increment skill level
    const newStrengthcap = Math.round((cap * capMult) ** 1.01)          //calculating exponential increase for the new xp to levelling up requirement
    state$.skills.strength.xpToLevel.set(newStrengthcap)    //setting the new xp requirement
    LevelUpSound();
  }
}

function calcAgilityProg(xp, cap) {                        //function that calculates the agility xp progress
  const newAgilityXp = xp + walkingResult.get();
  state$.stepData.currSteps.set(0);                         //Reset the steps since they were used
  state$.skills.agility.xp.set(Math.round(newAgilityXp));

  if (newAgilityXp >= cap) {                                 //if xp is over the cap we do the skill level up calculation
    const overflow = newAgilityXp - cap;                              //calculating overflow of xp so none is wasted
    if (overflow > 0) {
      state$.skills.agility.xp.set(Math.round(overflow))               //sets the overflown xp as the new xp value
    } else {
      state$.skills.agility.xp.set(0)
    }
    state$.stepData.currSteps.set(0)
    state$.skills.agility.level.set((v) => v + 1)            //increment skill level
    const newAgilityCap = Math.round((cap * capMult) ** 1.01)          //calculating exponential increase for the new xp to levelling up requirement
    state$.skills.agility.xpToLevel.set(newAgilityCap)    //setting the new xp requirement
    LevelUpSound();
  }
}

function calcstaminaProg(xp, cap) {                        //function that calculates the stamina xp progress
  const newStaminaXp = xp + walkingResult.get();
  state$.stepData.currSteps.set(0);                         //Reset the steps since they were used
  state$.skills.stamina.xp.set(Math.round(newStaminaXp));

  if (newStaminaXp >= cap) {                                 //if xp is over the cap we do the skill level up calculation
    const overflow = newStaminaXp - cap;                              //calculating overflow of xp so none is wasted
    if (overflow > 0) {
      state$.skills.stamina.xp.set(Math.round(overflow))               //sets the overflown xp as the new xp value
    } else {
      state$.skills.stamina.xp.set(0)
    }
    state$.stepData.currSteps.set(0)
    state$.skills.stamina.level.set((v) => v + 1)            //increment skill level
    const newStaminaCap = Math.round((cap * capMult) ** 1.01)          //calculating exponential increase for the new xp to levelling up requirement
    state$.skills.stamina.xpToLevel.set(newStaminaCap)    //setting the new xp requirement
    LevelUpSound();
  }
}

function calcIntelligenceProg(xp, cap) {                        //function that calculates the intelligence xp progress
  const newIntelligenceXp = xp + walkingResult.get();
  state$.stepData.currSteps.set(0);                         //Reset the steps since they were used
  state$.skills.intelligence.xp.set(Math.round(newIntelligenceXp));

  if (newIntelligenceXp >= cap) {                                 //if xp is over the cap we do the skill level up calculation
    const overflow = newIntelligenceXp - cap;                              //calculating overflow of xp so none is wasted
    if (overflow > 0) {
      state$.skills.intelligence.xp.set(Math.round(overflow))               //sets the overflown xp as the new xp value
    } else {
      state$.skills.intelligence.xp.set(0)
    }
    state$.stepData.currSteps.set(0)
    state$.skills.intelligence.level.set((v) => v + 1)            //increment skill level
    const newIntelligenceCap = Math.round((cap * capMult) ** 1.01)          //calculating exponential increase for the new xp to levelling up requirement
    state$.skills.intelligence.xpToLevel.set(newIntelligenceCap)    //setting the new xp requirement
    LevelUpSound();
  }
}

function calcCurrency(steps) {
  state$.currency.gold.set((prev) => prev + steps)
  state$.currency.currStepToDia.set((prev) => prev + steps)
  if (state$.currency.currStepToDia.get() >= state$.currency.stepToDia.get()) {
    state$.currency.currStepToDia.set(0)
    const overflow = state$.currency.currStepToDia.get() - state$.currency.stepToDia.get();
    if (overflow > 0) {
      state$.currency.currStepToDia.set(overflow)
    } else {
      state$.currency.diamonds.set((prev) => prev + 1)
    }
  }
}

