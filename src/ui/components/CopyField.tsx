import { Check, Copy } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from './Button'

export function CopyField(props: { label: string; value: string }) {
  const { label, value } = props
  const [copied, setCopied] = useState(false)
  const canCopy = useMemo(() => Boolean(value.trim()), [value])

  return (
    <div className="kb-glass rounded-xl border border-white/10 p-3">
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-1 flex items-center gap-2">
        <input
          className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-sm text-white kb-ring"
          value={value}
          readOnly
        />
        <Button
          variant="secondary"
          left={copied ? <Check size={16} /> : <Copy size={16} />}
          disabled={!canCopy}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(value)
              setCopied(true)
              window.setTimeout(() => setCopied(false), 1200)
            } catch {
              // ignore
            }
          }}
          aria-label="Copy to clipboard"
        >
          <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
        </Button>
      </div>
    </div>
  )
}
