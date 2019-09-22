import { Component, OnInit } from '@angular/core';
import { AuthService, UserProfile } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-info',
  templateUrl: './login-info.component.html',
  styleUrls: ['./login-info.component.css']
})
export class LoginInfoComponent implements OnInit {

  public isUserLoggedIn: boolean;
  public userProfile: UserProfile;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.isSignedIn().then((isSignedIn) => {
      this.isUserLoggedIn = isSignedIn;
      this.authService.getUserProfile().then((p) => {
        this.userProfile = p;
      });
    });
  }

  public onLogout() {
    this.authService.signOut().then(() => {
      this.router.navigate(['/welcome']);
    });
  }

}
