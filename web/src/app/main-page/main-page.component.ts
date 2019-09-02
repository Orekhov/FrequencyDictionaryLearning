import { Component, OnInit } from '@angular/core';

const SMALL_WIDTH = 720;

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  opened: boolean;
  private mediaMatcher: MediaQueryList = matchMedia(`(max-width: ${SMALL_WIDTH}px)`);

  constructor() { }

  ngOnInit() {
    this.opened = false;
  }

  isScreenSmall(): boolean {
    return this.mediaMatcher.matches;
  }

}
