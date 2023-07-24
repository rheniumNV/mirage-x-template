import { generateNeosUnitFromFeedback } from "../../../base/neos";
import { unitConfig } from "./detail";
import NeosFeedback from "./NeosFeedback.json";

export const neos = generateNeosUnitFromFeedback({
  config: unitConfig,
  rawFeedback: NeosFeedback,
});
