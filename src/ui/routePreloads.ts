let dashboardPromise: Promise<unknown> | null = null
let createBoardPromise: Promise<unknown> | null = null
let templatesPromise: Promise<unknown> | null = null
let pricingPromise: Promise<unknown> | null = null

export function preloadDashboardRoute() {
  dashboardPromise ??= import('./pages/DashboardPage')
  return dashboardPromise
}

export function preloadCreateBoardRoute() {
  createBoardPromise ??= import('./pages/CreateBoardPage')
  return createBoardPromise
}

export function preloadTemplatesRoute() {
  templatesPromise ??= import('./pages/TemplatesPage')
  return templatesPromise
}

export function preloadPricingRoute() {
  pricingPromise ??= import('./pages/PricingPage')
  return pricingPromise
}
