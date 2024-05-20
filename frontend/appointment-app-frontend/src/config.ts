import configJson from "./auth_config.json";

export interface Auth0Config {
  domain: string;
  clientId: string;
  audience: string;
  scope: string;
}

export function getConfig() : Auth0Config {
    return {
      domain: configJson.domain,
      clientId: configJson.clientId,
      audience: configJson.audience,
      scope: configJson.scope
    };
  }
  