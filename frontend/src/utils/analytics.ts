interface AnalyticsEvent {
  category: string
  action: string
  label?: string
  value?: number
}

interface PageView {
  path: string
  referrer?: string
}

class Analytics {
  private enabled: boolean

  constructor() {
    this.enabled = import.meta.env.DEV !== true
  }

  trackEvent(event: AnalyticsEvent) {
    if (!this.enabled) return
    console.log('[Analytics]', event)
  }

  trackPageView(page: PageView) {
    if (!this.enabled) return
    console.log('[PageView]', page)
  }

  trackTiming(category: string, variable: string, value: number) {
    if (!this.enabled) return
    console.log('[Timing]', { category, variable, value })
  }
}

export const analytics = new Analytics()