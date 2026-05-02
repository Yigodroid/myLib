import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const topicsPath = join(process.cwd(), 'topics.json')

export function readTopics(): string[] {
  try {
    const data = readFileSync(topicsPath, 'utf-8')
    const parsed = JSON.parse(data)
    return parsed.topics || []
  } catch (error) {
    console.error('Error leyendo topics.json:', error)
    return []
  }
}

export function writeTopics(topics: string[]) {
  try {
    // Eliminar duplicados y ordenar
    const uniqueTopics = [...new Set(topics)].sort()
    writeFileSync(topicsPath, JSON.stringify({ topics: uniqueTopics }, null, 2))
  } catch (error) {
    console.error('Error escribiendo topics.json:', error)
  }
}

export function addTopics(newTopics: string[]) {
  const existingTopics = readTopics()
  const allTopics = [...existingTopics, ...newTopics]
  writeTopics(allTopics)
}