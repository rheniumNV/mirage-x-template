import { generateNeosUnitFromFeedback } from "../../../base/neos";
import { unitConfig } from "./detail";
const NeosFeedback = require("../NeosFeedback.json");

export const neos = generateNeosUnitFromFeedback({
  config: unitConfig,
  rawFeedback: NeosFeedback,
});
