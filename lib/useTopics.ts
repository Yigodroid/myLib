'use client'

import { useState, useEffect } from 'react'

export function useTopics() {
  const [topics, setTopics] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch('/api/topics')
        if (response.ok) {
          const data = await response.json()
          setTopics(data.topics)
        } else {
          setError('Error al cargar temáticas')
        }
      } catch (err) {
        setError('Error de conexión')
      } finally {
        setLoading(false)
      }
    }

    fetchTopics()
  }, [])

  return { topics, loading, error }
}