export const languages = ["ja", "en", "ko"] as const;
export type Language = (typeof languages)[number];

export type FunctionEnv = {
  userId: string;
  lang: Language;
};
