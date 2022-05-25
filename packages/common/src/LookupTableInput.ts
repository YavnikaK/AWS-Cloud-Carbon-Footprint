/*
 * © 2021 Thoughtworks, Inc.
 */

export type LookupTableInput = {
  timestamp: any
  serviceName: string
  region: string
  usageType: string
  usageUnit: string
  usageAmount: number
  vCpus?: string
  machineType?: string
}

export type LookupTableOutput = {
  timestamp: any
  serviceName: string
  region: string
  usageType: string
  usageUnit: string
  usageAmount: number
  vCpus?: string | number
  machineType?: string
  kilowattHours: number
  co2e: number
  usageTypeClass: string
}
