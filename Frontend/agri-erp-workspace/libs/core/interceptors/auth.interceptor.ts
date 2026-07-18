import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // লোকাল স্টোরেজ থেকে টোকেন এবং ট্যানেন্ট আইডি পড়া
    const token = localStorage.getItem('jwt_token');
    const tenantId = localStorage.getItem('tenant_id');

    let clonedRequest = req;

    // যদি টোকেন থাকে, তবে রিকোয়েস্টের হেডারে Authorization: Bearer <token> বসিয়ে দেওয়া
    if (token) {
        clonedRequest = clonedRequest.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    // যদি আপনার ব্যাকএন্ডে প্রতি রিকোয়েস্টে TenantId লাগে, তবে এটিও পাঠিয়ে দিন
    if (tenantId) {
        clonedRequest = clonedRequest.clone({
            setHeaders: {
                'X-Tenant-Id': tenantId
            }
        });
    }

    // আপডেট করা রিকোয়েস্টটি সার্ভারে পাঠিয়ে দেওয়া
    return next(clonedRequest);
};