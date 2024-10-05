export default function asyncHandler(requestHandle, timeout = 9500) {  // Timeout in milliseconds (9.5 seconds)
    return async (req, res, next) => {
        // Create a promise that rejects after the specified timeout
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error('Request timed out. Please try again later.'));
            }, timeout);
        });

        // Handle the request and catch errors, including the timeout
        Promise.race([Promise.resolve(requestHandle(req, res, next)), timeoutPromise])
            .catch(err => {
                console.error(err);
                if (err.message === 'Request timed out. Please try again later.') {
                    res.status(504).json({ message: err.message });
                } else {
                    next(err);
                }
            });
    };
}
