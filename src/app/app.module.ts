import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { ROUTES } from './app.routes';

import { AuthService } from './auth/auth.service';
import { PingComponent } from './ping/ping.component';
import { CallbackComponent } from './callback/callback.component';

import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { AdminComponent } from './admin/admin.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuardService } from './auth/auth-guard.service';
import { ScopeGuardService } from './auth/scope-guard.service';
import { CommentComponent } from './comment/comment.component';
import { PostsComponent } from './posts/posts.component';

// import {PostsService} from './posts/posts.service';
import { TopicsComponent } from './topics/topics.component';
import {UsersService} from './profile/users.service';
import {SearchService} from "./search.service"
import {MomentModule} from "angular2-moment";

// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import {NgxChartsModule} from '@swimlane/ngx-charts';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    tokenGetter: (() => localStorage.getItem('access_token')),
    globalHeaders: [{'Content-Type': 'application/json'}],
  }), http, options);
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PingComponent,
    ProfileComponent,
    AdminComponent,
    CallbackComponent,
    CommentComponent,
    PostsComponent,
    TopicsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES),
    MomentModule
    // BrowserAnimationsModule,
    // NgxChartsModule
  ],
  providers: [
    AuthService,
    AuthGuardService,
    ScopeGuardService,
    // PostsService,
    UsersService,
    SearchService,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

