import { getPersonas } from '~/server/databases/elasticsearch'

export default defineEventHandler(async event => {
  const configRuntime = useRuntimeConfig()
  const { userid } = getQuery(event)
  if (configRuntime.database === 'elasticsearch') {
    const personas = await getPersonas(userid)
    console.log(personas)
    return personas
  }
})
