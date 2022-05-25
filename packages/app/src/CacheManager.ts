/*
 * "© 2021 Thoughtworks, Inc.
 */

import moment from 'moment'
import { configLoader, Logger } from '@cloud-carbon-footprint/common'
import EstimatorCache from './EstimatorCache'
import { EstimationResult } from '@cloud-carbon-footprint/common'
import { EstimationRequest } from './CreateValidRequest'
import EstimatorCacheFileSystem from './EstimatorCacheFileSystem'
import EstimatorCacheGoogleCloudStorage from './EstimatorCacheGoogleCloudStorage'

const cacheService: EstimatorCache = new EstimatorCacheFileSystem()
const googleCloudCacheService: EstimatorCache =
  new EstimatorCacheGoogleCloudStorage(configLoader().GCP.CACHE_BUCKET_NAME)

export default class CacheManager implements EstimatorCache {
  private readonly currentCacheMode: string
  private readonly cacheLogger: Logger

  constructor() {
    this.currentCacheMode = configLoader().CACHE_MODE
    this.cacheLogger = new Logger('cache')
  }

  cacheModes = {
    GCS: 'GCS',
  }

  async getEstimates(request: EstimationRequest): Promise<EstimationResult[]> {
    const { GCS } = this.cacheModes
    let estimates

    switch (this.currentCacheMode) {
      case GCS:
        this.cacheLogger.info('Using GCS bucket cache file...')
        estimates = await googleCloudCacheService.getEstimates(request)
        break
      default:
        this.cacheLogger.info('Using local cache file...')
        estimates = await cacheService.getEstimates(request)
        break
    }

    return estimates ? this.filterEstimatesForRequest(request, estimates) : []
  }

  async setEstimates(estimates: EstimationResult[]): Promise<void> {
    const { GCS } = this.cacheModes

    if (estimates.length === 0) {
      return
    }

    switch (this.currentCacheMode) {
      case GCS:
        return googleCloudCacheService.setEstimates(estimates)
      default:
        return cacheService.setEstimates(estimates)
    }
  }

  private filterEstimatesForRequest(
    request: EstimationRequest,
    estimates: EstimationResult[],
  ) {
    const startDate = moment.utc(request.startDate)
    const endDate = moment.utc(request.endDate)

    return estimates.filter(({ timestamp }) => {
      return moment
        .utc(timestamp)
        .isBetween(startDate, endDate, undefined, '[)')
    })
  }
}
