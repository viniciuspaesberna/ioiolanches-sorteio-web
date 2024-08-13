import Image from 'next/image'

import logo from '@/assets/ioio-logo.png'

export const Header = () => {
  return (
    <header className="flex items-center justify-center py-4">
      <div className="container flex items-center justify-center">
        <Image src={logo} alt="Presentes" className="w-[280px]" />
      </div>
    </header>
  )
}
