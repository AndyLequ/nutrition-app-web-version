import {Button} from "react-native";
import { useFood } from "../FoodProvider";

export const ResetButton = () => {
  const { resetFoods } = useFood();

  return (
    <Button
      title="Reset Foods"
      onPress={async () => {
        await resetFoods();
      }}
    />
  );
};
