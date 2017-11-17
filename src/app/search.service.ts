import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client, SearchResponse } from "elasticsearch";

@Injectable()
export class SearchService {
  private _client: Client;

  constructor() {
    if (!this._client) this._connect();
  }

  private _connect() {
    this._client = new Client({
      host: 'http://localhost:9200',
      log: 'trace'
    });
  }


  search(key,value,index): any {

    value=value.replace("http://","").replace("https://","")
    if (value) {
      console.log(value)
      return this._client.search({
        index: index,
        q: `${key}:${value}`,
        "size" : 1000,
      })
    } else {
      return Promise.resolve({})
    }
  }

}
