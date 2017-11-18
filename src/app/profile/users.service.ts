import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { Http, Response,RequestOptions } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {Users} from "./users.entity";
import {HttpParams} from "@angular/common/http";
import { Client, SearchResponse } from "elasticsearch";


@Injectable()
export class UsersService {


  constructor(protected http: Http) { }



  getFormData(user: string): Observable<Users> {
    var url="http://localhost:9200/users/_search?pretty=true&q=user:"+user;
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }


  updateUser(body : Users): Observable<Users[]>{
    var url="http://localhost:3001/es/users/1/update"

    return this.http
      .post(url,body)
      .map(a=>1)
      .catch(this.handleError);
  }

  createUser(user): Observable<any>{

    var body=user;

    var url="http://localhost:3001/es/users/1/create";

    return this.http.post(url,user)
      .map(a=> 1)
      .catch(this.handleError);
  }

  getSubscriptions():Observable<any>{
    var url="http://localhost:3001/api/listsubs";

    return this.http
      .get(url)
      .map(x=>x.json().topics)
      .catch(this.handleError);
  }


  private extractData(res: Response) {
    let body = res.json();
    return body.hits.hits[0]["_source"] || { };
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
