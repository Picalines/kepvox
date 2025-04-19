import * as RadixSlider from '@radix-ui/react-slider'
import { assertedAt } from '@repo/common/assert'
import { type FC, type ReactNode, useCallback, useRef } from 'react'
import { cn } from '#lib/classnames'
import { createSlot, useSlots } from '#lib/slots'

export type RootProps = {
  className?: string
  name?: string
  value?: number
  defaultValue?: number
  min: number
  max: number
  step?: number
  disabled?: boolean
  required?: boolean
  onValueChange?: (value: number) => void
  children: ReactNode
}

export type LabelProps = { children: ReactNode }

export const Label = createSlot({ name: 'Label' }).component<LabelProps>()

export const Root: FC<RootProps> = props => {
  const { className, children, value, defaultValue, onValueChange: onValueChangeProp, ...sliderProps } = props

  const { label } = useSlots(children, { label: Label })

  const sliderValueRef = useRef<HTMLSpanElement>(null)

  const updateSliderValue = useCallback((value: number) => {
    const sliderValue = sliderValueRef.current
    if (sliderValue) {
      sliderValue.innerText = String(value)
    }
  }, [])

  const onValueChange = useCallback(
    (radixValues: number[]) => {
      const sliderValue = assertedAt(radixValues, 0)
      updateSliderValue(sliderValue)
      onValueChangeProp?.(sliderValue)
    },
    [updateSliderValue, onValueChangeProp],
  )

  return (
    <div className={cn('relative', className)}>
      <RadixSlider.Root
        {...sliderProps}
        value={value !== undefined ? [value] : undefined}
        defaultValue={defaultValue !== undefined ? [defaultValue] : undefined}
        onValueChange={onValueChange}
        className="group peer relative flex h-10 w-full cursor-ew-resize touch-none select-none items-center overflow-clip rounded-md border border-border ring-offset-background transition-all focus-within:ring-2 focus-within:ring-offset-2 data-disabled:cursor-not-allowed"
      >
        <RadixSlider.Track className="relative h-full grow bg-background">
          <RadixSlider.Range className="absolute h-full bg-accent transition-colors group-hover:bg-accent/90 group-data-disabled:opacity-75" />
        </RadixSlider.Track>
        <RadixSlider.Thumb aria-label={label?.children ? String(label.children) : undefined} />
      </RadixSlider.Root>
      {label?.children && (
        <span className="-translate-y-1/2 peer-focus-within:-top-1 pointer-events-none absolute top-0 left-3 origin-left translate-x-[-2px] rounded-xs border-[2px] border-background bg-background text-muted-foreground text-xs leading-none transition-all peer-focus-within:text-ring peer-data-disabled:text-muted-foreground/50">
          {label.children}
        </span>
      )}
      <span
        aria-hidden
        className={cn(
          '-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 text-accent-foreground text-sm peer-data-disabled:text-accent-foreground/50',
        )}
        ref={sliderValueRef}
      >
        {sliderValueRef.current?.innerText ?? defaultValue ?? value}
      </span>
    </div>
  )
}
