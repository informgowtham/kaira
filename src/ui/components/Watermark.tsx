export function Watermark() {
  return (
    <div className="pointer-events-none select-none fixed bottom-3 left-0 right-0 z-30 flex justify-center px-3">
      <div className="kb-glass rounded-full px-3 py-1 text-[11px] text-white/70 border border-white/10">
        Made with KairaBoard
      </div>
    </div>
  )
}
