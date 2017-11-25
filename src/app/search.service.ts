import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client, SearchResponse } from "elasticsearch";
import { Http, Response,RequestOptions } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {AuthService} from "./auth/auth.service";
import {AuthHttp} from "angular2-jwt";
import {AUTH_CONFIG} from "./auth/auth0-variables";

@Injectable()
export class SearchService {
  private _client: Client;

  constructor(protected http: Http,protected auth:AuthHttp) {
    if (!this._client) this._connect();
    this.http=http;
  }

  private _connect() {
    this._client = new Client({
      host: AUTH_CONFIG.es,
    });
  }


  search(key,value,index): any {

    value=value.replace("http://","").replace("https://","")
    if (value) {
      return this._client.search({
        index: index,
        q: `${key}:${value}`,
        "size" : 100,
      })
    } else {
      return Promise.resolve({})
    }
  }

  searchByword(word:string){
    var url=AUTH_CONFIG.nodeUrl+"/es/news/search/"+word;

    return this.auth.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  update(post){
    var url=AUTH_CONFIG.nodeUrl+'/es/news/post/update';
    return this.auth.post(url,post)
      .map(x=>1)
      .catch(this.handleError)

  }

  private extractData(res: Response) {
    let body = res.json();
    return body.hits.hits || { };
  }

  private handleError (error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
