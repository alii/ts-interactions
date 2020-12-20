function validateEnv<T extends string = string>(
  key: keyof NodeJS.ProcessEnv,
  defaultValue?: T
): T {
  const value = process.env[key] as T | undefined;

  if (!value) {
    if (typeof defaultValue !== "undefined") {
      return defaultValue;
    } else {
      throw new Error(`${key} is not defined in environment variables`);
    }
  }

  return value;
}

export const env = {
  DISCORD_TOKEN: validateEnv("DISCORD_TOKEN"),
  TEST_GUILD: validateEnv("TEST_GUILD"),
};
