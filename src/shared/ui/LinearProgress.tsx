export function LinearProgress() {
  return (
    <div aria-hidden="true" className="relative h-1 overflow-hidden rounded-sm bg-surface-highest">
      <div className="absolute inset-y-0 -left-2/5 w-2/5 animate-progress rounded-sm bg-primary motion-reduce:left-0 motion-reduce:animate-none" />
    </div>
  )
}
