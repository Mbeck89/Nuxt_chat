// def _combine_documents(docs, document_prompt, document_separator="\n\n"):

// doc_strings = [format_document(doc, document_prompt) for doc in docs]

// return document_separator.join(doc_strings)

// def create_chain(self, model):

// print(model)

// vector_store = self.database.db_instance(model, model)

// # vector_store = ElasticsearchStore(

// #     index_name=index_name,

// #     es_connection=self.es_connection,

// #     embedding=self.embeddings

// # )

// #vectorstore.similarity_search(query)

// retriever = vector_store.as_retriever()

// answer_prompt = ChatPromptTemplate.from_template(

//     """

//     You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. Be as verbose and educational in your response as possible.

//     Each passage has a SOURCE which is the title of the document. When answering, cite source name of the passages you are answering from below the answer, on a new line, with a prefix of "SOURCE:".

//     context: {context}

//     Question: "{question}"

//     Answer:

//     """

// )

// DOCUMENT_PROMPT = PromptTemplate.from_template("""

// ---

// SOURCE: {name}

// {page_content}

// ---

// """)

// _context = {

// "context":  retriever | self._combine_documents,

// "question": RunnablePassthrough(),

// }

// chain = (

//     {"context": retriever, "question": RunnablePassthrough()}

//     | answer_prompt

//     | self.chat.get_gpt_model("GPT-35-turbo-fra")

//     | StrOutputParser()

// )

// # chain = (

// #     {"context": retriever, "question": RunnablePassthrough()}

// #     | answer_prompt

// #     | self.database.getModel("GPT-35-turbo-fra")

// #     | StrOutputParser()

// # )

// return chain
import { PromptTemplate } from 'langchain/prompts'

import { client } from '~/server/databases/elasticsearch'
import { StreamingTextResponse } from 'ai'
import { OpenAIEmbeddings, ChatOpenAI } from '@langchain/openai'
import { formatDocumentsAsString } from 'langchain/util/document'
import {
  RunnableSequence,
  RunnablePassthrough
} from '@langchain/core/runnables'
import {
  ElasticClientArgs,
  ElasticVectorSearch
} from '@langchain/community/vectorstores/elasticsearch'
import { StringOutputParser } from 'langchain/schema/output_parser'

export default defineEventHandler(async event => {
  const apiKey = useRuntimeConfig().AZURE_OPENAI_API_KEY
  const apiEndpoint = useRuntimeConfig().AZURE_OPENAI_INSTANCE
  const apiVersion = useRuntimeConfig().AZURE_OPENAI_VERSION
  const embeddings = new OpenAIEmbeddings({
    azureOpenAIApiKey: apiKey, // In Node.js defaults to process.env.AZURE_OPENAI_API_KEY
    azureOpenAIApiVersion: apiVersion, // In Node.js defaults to process.env.AZURE_OPENAI_API_VERSION
    azureOpenAIApiInstanceName: apiEndpoint, // In Node.js defaults to process.env.AZURE_OPENAI_API_INSTANCE_NAME
    azureOpenAIApiDeploymentName: 'embedding' // In Node.js defaults to process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME
  })
  const { messages, modelDeployment, settings } = await readBody(event)

  if (useRuntimeConfig().database === 'elasticsearch') {
    const clientArgs = {
      client: client,
      indexName: modelDeployment.name
    }
    const vectorStore = new ElasticVectorSearch(embeddings, clientArgs)
    const currentMessageContent = messages[messages.length - 1].content
    console.log(currentMessageContent)

    const retriever = vectorStore.asRetriever()
    const llm = new ChatOpenAI({
      temperature: 0,
      azureOpenAIApiKey: apiKey, // In Node.js defaults to process.env.AZURE_OPENAI_API_KEY
      azureOpenAIApiVersion: apiVersion, // In Node.js defaults to process.env.AZURE_OPENAI_API_VERSION
      azureOpenAIApiInstanceName: apiEndpoint, // In Node.js defaults to process.env.AZURE_OPENAI_API_INSTANCE_NAME
      azureOpenAIApiDeploymentName: 'gpt-35-turbo-fra' // In Node.js defaults to process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME
    })

    const prompt =
      PromptTemplate.fromTemplate(`Answer the question based only on the following context:
    {context}

    Question: {question}`)

    const declarativeRagChain = RunnableSequence.from([
      {
        context: retriever.pipe(formatDocumentsAsString),
        question: new RunnablePassthrough()
      },
      prompt,
      llm,
      new StringOutputParser()
    ]) /*

        * Can also initialize as:

        *

        * import { RunnableSequence } from "langchain/schema/runnable";

        * const chain = RunnableSequence.from([prompt, model, outputParser]);

        */ // const stream = await chain.stream({ //     chat_history: formattedPreviousMessages.join('\n'), //     input: currentMessageContent, // });

    const stream = await declarativeRagChain.stream(currentMessageContent)
    return new StreamingTextResponse(stream)
  }
})
