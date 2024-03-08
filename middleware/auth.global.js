
import {useAuth} from "~/composables/useAuth";


export default defineNuxtRouteMiddleware( (to, from) => {
    if (process.server) return;
    if (to.name === "/Login") return;

     const { isLoggedIn } = useAuth()
      if (to.name !== "Login" && !isLoggedIn()) {
        return navigateTo("/Login", { replace: true });
      } else if (to.name === "Login" && isLoggedIn()) {
        return navigateTo("/", { replace: true });
      } else {
        return;
      }

})
