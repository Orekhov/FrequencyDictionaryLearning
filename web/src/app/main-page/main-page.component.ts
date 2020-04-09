import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ScreenSizeService } from '../services/screen-size.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  opened: boolean;
  currentPageDisplayName: string;

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private screenSizeService: ScreenSizeService
    ) { }

  ngOnInit() {
    this.opened = false;
    this.updateTitle();
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.updateTitle();
      }
    })
  }

  isScreenSmall(): boolean {
    return this.screenSizeService.isScreenSmall();
  }

  private updateTitle () {
    const childRoute = this.activatedRoute.firstChild;
    if(childRoute) {
      childRoute.data.subscribe(d => {
        this.currentPageDisplayName = d.title;
      });
    }
  }
}
