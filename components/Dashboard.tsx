'use client'

interface Libro {
  id: number
  titulo: string
  autor: string
  ISBN: string
  ISBN13: string
  estado: string
  tematica1: string
  tematica2: string
  imageURL: string
  owner: string
  ubicacion: string
  formato: string
  leido: boolean
  prestadoA: string
  rating: number
  flag: boolean
}

interface DashboardProps {
  libros: Libro[]
  onFiltrar: (filtro: string | null) => void
  onLimpiarFlags: () => void
}

export default function Dashboard({ libros, onFiltrar, onLimpiarFlags }: DashboardProps) {
  // Calcular estadísticas
  const totalLibros = libros.length
  const librosConFlag = libros.filter(libro => libro.flag).length
  const librosLeidos = libros.filter(libro => libro.leido).length
  const librosNoLeidos = totalLibros - librosLeidos

  // Contar libros por temática
  const tematicasCount: Record<string, number> = {}
  libros.forEach(libro => {
    if (libro.tematica1) {
      tematicasCount[libro.tematica1] = (tematicasCount[libro.tematica1] || 0) + 1
    }
    if (libro.tematica2) {
      tematicasCount[libro.tematica2] = (tematicasCount[libro.tematica2] || 0) + 1
    }
  })

  const tematicasOrdenadas = Object.entries(tematicasCount).sort((a, b) => b[1] - a[1])

  // Colores para las temáticas
  const coloresTematicas = [
    'bg-purple-100 text-purple-800 border-purple-200',
    'bg-pink-100 text-pink-800 border-pink-200',
    'bg-indigo-100 text-indigo-800 border-indigo-200',
    'bg-green-100 text-green-800 border-green-200',
    'bg-yellow-100 text-yellow-800 border-yellow-200',
    'bg-red-100 text-red-800 border-red-200',
    'bg-blue-100 text-blue-800 border-blue-200',
    'bg-gray-100 text-gray-800 border-gray-200',
  ]

  return (
    <section className="bg-white rounded-lg p-6 border border-gray-200 shadow-md">
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">📊 Dashboard de Biblioteca</h2>
          <p className="text-gray-600">Resumen rápido de tu colección.</p>
        </div>
        <button
          onClick={onLimpiarFlags}
          className="rounded-lg border border-red-300 bg-red-50 text-red-700 px-4 py-2 text-sm font-medium hover:bg-red-100 transition"
        >
          Limpiar marcas
        </button>
      </div>

      {/* Total de libros y métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <div
          onClick={() => onFiltrar(null)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 cursor-pointer hover:shadow-lg transition duration-200 transform hover:scale-105"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Total de Libros</h3>
              <p className="text-3xl font-bold">{totalLibros}</p>
            </div>
            <div className="text-4xl">📚</div>
          </div>
        </div>
        <div
          onClick={() => onFiltrar('FILTER_FLAG')}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg p-6 cursor-pointer hover:shadow-lg transition duration-200 transform hover:scale-105"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Marcados</h3>
              <p className="text-3xl font-bold">{librosConFlag}</p>
            </div>
            <div className="text-4xl">⭐</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Leídos</h3>
              <p className="text-3xl font-bold">{librosLeidos}</p>
            </div>
            <div className="text-4xl">📘</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-gray-500 to-slate-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">No Leídos</h3>
              <p className="text-3xl font-bold">{librosNoLeidos}</p>
            </div>
            <div className="text-4xl">📕</div>
          </div>
        </div>
      </div>

      {/* Temáticas */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📂 Libros por Temática</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tematicasOrdenadas.map(([tematica, count], index) => (
            <div
              key={tematica}
              onClick={() => onFiltrar(tematica)}
              className={`rounded-lg p-4 cursor-pointer hover:shadow-lg transition duration-200 transform hover:scale-105 border-2 ${coloresTematicas[index % coloresTematicas.length]}`}
            >
              <div className="text-center">
                <p className="text-sm font-medium mb-1">{tematica}</p>
                <p className="text-2xl font-bold">{count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}