interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
  apiUrl: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: 'zKtLkzlEXNVmjx1eaqLLWT9yH9kmWpwo',
  domain: 'eweb-news.auth0.com',
  callbackURL: 'http://localhost:4200/callback',
  apiUrl: 'https://eweb-news.auth0.com/api/v2/'
};
