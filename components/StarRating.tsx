'use client'

import { useState } from 'react'

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function StarRating({ rating, onRatingChange, readonly = false, size = 'md' }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const handleClick = (starValue: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starValue)
    }
  }

  const handleMouseEnter = (starValue: number) => {
    if (!readonly) {
      setHoverRating(starValue)
    }
  }

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0)
    }
  }

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = hoverRating > 0 ? star <= hoverRating : star <= rating
        return (
          <button
            key={star}
            type="button"
            className={`${sizeClasses[size]} ${readonly ? 'cursor-default' : 'cursor-pointer'} focus:outline-none`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
          >
            <svg
              className={`${
                isActive ? 'text-yellow-400 fill-current' : 'text-gray-300'
              } transition-colors duration-150`}
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        )
      })}
      {!readonly && (
        <span className="ml-2 text-sm text-gray-600">
          {hoverRating > 0 ? hoverRating : rating}/5
        </span>
      )}
    </div>
  )
}