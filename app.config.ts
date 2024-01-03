import { ExpoConfig, ConfigContext } from 'expo/config';

const env = Object.fromEntries(
  Object.entries(process.env).filter(([key]) => key.startsWith('EXPO_PUBLIC_')),
);

console.log(env,"<--- env in config.ts")

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: 'project-canon',
  name: 'project-canon',
  extra: { env }
});