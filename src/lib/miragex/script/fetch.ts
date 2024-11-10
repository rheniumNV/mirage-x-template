import { fetchFeedback } from "../dev/resFeedback/fetch";
import { config } from "./config";
import path from "path";

if (!config.feedbackLink) {
  throw new Error("FEEDBACK_LINK is not set");
}

fetchFeedback({
  link: config.feedbackLink,
  outputPath: path.resolve(__dirname),
});
