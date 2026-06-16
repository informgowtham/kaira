import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Crown } from 'lucide-react'
import { TopBar } from '../components/TopBar'
import { Surface } from '../components/Surface'
import { Button } from '../components/Button'
import { useAppStore } from '../store/useAppStore'
import { createRazorpayOrder, getPublicConfigStatus, type PublicConfigStatus } from '../store/api'
import { useSEO } from '../utils/seo'

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => { open: () => void }
  }
}

type RazorpayCheckoutOptions = {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  prefill?: {
    name?: string
    email?: string
  }
  theme?: {
    color?: string
  }
  handler: (response: {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
  }) => void
  modal?: {
    ondismiss?: () => void
  }
}

let razorpayScriptPromise: Promise<void> | null = null

function loadRazorpayCheckout() {
  if (window.Razorpay) return Promise.resolve()
  if (razorpayScriptPromise) return razorpayScriptPromise

  razorpayScriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Unable to load Razorpay Checkout'))
    document.body.appendChild(script)
  })
  return razorpayScriptPromise
}

export function PricingPage() {
  useSEO('Pricing')
  const navigate = useNavigate()
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly')
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [configStatus, setConfigStatus] = useState<PublicConfigStatus | null>(null)
  const plan = useAppStore((s) => s.plan)
  const user = useAppStore((s) => s.user)
  const loading = useAppStore((s) => s.loading)
  const setPlan = useAppStore((s) => s.setPlan)
  const completeRazorpayUpgrade = useAppStore((s) => s.completeRazorpayUpgrade)

  useEffect(() => {
    let cancelled = false
    void getPublicConfigStatus()
      .then((status) => {
        if (!cancelled) setConfigStatus(status)
      })
      .catch(() => {
        if (!cancelled) setConfigStatus(null)
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function startRazorpayUpgrade() {
    setPaymentError(null)
    if (configStatus && !configStatus.paymentsConfigured) {
      setPaymentError('Payments are not configured in this environment yet.')
      return
    }
    if (!user) {
      navigate('/auth', { state: { from: '/pricing' } })
      return
    }
    try {
      const [{ keyId, order }] = await Promise.all([
        createRazorpayOrder({ billing }),
        loadRazorpayCheckout(),
      ])

      if (!window.Razorpay) {
        throw new Error('Razorpay Checkout did not load')
      }

      const checkout = new window.Razorpay({
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'KairaBoard',
        description: `KairaBoard Pro ${billing === 'monthly' ? 'Monthly' : 'Yearly'}`,
        order_id: order.id,
        prefill: {
          name: user?.displayName,
          email: user?.email,
        },
        theme: {
          color: '#f2c94c',
        },
        handler: async (response) => {
          try {
            await completeRazorpayUpgrade({
              billing,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })
          } catch (error) {
            setPaymentError(error instanceof Error ? error.message : 'Payment verification failed')
          }
        },
        modal: {
          ondismiss: () => setPaymentError(null),
        },
      })
      checkout.open()
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : 'Unable to start Razorpay checkout')
    }
  }

  return (
    <div className="min-h-screen kb-grid">
      <TopBar compact />
      <div className="mx-auto w-full max-w-6xl px-4 pt-10 pb-12">
        <div className="max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">Celebrate without limits.</h1>
          <p className="mt-2 text-sm sm:text-base text-white/70">
            Whether it's a single milestone or a lifetime of memories, choose the plan that fits your joy.
          </p>
        </div>

        <div className="mt-6 inline-flex rounded-full border border-white/10 bg-black/20 p-1">
          <button
            className={`kb-ring rounded-full px-4 py-2 text-sm transition ${billing === 'monthly' ? 'bg-white text-black' : 'text-white/75'}`}
            onClick={() => setBilling('monthly')}
          >
            Monthly
          </button>
          <button
            className={`kb-ring rounded-full px-4 py-2 text-sm transition ${billing === 'yearly' ? 'bg-white text-black' : 'text-white/75'}`}
            onClick={() => setBilling('yearly')}
          >
            Yearly
          </button>
        </div>
        {billing === 'yearly' ? <div className="mt-2 text-sm text-emerald-300/90">Save 20%</div> : null}

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Surface className="p-6">
            <div className="text-sm font-semibold text-white">Free</div>
            <div className="mt-2 text-4xl font-semibold text-white">$0</div>
            <div className="mt-1 text-sm text-white/60">For simple celebration boards</div>
            <div className="mt-5 grid gap-3 text-sm text-white/75">
              {['5 boards per year', '20 messages per board', 'Watermark', 'Scheduled delivery', 'Download as memory', 'Cinematic reveal'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Check size={16} className="text-white/75" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <Button className="mt-6 w-full" variant={plan === 'free' ? 'secondary' : 'primary'} onClick={() => setPlan('free')}>
              {plan === 'free' ? 'Current plan' : 'Use Free'}
            </Button>
          </Surface>

          <Surface className="p-6 border border-amber-200/20 relative overflow-hidden">
            <div className="absolute right-4 top-4 rounded-full bg-amber-300/90 px-3 py-1 text-xs font-semibold text-black">Most Popular</div>
            <div className="text-sm font-semibold text-white flex items-center gap-2">
              <Crown size={16} className="text-amber-200" />
              Pro
            </div>
            <div className="mt-2 text-4xl font-semibold text-white">
              {billing === 'monthly' ? '$19' : '$182'}
              <span className="ml-2 text-base font-normal text-white/55">{billing === 'monthly' ? '/month' : '/year'}</span>
            </div>
            <div className="mt-1 text-sm text-white/60">Immersive reveals, exclusive themes, scheduling, and keepsakes</div>
            <div className="mt-5 grid gap-3 text-sm text-white/75">
              {['Unlimited boards', 'Unlimited messages', 'Scheduled delivery', 'Download as memory', 'No watermark', 'Immersive, cinematic reveal', 'Premium exclusive themes'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Check size={16} className="text-amber-200" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <Button
              className="mt-6 w-full"
              variant={plan === 'pro' ? 'secondary' : 'primary'}
              disabled={plan === 'pro' || loading || (configStatus ? !configStatus.paymentsConfigured : false)}
              onClick={() => void startRazorpayUpgrade()}
            >
              {plan === 'pro' ? 'Current plan' : loading ? 'Preparing checkout...' : 'Upgrade with Razorpay'}
            </Button>
            {configStatus && !configStatus.paymentsConfigured ? (
              <div className="mt-3 rounded-lg border border-amber-300/25 bg-amber-500/15 px-3 py-2 text-sm text-amber-100">
                Razorpay checkout is not configured yet for this environment.
              </div>
            ) : null}
            {paymentError ? (
              <div className="mt-3 rounded-lg border border-rose-300/25 bg-rose-500/15 px-3 py-2 text-sm text-rose-100">
                {paymentError}
              </div>
            ) : null}
          </Surface>
        </div>
      </div>
    </div>
  )
}
