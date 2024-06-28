import { Play, PlaysAction, sortedPlays } from "./plays";
import { assign } from "lodash";

export default function playsReducer(plays: Play[], action: PlaysAction) {
  switch (action.type) {
    case "add": {
      return [
        ...plays.slice(0, action.index! + 1),
        new Play(action.play!),
        ...plays.slice(action.index! + 1),
      ];
    }

    case "change": {
      return plays.map((play, index) => {
        if (index === action.index) {
          return new Play(assign({}, play, action.play));
        } else {
          return play;
        }
      });
    }

    case "delete": {
      if (action.index === 0 && plays.length === 1) {
        return [new Play()];
      } else {
        return plays.filter((play, index) => index !== action.index);
      }
    }

    case "sort": {
      return sortedPlays(plays);
    }

    case "replace":
      return sortedPlays(action.plays!.map((p) => new Play(p)));
  }
}
