import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { Http, Response,RequestOptions } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {Post} from "./posts.entity";


@Injectable()
export class PostsService {

  constructor(protected http: Http) {}

  getFormData(): Observable<Post[]> {

    var url="http://localhost:9200/news/_search?pretty=true&q=*:*";

    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
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
