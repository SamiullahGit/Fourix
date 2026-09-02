'use client'

import dynamic from 'next/dynamic'

const FourixAgent = dynamic(() => import('./fourix-agent'), { ssr: false })

export default function FourixAgentLoader() {
  return <FourixAgent />
}
