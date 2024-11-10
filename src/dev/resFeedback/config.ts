type Config = {
  feedbackLink?: string;
};

const defaultConfig: Config = {};

const { FEEDBACK_LINK } = process.env;

if (!FEEDBACK_LINK) {
  console.warn("FEEDBACK_LINK is not set.");
}

export const config: Config = {
  ...defaultConfig,
  feedbackLink: FEEDBACK_LINK,
};
