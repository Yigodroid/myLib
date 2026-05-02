'use client'

import { useState } from 'react'
import { useTopics } from '../lib/useTopics'
import StarRating from './StarRating'

interface FormCrearLibroProps {
  onLibroCreado: () => void
}

export default function FormCrearLibro({ onLibroCreado }: FormCrearLibroProps) {
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { topics, loading: loadingTopics, error: topicsError } = useTopics()
  const [rating, setRating] = useState(0)
  const [flag, setFlag] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setCargando(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    
    try {
      const response = await fetch('/api/libros', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo: formData.get('titulo'),
          autor: formData.get('autor'),
          autorId: parseInt(formData.get('autorId') as string) || 1,
          ISBN: formData.get('ISBN'),
          ISBN13: formData.get('ISBN13'),
          estado: formData.get('estado') || 'disponible',
          tematica1: formData.get('tematica1'),
          tematica2: formData.get('tematica2'),
          imageURL: formData.get('imageURL'),
          owner: formData.get('owner'),
          ubicacion: formData.get('ubicacion') || 'casa',
          formato: formData.get('formato') || 'fisico',
          leido: formData.get('leido') === 'on',
          prestadoA: formData.get('prestadoA') || '',
          rating: rating,
          flag: flag,
        }),
      })

      if (response.ok) {
        e.currentTarget.reset()
        onLibroCreado()
      } else {
        const data = await response.json()
        setError(data.error || 'Error al crear el libro')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setCargando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Fila 1: Título y Autor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
            Título del Libro *
          </label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: El Quijote"
          />
        </div>

        <div>
          <label htmlFor="autor" className="block text-sm font-medium text-gray-700 mb-1">
            Autor
          </label>
          <input
            type="text"
            id="autor"
            name="autor"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Miguel de Cervantes"
          />
        </div>
      </div>

      {/* Fila 2: ISBN e ISBN13 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="ISBN" className="block text-sm font-medium text-gray-700 mb-1">
            ISBN
          </label>
          <input
            type="text"
            id="ISBN"
            name="ISBN"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: 9788425406448"
          />
        </div>

        <div>
          <label htmlFor="ISBN13" className="block text-sm font-medium text-gray-700 mb-1">
            ISBN-13
          </label>
          <input
            type="text"
            id="ISBN13"
            name="ISBN13"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: 978-8425406448"
          />
        </div>
      </div>

      {/* Fila 3: Temáticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="tematica1" className="block text-sm font-medium text-gray-700 mb-1">
            Temática Principal
          </label>
          <select
            id="tematica1"
            name="tematica1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loadingTopics}
          >
            <option value="">Seleccionar temática...</option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
          {loadingTopics && <p className="text-sm text-gray-500 mt-1">Cargando temáticas...</p>}
          {topicsError && <p className="text-sm text-red-500 mt-1">{topicsError}</p>}
        </div>

        <div>
          <label htmlFor="tematica2" className="block text-sm font-medium text-gray-700 mb-1">
            Temática Secundaria
          </label>
          <select
            id="tematica2"
            name="tematica2"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loadingTopics}
          >
            <option value="">Seleccionar temática...</option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Fila 4: Estado y Propietario */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            id="estado"
            name="estado"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="disponible">Disponible</option>
            <option value="prestado">Prestado</option>
            <option value="en-lectura">En Lectura</option>
            <option value="leido">Leído</option>
          </select>
        </div>

        <div>
          <label htmlFor="owner" className="block text-sm font-medium text-gray-700 mb-1">
            Propietario
          </label>
          <input
            type="text"
            id="owner"
            name="owner"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Tu nombre"
          />
        </div>
      </div>

      {/* Fila 5: Ubicación y Formato */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700 mb-1">
            Ubicación
          </label>
          <select
            id="ubicacion"
            name="ubicacion"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="casa">Casa</option>
            <option value="kindle">Kindle</option>
            <option value="google-play-libros">Google Play Libros</option>
            <option value="no-comprado">No comprado</option>
            <option value="prestado">Prestado</option>
          </select>
        </div>

        <div>
          <label htmlFor="formato" className="block text-sm font-medium text-gray-700 mb-1">
            Formato
          </label>
          <select
            id="formato"
            name="formato"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="fisico">Físico</option>
            <option value="digital">Digital</option>
            <option value="audiolibro">Audiolibro</option>
          </select>
        </div>
      </div>

      {/* Fila 6: Leído y Prestado A */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="leido"
            name="leido"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="leido" className="ml-2 block text-sm text-gray-700">
            ¿Ya lo leíste?
          </label>
        </div>

        <div>
          <label htmlFor="prestadoA" className="block text-sm font-medium text-gray-700 mb-1">
            Prestado a
          </label>
          <input
            type="text"
            id="prestadoA"
            name="prestadoA"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Juan Pérez"
          />
        </div>
      </div>

      {/* URL de Imagen */}
      <div>
        <label htmlFor="imageURL" className="block text-sm font-medium text-gray-700 mb-1">
          URL de Imagen de Portada
        </label>
        <input
          type="url"
          id="imageURL"
          name="imageURL"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ej: https://covers.openlibrary.org/..."
        />
      </div>

      {/* Rating y Flag */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rating
          </label>
          <StarRating rating={rating} onRatingChange={setRating} />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="flag"
            checked={flag}
            onChange={(e) => setFlag(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="flag" className="ml-2 block text-sm text-gray-700">
            Marcar
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={cargando}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
      >
        {cargando ? 'Guardando...' : 'Guardar Libro'}
      </button>
    </form>
  )
}
