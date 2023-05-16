import { PineconeClient } from '@pinecone-database/pinecone'
import { PineconeStore } from 'langchain/vectorstores/pinecone'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import 'dotenv/config'
import options from './agent.js'

const embeddings = new OpenAIEmbeddings(
  {},
  {
    baseOptions: options,
  }
)

const pinecone = new PineconeClient()

await pinecone.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
})

const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX)

const init_db = async (data) => {
  const { docs, textKey, namespace } = data

  try {
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex,
      textKey,
      namespace,
    })
  } catch (error) {
    console.log(error)
  }

  console.log('finish init')
}

const fetch_db = async (data) => {
  const { textKey, namespace } = data

  try {
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
      textKey,
      namespace,
    })
    return vectorStore
  } catch (error) {
    console.log(error)
  }
}

export { init_db, fetch_db }