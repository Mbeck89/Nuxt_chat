import { getModels } from '~/server/databases/elasticsearch'

export default defineEventHandler(async event => {
  const configRuntime = useRuntimeConfig()

  const { userid } = getQuery(event)

  if (configRuntime.database === 'elasticsearch') {
    const models = await getModels(userid)
    console.log(models)
    return models
  }
})
