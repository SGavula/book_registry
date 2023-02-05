import { setCookies, getCookie, removeCookies } from 'cookies-next';

export const syncTokens = async (values) => {
    // if (
    //     values.token !== undefined &&
    //     values.refresh !== undefined &&
    //     values.token !== 'undefined' &&
    //     values.refresh !== 'undefined'
    // ) {
    //     let authData = `{
    //         isLoggedIn: true,
    //         token: ${values.token},
    //         refresh: ${values.refresh}
    //     }`;
    //     setCookies('token', values.token);
    //     setCookies('refresh', values.refresh);
    // }
    // refresh tokens
    if (values.headers['x-refresh-token'] !== undefined && values.headers['x-refresh-token'] !== 'undefined' && values.headers['x-token'] !== undefined && values.headers['x-token'] !== 'undefined') {
        setCookies('token', values.headers['x-token']);
        setCookies('refresh', values.headers['x-refresh-token']);
    }
};

export const getTokens = () => {
    const data = {
        token: getCookie('token'),
        refresh: getCookie('refresh'),
    };
    return data;
}

export const logout = () => {
    removeCookies('token');
    removeCookies('refresh');
}