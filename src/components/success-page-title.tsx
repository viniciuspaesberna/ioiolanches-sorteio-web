'use client'

import { useSearchParams } from 'next/navigation'

export const SuccessPageTitle = () => {
  const seachParams = useSearchParams()

  const name = seachParams.get('nome')

  return <h1 className="text-2xl">Parabéns {name}</h1>
}
