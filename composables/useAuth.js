
// MSAL Instance is initialized in msal plugin
const blankPic = new URL('/blankProfile.jpg', import.meta.url)
export function useAuth () {

  const error = ref(null)
  const user = ref(null)
  const userPicture = ref(null)
  const { $msalInstance } = useNuxtApp()
  const router = useRouter()
 
  async function login () {
    try {      
      const response = await $msalInstance.loginPopup({})
      router.push({path:"/chat"})
      return response
    } catch (e) {
      console.log(e)
      error.value = e
    }
  }

  async function logout () {
    //const logoutHint = await $msalInstance.accounts[0].idTokenClaims.login_hint
    await $msalInstance.logoutPopup({
      //logoutHint: logoutHint,
      mainWindowRedirectUri: `${import.meta.env.VITE_API_BASE_URL}/logout`
    })
  }
  function isLoggedIn () {
    
    const accounts = $msalInstance.getAllAccounts()
    console.log(accounts)
    return accounts.length > 0
  }

  function getUser() {
    console.log("get user was cvalled")
    const accounts = $msalInstance.getAllAccounts();
    console.log(accounts)
    if (accounts.length > 0) {
      user.value = accounts[0];      
    }
  }

  async function getUserPicture() {
    console.log('pic called')   
    try {  
      const pic = await callGraph(['User.Read'],'/me/photo/$value')
      console.log(pic)
      userPicture.value = URL.createObjectURL(pic);             
  } catch (e) {
    console.log(e)
    userPicture.value = blankPic
  }  
}
  const getToken = async (scope) => {
    // scope is like ['User.Read']
    const tokenRequest = {
      scopes: scope,
      account: user.value,
    }
    try {     
      const accessToken = await $msalInstance.acquireTokenSilent(tokenRequest);
      return accessToken
  } catch (e) {
    const accessToken = await $msalInstance.acquireTokenPopup(tokenRequest);
    return accessToken
  }
  }
  const callGraph = async (scope, endpoint) => {
    try {
      const accessToken = await getToken(scope);
      const result = await $fetch(
        `https://graph.microsoft.com/v1.0${endpoint}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken.accessToken}`,
          },
        }
      );
      return result;
    } catch (e) {
      console.log(e);      
      error.value = e;
      throw e
    }
  };
  return { login, logout, error, isLoggedIn, getUser, user, userPicture, callGraph, getUserPicture }
}


