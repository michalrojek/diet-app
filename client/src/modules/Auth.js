import axios from 'axios';

class Auth {

    /**
     * Authenticate a user. Save a token string in Local Storage
     * 
     * @param {string} token
     */
    static authenticateUser(token) {
        localStorage.setItem('token', token);
    }

    static authenticateAdmin(isAdmin) {
        localStorage.setItem('isAdmin', isAdmin);
    }

    static authenticateModerator(isModerator) {
        localStorage.setItem('isModerator', isModerator);
    }

    /**
     * Check if a user is authenticated - check if a token is saved in Local Storage
     * 
     * @returns {boolean}
     */
    static isUserAuthenticated() {
        return localStorage.getItem('token') !== null;
    }
    static isUserAdmin() {
        return localStorage.getItem('isAdmin') === 'true';
    }
    static isUserModerator() {
        return localStorage.getItem('isModerator') === 'true';
    }

    /**
     * Deathenticate a user. Remove a token from Local Storage.
     * 
     */
    static deauthentiacteUser() {
        axios({
            method: 'post',
            url: 'http://localhost:5000/api/Users/logout',
            responseType: 'application/json',
            headers: {
                'Authorization': Auth.getToken()
            }
        }).then((response) => {
            console.log(response)
            localStorage.removeItem('token');
            localStorage.removeItem('isAdmin');
            localStorage.removeItem('isModerator');
        })
    }

    /**
     * Get a token value
     * 
     * @returns {string}
     */
    static getToken() {
        return localStorage.getItem('token');
    }

    static setMessage(message) {
        localStorage.setItem('successMessage', message);
    }
}
export default Auth;