import { Injectable } from '@angular/core';

declare global {
  interface Window {
    gapi: GApi;
  }
}

export interface UserProfile {
  email: string;
  imgUrl: string;
}

export interface AuthResponse {
  id_token: string
}

export interface BasicProfile {
  getEmail: () => string
  getImageUrl: () => string
}

export interface GoogleUser {
  getAuthResponse: () => AuthResponse
  getBasicProfile: () => BasicProfile
}

export interface CurrectUser {
  get: () => GoogleUser
}

export interface GoogleAuth {
  isSignedIn: any;
  currentUser: CurrectUser;
  signOut: () => Promise<void>;
}


export interface GApi {
  load: any;
  auth2: any;
  signin2: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {
    this.init();
  }

  private appId = '579127180841-peva9nafnfmrmkqamrnmbdai6o1phvot.apps.googleusercontent.com';
  private googleApi: Promise<GApi>;
  private googleAuth: Promise<GoogleAuth>;

  public isSignedIn(): Promise<boolean> {
    return this.googleAuth.then((googleAuth) => {
      return googleAuth.isSignedIn.get() as boolean;
    });
  }

  public getUserProfile(): Promise<UserProfile> {
    return this.googleAuth.then((r) => {
      const basicProfile = r.currentUser.get().getBasicProfile();
      return {
        email: basicProfile.getEmail(),
        imgUrl: basicProfile.getImageUrl()
      };
    });
  }

  public getAuthResponse(): Promise<AuthResponse> {
    return this.googleAuth.then((r) => {
      return r.currentUser.get().getAuthResponse();
    });
  }

  public signOut(): Promise<void> {
    return this.googleAuth.then((googleAuth) => {
      return googleAuth.signOut();
    });
  }

  public renderButton(elementId: string, onLogin: () => any) {
    this.googleAuth.then(() => {
      this.googleApi.then((gapi) => {
        console.log(gapi);
        gapi.signin2.render(elementId, {
          onsuccess: () => onLogin()
        });
      });
    });
  }

  private init(): Promise<GoogleAuth> {
    if (!this.googleAuth) {
      this.googleAuth = this.loadScript().then((gapi) => {
        const loadAuth = new Promise((resolve, reject) => {
          gapi.load('auth2', () => resolve());
        });
        return loadAuth.then(() => {
          return gapi.auth2.init({
            client_id: this.appId
          });
        });
      });
    }
    return this.googleAuth;
  }

  private loadScript(): Promise<GApi> {
    const buildScript = (url) => {
      const body = document.body as HTMLDivElement;
      const script = document.createElement('script');
      script.innerHTML = '';
      script.src = url;
      script.async = false;
      script.defer = true;
      body.appendChild(script);
      return script;
    };

    if (!this.googleApi) {
      this.googleApi = new Promise((resolve, reject) => {
        const scriptTag = buildScript('https://apis.google.com/js/platform.js');
        scriptTag.onload = () => resolve(window.gapi);
      });
    }
    return this.googleApi;
  }

}
