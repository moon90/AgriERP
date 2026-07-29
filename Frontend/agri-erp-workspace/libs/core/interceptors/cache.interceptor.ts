import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, tap } from 'rxjs';

const cache = new Map<string, HttpResponse<unknown>>();

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
        return next(req);
    }

    const cachedResponse = cache.get(req.urlWithParams);
    if (cachedResponse) {
        return of(cachedResponse.clone());
    }

    return next(req).pipe(
        tap(event => {
            if (event instanceof HttpResponse && event.status === 200) {
                cache.set(req.urlWithParams, event.clone());
            }
        })
    );
};
