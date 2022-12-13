import { HZClient } from "../classes/HZClient";
import tanks from "../features/json/diepTanks.json";
import { AutocompleteData } from "../utils/types";

export default function(_client: HZClient): AutocompleteData {
  const result = Object.values(tanks).map((v) => ({ name: v.name }));

  return { '坦克': result };
}
