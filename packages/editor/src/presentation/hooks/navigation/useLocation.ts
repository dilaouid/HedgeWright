import { useState, useEffect } from 'react';

export const useLocation = () => {
    const [pathname, setPathname] = useState(window.location.pathname);

    const navigate = (path: string) => {
        window.history.pushState({}, '', path);
        setPathname(path);
    };

    useEffect(() => {
        const handlePopState = () => {
            setPathname(window.location.pathname);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    return { pathname, navigate };
};
