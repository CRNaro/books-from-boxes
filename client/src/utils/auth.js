// use this to decode a token and get the user's information out of it
import decode from 'jwt-decode';

// create a new class to instantiate for a user
class AuthService {
  // get user data
  getProfile() {
    // Get the token from local storage
    const token = this.getToken();
  
    // Decode the token to get the user's information
    const profile = decode(token);
  
    // Log the decoded profile
    console.log('Decoded profile:', profile);
  
    // Return the decoded profile
    return profile;
  }

  // check if user's logged in
  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    const loggedIn = !!token && !this.isTokenExpired(token);
    
    //console.log('User is logged in:', loggedIn);
    
    return loggedIn;
  }
  
  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      const isExpired = decoded.exp < Date.now() / 1000;
      
      //console.log('Token is expired:', isExpired);
      
      return isExpired;
    } catch (err) {
      console.log('Failed to decode token:', err);
      
      return false;
    }
  }

  getToken() {
    // Retrieves the user token from localStorage
    const token = localStorage.getItem('id_token');
   // console.log('token from local storage: ', token);

    return token;
  }

  login(idToken) {
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
    // this will reload the page and reset the state of the application
    window.location.assign('/');
  }
}

export default new AuthService();
