interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
  apiUrl: string;
  nodeUrl: string;
  es:string;
}

var dns='localhost'
export const AUTH_CONFIG: AuthConfig = {
  clientID: 'zKtLkzlEXNVmjx1eaqLLWT9yH9kmWpwo',
  domain: 'eweb-news.auth0.com',
  callbackURL: 'http://'+dns+':4200/callback',
  apiUrl: 'https://eweb-news.auth0.com/api/v2/',
  nodeUrl: "http://"+dns+":3001",
  es:"http://"+dns+":9200",
};
