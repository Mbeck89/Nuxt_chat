import { Client } from "@elastic/elasticsearch";

const runTimeConfig = useRuntimeConfig()
let config
if (
    !runTimeConfig.ELASTIC_CLOUD_ID ||
    !runTimeConfig.ELASTIC_PASSWORD ||
    !runTimeConfig.ELASTIC_USERNAME
  ) {
    throw createError({
      statusCode: 500,
      statusMessage: "ELASTIC CONFIG INCOMPLETE",
    });
  } else {
    config = {
      cloud: {
        id: runTimeConfig.ELASTIC_CLOUD_ID,
      },
      auth: {
        username: runTimeConfig.ELASTIC_USERNAME,
        password: runTimeConfig.ELASTIC_PASSWORD,
      },
    };
}
const client = new Client(config);

export const getModels = async(userid) => {
    try {
        const models = await client.search({
            index: "models",
            query:{
                bool: {
                should: [
                    {
                    term: {
                        shared: "system"
                    }
                    },
                    {
                    terms: {
                        'shared.keyword': [userid]
                    }
                    }
                ]
                }
            }
        })
        const result = models.hits.hits.map(model=> model._source)
        return result
        
    } catch (error) {
        console.log(error)
        throw error
    }
    
}

export const createNewModel = async(data) => {
    try {
        await client.index({
            index: "models",
            body: data
        })
        return "created"
        
    } catch (error) {
        console.log(error)
        throw error        
    }

}