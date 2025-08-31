import { describe, expect, it, vi } from 'vitest'
import { Time } from '#time'
import { EventTimeline } from './event-timeline'

type TestEvent = { time: Time; id: number | string }

describe('EventTimeline', () => {
  describe('mergeEvent', () => {
    it('should add event when timeline is empty', () => {
      const timeline = new EventTimeline<TestEvent>()

      timeline.mergeEvent({ time: Time.n2, id: 1 })

      expect(timeline.eventAt(Time.n2)).toMatchObject({ id: 1 })
    })

    it('should merge with existing event at same time', () => {
      const timeline = new EventTimeline<TestEvent>()

      timeline.mergeEvent({ time: Time.n2, id: 'old' })
      timeline.mergeEvent({ time: Time.n2, id: 'new' })

      expect(timeline.eventAt(Time.n2)).toMatchObject({ id: 'new' })
    })

    it('should insert event in correct chronological order', () => {
      const timeline = new EventTimeline<TestEvent>()

      timeline.mergeEvent({ time: Time.n1, id: 3 })
      timeline.mergeEvent({ time: Time.n2, id: 2 })
      timeline.mergeEvent({ time: Time.start, id: 1 })

      const events = Array.from(timeline.eventsAfterOrAt(Time.start))

      expect(events).toMatchObject([{ id: 1 }, { id: 2 }, { id: 3 }])
    })

    it('should emit changed signal when event is merged', () => {
      const timeline = new EventTimeline<TestEvent>()
      const callback = vi.fn()

      timeline.changed.watch(callback)
      timeline.mergeEvent({ time: Time.n2, id: 1 })

      expect(callback).toHaveBeenCalledWith({ time: Time.n2, id: 1 })
    })
  })

  describe('eventAt', () => {
    it('should find event at specific time', () => {
      const timeline = new EventTimeline<TestEvent>()

      timeline.mergeEvent({ time: Time.n1, id: 1 })

      expect(timeline.eventAt(Time.n1)).toMatchObject({ id: 1 })
    })

    it('should return null when time is between events', () => {
      const timeline = new EventTimeline<TestEvent>()

      timeline.mergeEvent({ time: Time.start, id: 1 })
      timeline.mergeEvent({ time: Time.n1, id: 2 })

      expect(timeline.eventAt(Time.n2)).toBeNull()
    })
  })

  describe('eventBefore', () => {
    it('should return an event which is before the time', () => {
      const timeline = new EventTimeline<TestEvent>()

      timeline.mergeEvent({ time: Time.start, id: 'before' })
      timeline.mergeEvent({ time: Time.n1, id: 'at' }) // ignored

      expect(timeline.eventBefore(Time.n1)).toMatchObject({ id: 'before' })
    })

    it("should return null when there's no events before the time", () => {
      const timeline = new EventTimeline<TestEvent>()

      timeline.mergeEvent({ time: Time.n1, id: 1 })

      expect(timeline.eventBefore(Time.start)).toBeNull()
    })
  })

  describe('eventBeforeOrAt', () => {
    it('should return event at time when event exists', () => {
      const timeline = new EventTimeline<TestEvent>()

      timeline.mergeEvent({ time: Time.start, id: 'start' })
      timeline.mergeEvent({ time: Time.n2, id: 'at' })

      expect(timeline.eventBeforeOrAt(Time.n2)).toMatchObject({ id: 'at' })
    })

    it('should return last event before or at time', () => {
      const timeline = new EventTimeline<TestEvent>()

      timeline.mergeEvent({ time: Time.start, id: 'before' })

      expect(timeline.eventBeforeOrAt(Time.n2)).toMatchObject({ id: 'before' })
    })

    it('should return null when no events before or at time', () => {
      const timeline = new EventTimeline<TestEvent>()

      timeline.mergeEvent({ time: Time.n2, id: 1 })

      expect(timeline.eventBeforeOrAt(Time.start)).toBeNull()
    })
  })

  describe('eventAfter', () => {
    it('should return event after specific time', () => {
      const timeline = new EventTimeline<TestEvent>()

      timeline.mergeEvent({ time: Time.start, id: 'at' }) // ignored
      timeline.mergeEvent({ time: Time.n2, id: 'after' })

      expect(timeline.eventAfter(Time.start)).toMatchObject({ id: 'after' })
    })

    it('should return null when no events after time', () => {
      const timeline = new EventTimeline<TestEvent>()

      timeline.mergeEvent({ time: Time.start, id: 1 })

      expect(timeline.eventAfter(Time.n2)).toBeNull()
    })
  })

  describe('eventAfterOrAt', () => {
    it('should return event at time when event exists', () => {
      const timeline = new EventTimeline<TestEvent>()

      timeline.mergeEvent({ time: Time.start, id: 'before' })
      timeline.mergeEvent({ time: Time.n2, id: 'at' })

      expect(timeline.eventAfterOrAt(Time.n2)).toMatchObject({ id: 'at' })
    })

    it('should return null when no event at or after time', () => {
      const timeline = new EventTimeline<TestEvent>()

      timeline.mergeEvent({ time: Time.start, id: 'before' })

      expect(timeline.eventAfterOrAt(Time.n1)).toBeNull()
    })

    it('should return null when no events after or at time', () => {
      const timeline = new EventTimeline<TestEvent>()

      timeline.mergeEvent({ time: Time.start, id: 1 })

      expect(timeline.eventAfterOrAt(Time.n2)).toBeNull()
    })
  })

  describe('cancelEventsAfter', () => {
    it('should remove events after specified time', () => {
      const timeline = new EventTimeline<TestEvent>()

      timeline.mergeEvent({ time: Time.start, id: 1 })
      timeline.mergeEvent({ time: Time.n2, id: 2 })
      timeline.mergeEvent({ time: Time.n1, id: 3 })

      timeline.cancelEventsAfter(Time.start)

      expect(timeline.eventAt(Time.start)).toMatchObject({ id: 1 })
      expect(timeline.eventAt(Time.n2)).toBeNull()
      expect(timeline.eventAt(Time.n1)).toBeNull()
    })

    it('should emit cancelled signal when events are removed', () => {
      const timeline = new EventTimeline<TestEvent>()
      const callback = vi.fn()

      timeline.mergeEvent({ time: Time.start, id: 1 })
      timeline.mergeEvent({ time: Time.n2, id: 2 })

      timeline.cancelled.watch(callback)
      timeline.cancelEventsAfter(Time.start)

      expect(callback).toHaveBeenCalledWith({ after: Time.start })
    })

    it('should not emit cancelled signal when no events to remove', () => {
      const timeline = new EventTimeline<TestEvent>()
      const callback = vi.fn()

      timeline.mergeEvent({ time: Time.start, id: 1 })
      timeline.cancelled.watch(callback)
      timeline.cancelEventsAfter(Time.n2)

      expect(callback).not.toHaveBeenCalled()
    })
  })

  describe('cancelEventsAfterUntil', () => {
    it('should remove events in specified range', () => {
      const timeline = new EventTimeline<TestEvent>()

      timeline.mergeEvent({ time: Time.start, id: 'before' })
      timeline.mergeEvent({ time: Time.n8, id: 'first' })
      timeline.mergeEvent({ time: Time.n4, id: 'middle' })
      timeline.mergeEvent({ time: Time.n2, id: 'middle' })
      timeline.mergeEvent({ time: Time.n1, id: 'last' })
      timeline.mergeEvent({ time: Time.n1.repeat(2), id: 'after' })

      timeline.cancelEventsAfterUntil(Time.n8, Time.n1)

      const events = Array.from(timeline.eventsAfterOrAt(Time.start))
      expect(events).toMatchObject([{ id: 'before' }, { id: 'first' }, { id: 'last' }, { id: 'after' }])
    })

    it('should keep two neighbor events', () => {
      const timeline = new EventTimeline<TestEvent>()

      timeline.mergeEvent({ time: Time.n2, id: 'left' })
      timeline.mergeEvent({ time: Time.n1, id: 'right' })

      timeline.cancelEventsAfterUntil(Time.n2, Time.n1)

      const events = Array.from(timeline.eventsAfterOrAt(Time.start))
      expect(events).toMatchObject([{ id: 'left' }, { id: 'right' }])
    })

    it('should keep events when the parameters are equal', () => {
      const timeline = new EventTimeline<TestEvent>()
      const callback = vi.fn()

      timeline.cancelled.watch(callback)
      timeline.mergeEvent({ time: Time.n1, id: 'kept' })
      timeline.cancelEventsAfterUntil(Time.n1, Time.n1)

      expect(timeline.eventAt(Time.n1)).toMatchObject({ id: 'kept' })
      expect(callback).not.toHaveBeenCalled()
    })

    it('should keep events when the until parameter is before the after parameter', () => {
      const timeline = new EventTimeline<TestEvent>()
      const callback = vi.fn()

      timeline.cancelled.watch(callback)
      timeline.mergeEvent({ time: Time.n2, id: 'kept' })
      timeline.cancelEventsAfterUntil(Time.n1, Time.n2)

      expect(timeline.eventAt(Time.n2)).toMatchObject({ id: 'kept' })
      expect(callback).not.toHaveBeenCalled()
    })

    it('should emit the cancelled signal with both time parameters', () => {
      const timeline = new EventTimeline<TestEvent>()
      const callback = vi.fn()

      timeline.cancelled.watch(callback)
      timeline.mergeEvent({ time: Time.start, id: 1 })
      timeline.mergeEvent({ time: Time.n4, id: 2 })
      timeline.mergeEvent({ time: Time.n1, id: 3 })
      timeline.cancelEventsAfterUntil(Time.start, Time.n1)

      expect(callback).toHaveBeenCalledWith({ after: Time.start, until: Time.n1 })
    })
  })

  describe('eventsAfter', () => {
    it('should yield events after specified time', () => {
      const timeline = new EventTimeline<TestEvent>()

      timeline.mergeEvent({ time: Time.start, id: 1 })
      timeline.mergeEvent({ time: Time.n2, id: 2 })
      timeline.mergeEvent({ time: Time.n1, id: 3 })

      const events = Array.from(timeline.eventsAfter(Time.start))

      expect(events).toHaveLength(2)
      expect(events[0]).toMatchObject({ id: 2 })
      expect(events[1]).toMatchObject({ id: 3 })
    })

    it('should yield empty when no events after time', () => {
      const timeline = new EventTimeline<TestEvent>()

      timeline.mergeEvent({ time: Time.start, id: 1 })

      const events = Array.from(timeline.eventsAfter(Time.n2))

      expect(events).toHaveLength(0)
    })
  })

  describe('eventsAfterOrAt', () => {
    it('should yield events after or at specified time', () => {
      const timeline = new EventTimeline<TestEvent>()

      timeline.mergeEvent({ time: Time.start, id: 1 })
      timeline.mergeEvent({ time: Time.n2, id: 2 })
      timeline.mergeEvent({ time: Time.n1, id: 3 })

      const events = Array.from(timeline.eventsAfterOrAt(Time.n2))

      expect(events).toHaveLength(2)
      expect(events[0]).toMatchObject({ id: 2 })
      expect(events[1]).toMatchObject({ id: 3 })
    })

    it('should yield empty when no events after or at time', () => {
      const timeline = new EventTimeline<TestEvent>()

      timeline.mergeEvent({ time: Time.start, id: 1 })

      const events = Array.from(timeline.eventsAfterOrAt(Time.n2))

      expect(events).toHaveLength(0)
    })
  })

  describe('eventsBefore', () => {
    it('should yield events before specified time', () => {
      const timeline = new EventTimeline<TestEvent>()

      timeline.mergeEvent({ time: Time.start, id: 1 })
      timeline.mergeEvent({ time: Time.n2, id: 2 })
      timeline.mergeEvent({ time: Time.n1, id: 3 })

      const events = Array.from(timeline.eventsBefore(Time.n1))

      expect(events).toHaveLength(2)
      expect(events[0]).toMatchObject({ id: 2 })
      expect(events[1]).toMatchObject({ id: 1 })
    })

    it('should yield empty when no events before time', () => {
      const timeline = new EventTimeline<TestEvent>()

      timeline.mergeEvent({ time: Time.n2, id: 1 })

      const events = Array.from(timeline.eventsBefore(Time.start))

      expect(events).toHaveLength(0)
    })
  })

  describe('eventsBeforeOrAt', () => {
    it('should yield events before or at specified time', () => {
      const timeline = new EventTimeline<TestEvent>()

      timeline.mergeEvent({ time: Time.start, id: 1 })
      timeline.mergeEvent({ time: Time.n2, id: 2 })
      timeline.mergeEvent({ time: Time.n1, id: 3 })

      const events = Array.from(timeline.eventsBeforeOrAt(Time.n2))

      expect(events).toHaveLength(2)
      expect(events[0]).toMatchObject({ id: 2 })
      expect(events[1]).toMatchObject({ id: 1 })
    })

    it('should yield empty when no events before or at time', () => {
      const timeline = new EventTimeline<TestEvent>()

      timeline.mergeEvent({ time: Time.n2, id: 1 })

      const events = Array.from(timeline.eventsBeforeOrAt(Time.start))

      expect(events).toHaveLength(0)
    })
  })

  describe('eventSpan', () => {
    it('should return events before/at and after specified time', () => {
      const timeline = new EventTimeline<TestEvent>()

      timeline.mergeEvent({ time: Time.start, id: 'before' })
      timeline.mergeEvent({ time: Time.n2, id: 'at' })
      timeline.mergeEvent({ time: Time.n1, id: 'after' })

      const [before, after] = timeline.eventSpan(Time.n2)

      expect(before).toMatchObject({ id: 'at' })
      expect(after).toMatchObject({ id: 'after' })
    })

    it('should return null for missing events', () => {
      const timeline = new EventTimeline<TestEvent>()

      timeline.mergeEvent({ time: Time.n2, id: 'middle' })

      const [before, after] = timeline.eventSpan(Time.n2)

      expect(before).toMatchObject({ id: 'middle' })
      expect(after).toBeNull()
    })
  })

  describe('timeRange', () => {
    it('should return start and end times of timeline', () => {
      const timeline = new EventTimeline<TestEvent>()

      timeline.mergeEvent({ time: Time.n2, id: 'middle' })
      timeline.mergeEvent({ time: Time.start, id: 'start' })
      timeline.mergeEvent({ time: Time.n1, id: 'end' })

      const [start, end] = timeline.timeRange

      expect(start.equals(Time.start)).toBe(true)
      expect(end.equals(Time.n1)).toBe(true)
    })

    it('should throw error when timeline is empty', () => {
      const timeline = new EventTimeline<TestEvent>()

      expect(() => timeline.timeRange).toThrow()
    })
  })
})
