import { observe, computed } from "@legendapp/state";
import { state$, walkingResult } from "./states";
import { useInterval } from "usehooks-ts"
import { Text } from "react-native";

export default function GameScreen() {


  useInterval(() => {
    const newStrengthXp = (state$.skills.strength.xp.get()) + walkingResult.get();
    state$.skills.strength.xp.set(newStrengthXp);
    //console.log(state$.skills.strength.xp.get())
  }, 1000);
  const strengthXp = state$.skills.strength.xp.get()

  return (
    <Text>Strength XP: {strengthXp}</Text>
  );


}