import { fetchFeedback } from "../../lib/miragex/dev/resFeedback/fetch";
import { config } from "./config";

const feedbackLink = config.feedbackLink;

if (!feedbackLink) {
  throw new Error("FEEDBACK_LINK is not set.");
}

fetchFeedback({
  link: feedbackLink,
  outputPath: __dirname,
});
