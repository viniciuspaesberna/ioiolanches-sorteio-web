'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { REGEXP_ONLY_CHARS } from 'input-otp'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { api } from '@/lib/axios'

import { Button } from './ui/button'
import { toast } from './ui/use-toast'

const redeemCodeFormSchema = z.object({
  name: z
    .string({ required_error: 'Nome é obrigatório' })
    .min(3, 'O mínimo de characters é 3'),
  phone: z
    .string({ required_error: 'Número de celular é obrigatório' })
    .min(11, 'Número de celular inválido'),
  code: z
    .string({ required_error: 'Código do cupom é obrigatório' })
    .min(6, 'Código deve ter 6 caracteres')
    .max(6, 'Código deve ter 6 caracteres')
    .toUpperCase(),
})

type RedeemCodeFormData = z.infer<typeof redeemCodeFormSchema>

export const RedeemCodeForm = () => {
  const form = useForm<RedeemCodeFormData>({
    resolver: zodResolver(redeemCodeFormSchema),
    defaultValues: {
      phone: '',
    },
  })

  const [isLoading, setIsLoading] = useState(false)
  const [rawPhoneValue, setRawPhoneValue] = useState('')
  const router = useRouter()

  const formatPhoneNumberForDisplay = (inputValue: string) => {
    let formattedPhoneNumber = inputValue

    if (inputValue.length > 0) {
      formattedPhoneNumber = `(${inputValue.substring(0, 2)})`
    }
    if (inputValue.length > 2) {
      formattedPhoneNumber += ` ${inputValue.substring(2, 7)}`
    }
    if (inputValue.length > 7) {
      formattedPhoneNumber += `-${inputValue.substring(7, 11)}`
    }

    return formattedPhoneNumber
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEvent = e.nativeEvent as InputEvent
    const cursorPosition = e.target.selectionStart
    const isDeleting = inputEvent.inputType === 'deleteContentBackward'
    const rawValue = e.target.value.replace(/\D/g, '') // Only numbers

    if (isDeleting && cursorPosition && cursorPosition <= 4) {
      // Deleting within the area that includes parentheses
      setRawPhoneValue(rawValue.slice(0, -1))
      form.setValue('phone', rawValue.slice(0, -1))
    } else {
      setRawPhoneValue(rawValue)
      form.setValue('phone', rawValue)
    }
  }

  async function onSubmit(data: RedeemCodeFormData) {
    const { name, phone, code } = data

    setIsLoading(true)

    await api
      .put('/coupons/redeem', {
        code,
        clientName: name,
        clientPhone: phone.length === 12 ? phone.slice(0, -1) : phone,
      })
      .then(() => {
        router.push(`/success?nome=${name}`)
        // toast({
        //   title: 'Cupom resgatado com sucesso!',
        //   description: 'Boa sorte!',
        // })
      })
      .catch((err) => {
        console.log(err.response.data)
        if (err.response.data.message === 'Coupon not found') {
          toast({
            variant: 'destructive',
            title: 'Erro ao resgatar',
            description: 'Código inválido ou cupom já foi utilizado.',
          })
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-[320] space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <div className="flex w-full justify-between">
                <FormLabel className="text-zinc-50">
                  Seu nome completo
                </FormLabel>
                <FormMessage className="text-xs text-rose-500" />
              </div>
              <FormControl>
                <Input placeholder="Digite seu nome" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <div className="flex w-full justify-between">
                <FormLabel className="text-zinc-50">
                  Seu número de celular
                </FormLabel>
                <FormMessage className="text-xs text-rose-500" />
              </div>
              <FormControl>
                <Input
                  inputMode="tel"
                  placeholder="(00) 00000-0000"
                  {...field}
                  value={formatPhoneNumberForDisplay(rawPhoneValue)}
                  onChange={(e) => {
                    handlePhoneChange(e)
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <div className="">
              <div className="flex w-full justify-between">
                <FormLabel className="text-zinc-50">
                  Código do seu cupom
                </FormLabel>
                <FormMessage className="text-xs text-rose-500" />
              </div>

              <FormItem className="flex justify-between gap-2">
                <FormControl>
                  <InputOTP
                    inputMode="text"
                    autoCapitalize="characters"
                    spellCheck={false}
                    pattern={REGEXP_ONLY_CHARS}
                    maxLength={6}
                    {...field}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot className="uppercase" index={0} />
                      <InputOTPSlot className="uppercase" index={1} />
                      <InputOTPSlot className="uppercase" index={2} />
                      <InputOTPSlot className="uppercase" index={3} />
                      <InputOTPSlot className="uppercase" index={4} />
                      <InputOTPSlot className="uppercase" index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>

                <Button disabled={isLoading} className="w-full" type="submit">
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Regastar'
                  )}
                </Button>
              </FormItem>
            </div>
          )}
        />
      </form>
    </Form>
  )
}
