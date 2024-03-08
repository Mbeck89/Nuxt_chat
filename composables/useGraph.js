
import { useAuth } from "./useAuth"


export const useGraph = () => {
const { getToken } = useAuth()
    
const getSites = async () =>{
    const accessToken =  await this.getToken(['Sites.Read.All'])
          try {  
      const response = await fetch('https://graph.microsoft.com/v1.0/sites?search=*', {  
        headers: {  
          Authorization: `Bearer ${accessToken.accessToken}`,  
        },  
      })
      if (response.ok) {
        const result = await response.json()
        console.log(result)         
        this.sites = result.value
      }               
  } catch (e) {
    console.log(e)      
  }  
  }

  const getDrives = async (siteid) =>{
    const accessToken =  await this.getToken(['Sites.Read.All'])
    try {  
      const response = await fetch(`https://graph.microsoft.com/v1.0/sites/${siteid}/drives`, {  
        headers: {  
          Authorization: `Bearer ${accessToken.accessToken}`,  
        },  
      })
      if (response.ok) {  
        const result = await response.json()         
        this.drives = result.value
      }               
  } catch (e) {
    console.log(e)      
  }  
  },
  const getUsers = async () =>{
    const accessToken =  await this.getToken(['User.Read.All'])
    try {  
      const response = await fetch(`https://graph.microsoft.com/v1.0/users`, {  
        headers: {  
          Authorization: `Bearer ${accessToken.accessToken}`,  
        },  
      })
      if (response.ok) {  
        const result = await response.json()         
        this.users = result.value
      }               
  } catch (e) {
    console.log(e)      
  }  
  },
  const searchUsers = async (searchterm) =>{
    const accessToken =  await this.getToken(['User.Read.All'])
    try {  
      const response = await fetch(`https://graph.microsoft.com/v1.0/users?$search="displayName:${searchterm}`, {  
        headers: {  
          Authorization: `Bearer ${accessToken.accessToken}`,  
        },  
      })
      if (response.ok) {  
        const result = await response.json()         
        this.users = result.value
      }               
  } catch (e) {
    console.log(e)      
  }  
  }

}