import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { RouterModule } from '@angular/router';
import 'hammerjs';

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

import { MatCheckboxModule} from '@angular/material';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatTabsModule} from '@angular/material/tabs';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations"
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';

// import {PostsService} from './posts/posts.service';
import { TopicsComponent } from './topics/topics.component';
import {UsersService} from './profile/users.service';
import {SearchService} from "./search.service"
import {MomentModule} from "angular2-moment";
import { FavoritesComponent } from './favorites/favorites.component';
import { TagComponent } from './tag/tag.component';
import {MatChipsModule} from '@angular/material/chips';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import { HeartComponent } from './heart/heart.component';
import {MatButtonModule} from '@angular/material/button';
import { RecommendationsComponent } from './recommendations/recommendations.component';

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
    TopicsComponent,
    FavoritesComponent,
    TagComponent,
    HeartComponent,
    RecommendationsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES),
    MomentModule,
    MatButtonModule,MatToolbarModule,MatMenuModule,MatTabsModule,BrowserAnimationsModule,MatCardModule,MatChipsModule,MatGridListModule,MatFormFieldModule,MatIconModule,MatListModule
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

