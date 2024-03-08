import { getModels } from "~/server/databases/elasticsearch"

export default defineEventHandler(async event => {
    const configRuntime = useRuntimeConfig()
    
    const {userid} = getQuery(event)
    
    console.log(userid)
    if(configRuntime.database === "elasticsearch") {
        const models = await getModels(userid)
        console.log(models)
        return models
    }
    
})