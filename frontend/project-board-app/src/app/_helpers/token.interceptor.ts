import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthenticationService } from '../_services/authentication.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService,
              private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with token to backend-requests if available
    const currentUser = this.authService.name;
    const token = this.authService.token;

    if (request.url.includes(environment.resourceServer) && currentUser && token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(catchError(res => {
      // globally handle http errors
      if (res instanceof HttpErrorResponse) {
        if (res.status === 404) {
          this.router.navigateByUrl('/notFound', {skipLocationChange: true});
        } else {
          this.router.navigateByUrl('/error', {skipLocationChange: true});
        }
        return next.handle(request);
      }
    }));
  }
}
