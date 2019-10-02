import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { from } from 'rxjs/internal/observable/from';
import { mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(public auth: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const observable = from(this.auth.getAuthResponse());
        return observable.pipe(mergeMap(r => {
            const token = r.id_token;
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
            return next.handle(request);
        }));
    }
}