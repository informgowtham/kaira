import { useState } from 'react'
import { Check, Crown } from 'lucide-react'
import { TopBar } from '../components/TopBar'
import { Surface } from '../components/Surface'
import { Button } from '../components/Button'
import { useAppStore } from '../store/useAppStore'
import { useSEO } from '../utils/seo'

export function PricingPage() {
  useSEO('Pricing')
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly')
  const plan = useAppStore((s) => s.plan)
  const setPlan = useAppStore((s) => s.setPlan)

  return (
    <div className="min-h-screen kb-grid">
      <TopBar compact />
      <div className="mx-auto w-full max-w-6xl px-4 pt-10 pb-12">
        <div className="max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">Simple pricing for meaningful celebrations</h1>
          <p className="mt-2 text-sm sm:text-base text-white/70">
            This is a UI-only preview of the monetization gateway. You can switch plans to test premium experiences.
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
              {['5 boards per year', '20 messages per board', 'Watermark', 'No scheduled delivery', 'No memory download', 'Standard reveal'].map((item) => (
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
            <div className="mt-1 text-sm text-white/60">Premium reveal, themes, scheduling, and downloads</div>
            <div className="mt-5 grid gap-3 text-sm text-white/75">
              {['Unlimited boards', 'Unlimited messages', 'Scheduled delivery', 'Download as memory', 'No watermark', 'Premium cinematic reveal', 'Premium themes'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Check size={16} className="text-amber-200" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <Button className="mt-6 w-full" variant={plan === 'pro' ? 'secondary' : 'primary'} onClick={() => setPlan('pro')}>
              {plan === 'pro' ? 'Current plan' : 'Switch to Pro'}
            </Button>
          </Surface>
        </div>
      </div>
    </div>
  )
}
