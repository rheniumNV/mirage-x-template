import { generateResUnitFromFeedback } from "../../../../../lib/miragex/unit/res";

import ResFeedback from "./ResFeedback.json";
import { unitConfig } from "./detail";

export const res = generateResUnitFromFeedback({
  config: unitConfig,
  rawFeedback: ResFeedback,
});
