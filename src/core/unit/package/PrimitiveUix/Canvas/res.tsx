import { generateResUnitFromFeedback } from "../../../../../lib/mirage-x/unit/res";
import { unitConfig } from "./detail";
import ResFeedback from "./ResFeedback.json";

export const res = generateResUnitFromFeedback({
  config: unitConfig,
  rawFeedback: ResFeedback,
});
