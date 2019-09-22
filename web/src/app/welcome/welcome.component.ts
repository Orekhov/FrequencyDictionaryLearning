import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.initLoginButton();
  }

  private initLoginButton() {
    const router = this.router;
    const body = document.body as HTMLDivElement;
    body.addEventListener('onsignin', () => {
      router.navigate(['']);
    });
    this.authService.renderButton('loginBtn', () => {
      const event = new Event('onsignin');
      body.dispatchEvent(event);
    });
  }

}
