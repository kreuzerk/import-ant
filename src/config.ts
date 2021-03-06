import { sync } from 'glob';

import { getThirdParty } from './conductor/get-third-party';
import { defaultConfig } from './defaultConfig';
import { CliConfig, Config } from './types';

let config: Config;

export function resolveConfig(cliConfig: Partial<CliConfig>): Config {
  const { noAutoAdd, ...rest } = cliConfig;
  const normalized = {
    ...rest,
    autoAdd: !noAutoAdd,
  };

  const merged = {
    ...defaultConfig,
    ...normalized,
    thirdPartyDependencies: getThirdParty(),
  };
  if (merged.ignore.length > 0) {
    merged.ignore = merged.ignore.map((pattern) => (pattern.includes('*') ? sync(pattern) : pattern)).flat();
  }

  return merged;
}

export function getConfig(): Config {
  return config;
}

export function setConfig(cliConfig: Config) {
  config = cliConfig;
}
