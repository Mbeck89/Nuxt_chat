import { client } from "~/server/databases/elasticsearch"
import {  StreamingTextResponse } from 'ai'
import { OpenAIEmbeddings } from "@langchain/openai";
import { formatDocumentsAsString } from "langchain/util/document";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";

export default defineEventHandler(async event => {
    const apiKey = useRuntimeConfig().AZURE_OPENAI_API_KEY
    const apiEndpoint = useRuntimeConfig().AZURE_OPENAI_INSTANCE
    const apiVersion = useRuntimeConfig().AZURE_OPENAI_VERSION
    

const embeddings = new OpenAIEmbeddings({
    azureOpenAIApiKey: apiKey, // In Node.js defaults to process.env.AZURE_OPENAI_API_KEY
    azureOpenAIApiVersion: apiVersion, // In Node.js defaults to process.env.AZURE_OPENAI_API_VERSION
    azureOpenAIApiInstanceName: apiEndpoint, // In Node.js defaults to process.env.AZURE_OPENAI_API_INSTANCE_NAME
    azureOpenAIApiDeploymentName: 'ada', // In Node.js defaults to process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME
});
    const { messages, modelDeployment, settings } = await readBody(event)

    if(configRuntime.database === "elasticsearch") {
        const clientArgs = {
            client: client,
            indexName: modelDeployment.source
        }
        const vectorStore = new ElasticVectorSearch(embeddings, clientArgs);
        const retriever = vectorStore.asRetriever()        
        const llm = new ChatOpenAI({
            temperature: 0,
            azureOpenAIApiKey: apiKey, // In Node.js defaults to process.env.AZURE_OPENAI_API_KEY
            azureOpenAIApiVersion: apiVersion, // In Node.js defaults to process.env.AZURE_OPENAI_API_VERSION
            azureOpenAIApiInstanceName: apiEndpoint, // In Node.js defaults to process.env.AZURE_OPENAI_API_INSTANCE_NAME
            azureOpenAIApiDeploymentName: 'gpt-3.5-fra',
           
            // In Node.js defaults to process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME
          })
      


        const declarativeRagChain = RunnableSequence.from([
            {
            context: retriever.pipe(formatDocumentsAsString),
            question: new RunnablePassthrough(),
            },
            prompt,
            llm,
            new StringOutputParser(),
        ]);
        
       
        /*
        * Can also initialize as:
        *
        * import { RunnableSequence } from "langchain/schema/runnable";
        * const chain = RunnableSequence.from([prompt, model, outputParser]);
        */
        
        
        // const stream = await chain.stream({
        //     chat_history: formattedPreviousMessages.join('\n'),
        //     input: currentMessageContent,
        // });   
        const stream = await declarativeRagChain.stream("What is task decomposition?");
        return new StreamingTextResponse(stream)
  // await ElasticVectorSearch.fromDocuments(docs, embeddings, clientArgs);
    }

})