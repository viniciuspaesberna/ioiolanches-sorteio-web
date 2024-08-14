import { RedeemCodeForm } from '@/components/redeem-code-form'

export default function Home() {
  return (
    <main className="my-auto flex flex-col items-center justify-center space-y-8">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-center text-2xl font-bold">Resgate seu cupom</h1>

        <p className="max-w-[300px] text-center text-zinc-300">
          Concorra a varíos prêmios em nossos sorteios semanais.
        </p>
      </div>

      <RedeemCodeForm />
    </main>
  )
}
