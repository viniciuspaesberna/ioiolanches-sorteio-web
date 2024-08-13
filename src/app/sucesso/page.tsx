import Image from 'next/image'
import { Suspense } from 'react'
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa6'

import bg from '@/assets/presents.svg'
import { SuccessPageTitle } from '@/components/success-page-title'
import { Button } from '@/components/ui/button'

const SuccessPage = () => {
  return (
    <main className="flex flex-1 flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Boa sorte!</h1>

      <Image src={bg} alt="" className="max-w-[360px]" />

      <Suspense fallback={null}>
        <SuccessPageTitle />
      </Suspense>

      <p className="text-md text-zinc-400">
        Seu cupom foi resgatado com sucesso
      </p>

      <p className="mt-12 max-w-[360px] text-center text-zinc-300">
        Fique ligado em nossas redes sociais para acompanhar o sorteio!
      </p>

      <div className="mt-2 flex gap-4">
        <Button size="icon" variant="outline">
          <FaInstagram size={24} />
        </Button>
        <Button size="icon" variant="outline">
          <FaWhatsapp size={24} />
        </Button>
        <Button size="icon" variant="outline">
          <FaFacebook size={24} />
        </Button>
      </div>
    </main>
  )
}

export default SuccessPage
