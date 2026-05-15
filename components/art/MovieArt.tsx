interface ArtProps { palette: [string, string, string]; seed: string }

function Aurora({ palette: [c1, c2, c3], seed }: ArtProps) {
  return (
    <svg viewBox="0 0 400 533" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id={`bg-${seed}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={c3}/><stop offset="100%" stopColor="#06060c"/>
        </linearGradient>
        <linearGradient id={`au-${seed}`} x1="0" x2="0.6" y1="0" y2="1">
          <stop offset="0%" stopColor={c1} stopOpacity="0"/>
          <stop offset="50%" stopColor={c1} stopOpacity="0.7"/>
          <stop offset="100%" stopColor={c2} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <rect width="400" height="533" fill={`url(#bg-${seed})`}/>
      {[0,1,2,3].map(i=>(
        <path key={i} d={`M${-50+i*30} ${80+i*40} Q150 ${20+i*60} 250 ${100+i*40} T500 ${50+i*50}`}
          stroke={`url(#au-${seed})`} strokeWidth={60-i*8} fill="none" opacity={0.7-i*0.12}
          style={{ mixBlendMode: 'screen' }}/>
      ))}
      {[[60,140,1],[120,80,1.5],[280,180,1],[340,90,1.2],[200,260,0.8],[80,260,0.9]].map(([cx,cy,r],i)=>(
        <circle key={i} cx={cx} cy={cy} r={r} fill="#fff" opacity="0.85"/>
      ))}
      <path d="M0 460 L70 360 L130 410 L200 320 L280 400 L340 350 L400 410 L400 533 L0 533 Z" fill="#06060c"/>
      <path d="M0 480 L60 420 L140 460 L210 400 L290 450 L360 410 L400 440 L400 533 L0 533 Z" fill="#000" opacity="0.7"/>
    </svg>
  )
}

function Orbit({ palette: [c1, c2, c3], seed }: ArtProps) {
  return (
    <svg viewBox="0 0 400 533" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id={`bg-${seed}`} cx="60%" cy="35%" r="80%">
          <stop offset="0%" stopColor={c2}/><stop offset="60%" stopColor={c3}/><stop offset="100%" stopColor="#04040a"/>
        </radialGradient>
        <radialGradient id={`pl-${seed}`} cx="35%" cy="35%">
          <stop offset="0%" stopColor="#fff"/><stop offset="40%" stopColor={c1}/><stop offset="100%" stopColor={c3}/>
        </radialGradient>
      </defs>
      <rect width="400" height="533" fill={`url(#bg-${seed})`}/>
      <g transform="translate(220 260)">
        {[260,200,145,100].map((r,i)=>(
          <circle key={i} r={r} fill="none" stroke={c1}
            strokeWidth={i===2?1.5:0.8} strokeDasharray={i===0?'2 8':i===1?'4 6':i===3?'1 4':'0'} opacity={0.35}/>
        ))}
        <circle r="62" fill={`url(#pl-${seed})`}/>
        <circle r="62" fill="#000" opacity="0.15"/>
        <circle cx="-145" cy="0" r="4" fill={c1}/>
        <circle cx="0" cy="-200" r="5" fill="#fff"/>
        <circle cx="180" cy="80" r="3" fill={c1}/>
      </g>
      {[[40,80],[80,40],[330,120],[370,200],[60,420],[300,480]].map(([cx,cy],i)=>(
        <circle key={i} cx={cx} cy={cy} r={i%2?1.2:0.8} fill="#fff" opacity="0.7"/>
      ))}
    </svg>
  )
}

function Tideline({ palette: [c1, c2, c3], seed }: ArtProps) {
  return (
    <svg viewBox="0 0 400 533" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id={`bg-${seed}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={c1}/><stop offset="45%" stopColor={c2}/>
          <stop offset="55%" stopColor={c3}/><stop offset="100%" stopColor="#04040a"/>
        </linearGradient>
        <radialGradient id={`sun-${seed}`}>
          <stop offset="0%" stopColor="#fff"/><stop offset="50%" stopColor={c1}/><stop offset="100%" stopColor={c1} stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="400" height="533" fill={`url(#bg-${seed})`}/>
      <circle cx="200" cy="240" r="110" fill={`url(#sun-${seed})`} opacity="0.85"/>
      <circle cx="200" cy="240" r="58" fill={c1} opacity="0.9"/>
      {Array.from({length:14}).map((_,i)=>(
        <ellipse key={i} cx="200" cy={310+i*16} rx={180-i*4} ry={1.2}
          fill="none" stroke="#fff" strokeWidth="0.6" opacity={0.55-i*0.03}/>
      ))}
    </svg>
  )
}

function Roses({ palette: [c1, c2, c3], seed }: ArtProps) {
  return (
    <svg viewBox="0 0 400 533" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id={`bg-${seed}`} cx="50%" cy="40%" r="80%">
          <stop offset="0%" stopColor={c2}/><stop offset="100%" stopColor={c3}/>
        </radialGradient>
      </defs>
      <rect width="400" height="533" fill={`url(#bg-${seed})`}/>
      <g transform="translate(220 280)">
        {[0,1,2,3,4,5].map(i=>(
          <g key={i} transform={`rotate(${i*60})`}>
            <ellipse cx="0" cy="-50" rx="50" ry="80" fill={c1} opacity={0.25+i*0.04} style={{mixBlendMode:'screen'}}/>
          </g>
        ))}
        {[0,1,2,3,4,5].map(i=>(
          <g key={`b${i}`} transform={`rotate(${i*60+30})`}>
            <ellipse cx="0" cy="-30" rx="32" ry="55" fill="#fff" opacity="0.15"/>
          </g>
        ))}
        <circle r="22" fill="#fff" opacity="0.7"/>
      </g>
      {Array.from({length:18}).map((_,i)=>(
        <circle key={i} cx={(i*47)%400} cy={(i*61)%533} r="1.2" fill="#fff" opacity="0.5"/>
      ))}
    </svg>
  )
}

function Velour({ palette: [c1, c2, c3], seed }: ArtProps) {
  return (
    <svg viewBox="0 0 400 533" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id={`bg-${seed}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor={c1}/><stop offset="60%" stopColor={c2}/><stop offset="100%" stopColor={c3}/>
        </linearGradient>
      </defs>
      <rect width="400" height="533" fill={`url(#bg-${seed})`}/>
      {Array.from({length:9}).map((_,i)=>(
        <path key={i}
          d={`M${i*50-20} 0 Q${i*50+20} 200 ${i*50-10} 400 Q${i*50+30} 533 ${i*50+20} 533 L${i*50+50} 533 Q${i*50+30} 400 ${i*50+60} 200 Q${i*50+20} 0 ${i*50+30} 0 Z`}
          fill={i%2===0?'#000':'#fff'} opacity={i%2===0?0.18:0.08}/>
      ))}
      <ellipse cx="280" cy="160" rx="120" ry="200" fill="#fff" opacity="0.18"/>
    </svg>
  )
}

function Animal({ palette: [c1, c2], seed }: ArtProps) {
  return (
    <svg viewBox="0 0 400 533" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id={`bg-${seed}`} cx="50%" cy="55%">
          <stop offset="0%" stopColor={c2}/><stop offset="100%" stopColor="#04040a"/>
        </radialGradient>
      </defs>
      <rect width="400" height="533" fill={`url(#bg-${seed})`}/>
      <g transform="translate(200 320)" stroke={c1} strokeWidth="2.5" fill="none" opacity="0.95">
        <path d="M -80 30 Q -90 -20 -40 -30 L 40 -30 Q 90 -25 95 20 L 70 35 L 60 60 L 40 60 L 35 25 L -25 25 L -30 60 L -50 60 L -55 35 Z"/>
        <path d="M 95 -10 Q 130 -30 140 -60 Q 145 -75 130 -85 Q 115 -80 110 -65 Q 100 -50 95 -30"/>
        <path d="M 138 -75 L 145 -110 M 145 -110 L 135 -125 M 145 -110 L 155 -125 M 132 -82 L 120 -100"/>
      </g>
      <circle cx="200" cy="290" r="160" fill={c1} opacity="0.08" style={{ filter: 'blur(30px)' }}/>
    </svg>
  )
}

const ART: Record<string, React.FC<ArtProps>> = {
  aurora: Aurora, orbit: Orbit, tideline: Tideline,
  roses: Roses, velour: Velour, animal: Animal,
}

interface MovieArtProps { kind: string; palette: [string, string, string]; seed?: string }

export default function MovieArt({ kind, palette, seed }: MovieArtProps) {
  const Comp = ART[kind] ?? Aurora
  return <Comp palette={palette} seed={seed ?? kind}/>
}
