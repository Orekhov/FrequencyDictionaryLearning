import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

const SMALL_WIDTH = 720;

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  opened: boolean;
  currentPageDisplayName: string;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.opened = false;

    this.activatedRoute.firstChild.data.subscribe(d => {
      this.currentPageDisplayName = d.title;
    });
  }

  isScreenSmall(): boolean {
    return this.mediaMatcher.matches;
  }

  private mediaMatcher: MediaQueryList = matchMedia(`(max-width: ${SMALL_WIDTH}px)`);

}
