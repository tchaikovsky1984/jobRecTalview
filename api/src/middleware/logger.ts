import type { LogType } from "../config/types.ts";

const _possibleTypes = ["LOG", "ERR", "WAR"];

export function displayLog(text: string, ty: LogType): void {
  if (!text) {
    throw new Error("Text not provided");
  }
  if (_possibleTypes.indexOf(ty) < 0) {
    throw new Error("Illegal Log Type");
  }
  console.log("-------------------------------------");
  console.log(ty + "|| : \n" + text);
  console.log("-------------------------------------");
};
