import { cn } from '@/lib/utils'

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <span
      className={cn('block animate-pulse rounded-md bg-primary/5', className)}
      {...props}
    />
  )
}