import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'An unknown error occurred!';

            if (error.error instanceof ErrorEvent) {
                // Client-side / network error
                errorMessage = `Error: ${error.error.message}`;
            } else {
                // Server-side error (RFC 7807 ProblemDetails or standard response)
                if (error.error && error.error.detail) {
                    errorMessage = error.error.detail;
                } else if (error.status === 401) {
                    errorMessage = 'Session expired. Please log in again.';
                    localStorage.removeItem('jwt_token');
                } else if (error.status === 403) {
                    errorMessage = 'You do not have permission to perform this action.';
                } else if (error.status === 404) {
                    errorMessage = 'The requested resource was not found.';
                } else {
                    errorMessage = `Server returned code ${error.status}, message: ${error.message}`;
                }
            }

            console.error('[HTTP Global Error Handler]:', errorMessage, error);
            return throwError(() => new Error(errorMessage));
        })
    );
};
