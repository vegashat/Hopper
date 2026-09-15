export const authInterceptor = (request, next) => {
    const token = localStorage.getItem('sessionToken');
    return next(request.clone({
        withCredentials: true,
        ...(token ? { setHeaders: { Authorization: `Bearer ${token}` } } : {})
    }));
};
