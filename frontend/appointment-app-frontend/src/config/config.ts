import authConfigJson from "./auth_config.json";
import backendConfigJson from "./backend_config.json";

export interface Auth0Config {
  domain: string;
  clientId: string;
  audience: string;
  scope: string;
}

export function getAuthConfig() : Auth0Config {
  return {
    domain: authConfigJson.domain,
    clientId: authConfigJson.clientId,
    audience: authConfigJson.audience,
    scope: authConfigJson.scope
  };
}

export function getBaseUrl() : string {
  return backendConfigJson.baseUrl;
}
