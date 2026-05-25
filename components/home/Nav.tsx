'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Icon from '@/components/Icon'
import Brand from '@/components/Brand'
import InstallPWA from '@/components/InstallPWA'
import { useAuth } from '@/context/AuthContext'

interface Props { onRetake?: () => void }

const NAV_LINKS = [
  { label: 'Watch Now', href: '/' },
  { label: 'Movies',    href: '/movies' },
  { label: 'TV Shows',  href: '/shows' },
  { label: 'Library',   href: '/library' },
]

export default function Nav({ onRetake }: Props) {
  const { user } = useAuth()
  const pathname = usePathname()

  // Surface a 1px bottom line once the user has scrolled past the gradient
  // fade. Without this, long pages lose the visual separator between the nav
  // and the content underneath when the gradient stops being effective.
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <nav className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <div className="nav-brand"><Brand variant="nav"/></div>
      <div className="nav-links">
        {NAV_LINKS.map(({ label, href }) => (
          <Link key={href} href={href} className={isActive(href) ? 'active' : ''}>
            {label}
          </Link>
        ))}
      </div>
      <div className="nav-right">
        {onRetake && (
          <button className="retake-pill" onClick={onRetake}>
            <Icon name="refresh" size={12}/><span className="retake-label"> Retake mood</span>
          </button>
        )}
        <InstallPWA variant="pill" />
        <Link href="/search" className="icon-btn" style={{ display: 'grid', placeItems: 'center' }} aria-label="Search">
          <Icon name="search" size={15}/>
        </Link>
        <Link href="/profile" className="icon-btn" style={{ display: 'grid', placeItems: 'center' }}>
          {user?.photoURL
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={user.photoURL} alt="" style={{ width: 22, height: 22, borderRadius: '50%' }} />
            : <Icon name="user" size={15}/>
          }
        </Link>
      </div>
    </nav>
  )
}
