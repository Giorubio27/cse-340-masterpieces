// ./src/utils/asyncHandler.js

/**
 * Wrap an Express route/controller so that:
 *  - any thrown error (sync) is caught and passed to next(err)
 *  - any rejected promise (async) is caught and passed to next(err)
 *
 * Usage:
 *   app.get('/route', asyncHandler(async (req, res) => {
 *     const data = await fetchData();
 *     res.render('view', { data });
 *   }));
 */
export function asyncHandler(fn) {
    if (typeof fn !== 'function') {
        throw new TypeError('asyncHandler expects a function');
    }

    return function wrappedHandler(req, res, next) {
        try {
            // If fn returns a promise, attach a catch.
            const maybePromise = fn.call(this, req, res, next);
            if (maybePromise && typeof maybePromise.then === 'function') {
                maybePromise.catch(next);
            }
            // If fn is sync and succeeds, nothing else to do.
            // If fn is sync and throws, it will be caught by the try/catch below.
        } catch (err) {
            next(err);
        }
    };
}