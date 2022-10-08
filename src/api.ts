import fetch, { Response } from "node-fetch";
import ClientOAuth2, { Token } from "client-oauth2";
import { DevicesResponse, SampleDataResponse } from "./models";
import { Logger } from "./logger";

export interface Auth {
  clientId: string;
  clientSecret?: string;
  accessTokenUri?: string;
  scopes?: string[];
}

export interface Options {
  baseUrl?: string;
  auth: Auth;
  logger?: Logger;
}

export class AirthingsApi {
  private readonly oAuthClient: ClientOAuth2;

  private readonly baseUrl: string;

  private token: Promise<Token> | null = null;

  private readonly logger: Logger;

  constructor(options: Options) {
    const auth = {
      accessTokenUri: "https://accounts-api.airthings.com/v1/token",
      scopes: ["read:device:current_values"],
      ...options.auth,
    };
    this.oAuthClient = new ClientOAuth2({
      clientId: auth.clientId,
      clientSecret: auth.clientSecret,
      accessTokenUri: auth.accessTokenUri,
      scopes: auth.scopes,
    });
    this.baseUrl = options.baseUrl ?? "https://ext-api.airthings.com";
    this.logger = options.logger ?? console;
  }

  private async login(): Promise<Token> {
    return this.oAuthClient.credentials.getToken();
  }

  private async ensureToken(): Promise<Token> {
    if (this.token != null) {
      try {
        let token = await this.token;
        if (token.expired()) {
          if (token.refreshToken != null && token.refreshToken.length > 0) {
            this.token = token.refresh();
          } else {
            // In case we don't have offline_access scope
            this.token = this.login();
          }
          token = await this.token;
        }
        return token;
      } catch (e) {
        // Previous login failed.
      }
    }
    this.token = this.login();
    return this.token;
  }

  private async fetch(
    endpoint: string,
    options: { params?: Record<string, string | boolean | number> } = {},
  ): Promise<Response> {
    const urlBuilder = new URL(endpoint, this.baseUrl);
    if (options.params != null) {
      for (const [name, value] of Object.entries(options.params)) {
        urlBuilder.searchParams.append(name, value.toString());
      }
    }
    const token = await this.ensureToken();
    const url = urlBuilder.href;
    this.logger.log(`Fetching ${url}`);
    return fetch(url, token.sign({ method: "get", url }));
  }

  public async getDevices(): Promise<DevicesResponse> {
    const response = await this.fetch("/v1/devices");
    return (await response.json()) as DevicesResponse;
  }

  public async getLatestSamples(deviceId: string): Promise<SampleDataResponse> {
    const response = await this.fetch(
      `/v1/devices/${encodeURI(deviceId)}/latest-samples`,
    );
    return (await response.json()) as SampleDataResponse;
  }
}
