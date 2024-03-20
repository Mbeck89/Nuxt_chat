import { StreamingTextResponse } from 'ai'
// import { AIMessage, HumanMessage } from 'langchain/schema'
import { ChatOpenAI } from '@langchain/openai'
// import { OpenAIClient, AzureKeyCredential } from '@azure/openai'
import { BytesOutputParser } from 'langchain/schema/output_parser'
import { PromptTemplate } from 'langchain/prompts'

//import { HttpResponseOutputParser } from 'langchain/output_parsers'

export default defineEventHandler(async event => {
  const apiKey = useRuntimeConfig().AZURE_OPENAI_API_KEY
  const apiEndpoint = useRuntimeConfig().AZURE_OPENAI_INSTANCE
  const apiVersion = useRuntimeConfig().AZURE_OPENAI_VERSION

  const { messages, modelDeployment, settings } = await readBody(event)
  console.log(modelDeployment, settings)
  const formatMessage = message => {
    return `${message.role}: ${message.content}`
  }
  const TEMPLATE = `${settings.persona}
    Format your response in markdown!
    Current conversation:
    {chat_history}
    
    User: {input}
    AI:`

  try {
    const model = new ChatOpenAI({
      azureOpenAIApiKey: apiKey, // In Node.js defaults to process.env.AZURE_OPENAI_API_KEY
      azureOpenAIApiVersion: apiVersion, // In Node.js defaults to process.env.AZURE_OPENAI_API_VERSION
      azureOpenAIApiInstanceName: apiEndpoint, // In Node.js defaults to process.env.AZURE_OPENAI_API_INSTANCE_NAME
      azureOpenAIApiDeploymentName: modelDeployment.deployment,
      temperature: settings.temperature,
      top_n: settings.topp // In Node.js defaults to process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME
    })
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage)
    const currentMessageContent = messages[messages.length - 1].content
    const outputParser = new BytesOutputParser()
    const prompt = PromptTemplate.fromTemplate(TEMPLATE)
    const chain = prompt.pipe(model).pipe(outputParser)
    const stream = await chain.stream({
      chat_history: formattedPreviousMessages.join('\n'),
      input: currentMessageContent
    })
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 400,
      statusMessage: error.message
    })
  }

  // const formatChatHistory = messageTree => {
  //   const messages = messageTree.map(message => {
  //     if (message.type === 'ai') {
  //       return new AIMessage({ content: message.content })
  //     } else {
  //       return new HumanMessage({ content: message.content })
  //     }
  //   })
  //   return messages
  // }
  //const formatted = formatChatHistory(messages)
  //console.log(formatted)

  //Convert the response into a friendly text-stream

  //const client = new OpenAIClient(apiEndpoint, new AzureKeyCredential(apiKey))
})
