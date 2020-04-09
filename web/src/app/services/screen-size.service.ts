import { Injectable } from '@angular/core';

const SMALL_WIDTH = 720;

@Injectable({
    providedIn: 'root'
})
export class ScreenSizeService {

    constructor() { }

    public isScreenSmall(): boolean {
        return this.mediaMatcher.matches;
    }

    private mediaMatcher: MediaQueryList = matchMedia(`(max-width: ${SMALL_WIDTH}px)`);
}
