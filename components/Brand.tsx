import React from 'react'

interface Props {
  variant?: 'default' | 'nav'
}

export default function Brand({ variant = 'default' }: Props) {
  const cls = variant === 'nav' ? 'brand brand--nav' : 'brand'
  return (
    <div className={cls}>
      <svg className="brand-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="9" fill="url(#brandBg)"/>
        {/* S letterform — two bezier arcs */}
        <path
          d="M22 9C22 6.5 8 6.5 8 12C8 16 22 16 22 20C22 25.5 8 25.5 8 23"
          stroke="white"
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
        />
        <defs>
          <linearGradient id="brandBg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#a78bfa"/>
            <stop offset="100%" stopColor="#6d28d9"/>
          </linearGradient>
        </defs>
      </svg>
      <span className="brand-word">
        Soar<span className="brand-tv">TV</span>
      </span>
    </div>
  )
}
