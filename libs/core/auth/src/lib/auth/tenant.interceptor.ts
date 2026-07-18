/* eslint-disable @nx/enforce-module-boundaries */
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../../../../src/environments/environment';

export const tenantInterceptor: HttpInterceptorFn = (req, next) => {
    const modifiedReq = req.clone({
        headers: req.headers.set('X-Tenant-Id', environment.tenantId)
    });
    return next(modifiedReq);
};