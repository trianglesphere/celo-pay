import BigNumber from 'bignumber.js'
import fetch from 'node-fetch'
import { BLOCKSCOUT_API } from '../config'
import { getLastBlockNotified, sendCeloPayNotification, setLastBlockNotified } from '../firebase'
import { flat, getTokenAddresses, removeEmptyValuesFromObject } from '../util/utils'
import { Log, Response, Transfer } from './blockscout'
import { decodeLogs } from './decode'

export const WEI_PER_GOLD = 1000000000000000000.0

export enum Currencies {
  GOLD = 'gold',
  DOLLAR = 'dollar',
}

export async function query(path: string) {
  try {
    console.debug('Querying Blockscout. Path:', path)
    const response = await fetch(BLOCKSCOUT_API + path)
    const json = await response.json()
    console.debug('Blockscout queried successfully. Path:', path)
    return json
  } catch (error) {
    console.error('Error querying blockscout', error)
    throw error
  }
}

async function getLatestTokenTransfers(
  tokenAddress: string,
  lastBlockNotified: number,
  currency: Currencies
) {
  const response: Response<Log> = await query(
    `module=logs&action=getLogs&fromBlock=${lastBlockNotified + 1}&toBlock=latest` +
      `&address=${tokenAddress}`
  )

  if (!response || !response.result) {
    console.error('Invalid query response format')
    return { transfers: null, latestBlock: lastBlockNotified }
  }

  if (!response.result.length) {
    console.debug('No new logs found for token:', tokenAddress)
    return { transfers: null, latestBlock: lastBlockNotified }
  }

  console.debug('New logs found for token:', tokenAddress, response.result.length)
  const { transfers, latestBlock } = decodeLogs(response.result)
  for (const txTransfers of transfers.values()) {
    txTransfers.forEach((t) => (t.currency = currency))
  }
  return { transfers, latestBlock }
}

export function filterAndJoinTransfers(
  goldTransfers: Map<string, Transfer[]> | null,
  stableTransfers: Map<string, Transfer[]> | null
): Transfer[] {
  if (!goldTransfers && !stableTransfers) {
    return []
  }
  if (!goldTransfers) {
    // @ts-ignore checked above
    return flat([...stableTransfers.values()])
  }
  if (!stableTransfers) {
    return flat([...goldTransfers.values()])
  }

  // Exclude transaction found in both maps as those are from exchanges
  const filteredGold = flat([...goldTransfers.values()]).filter(
    (t) => !stableTransfers.has(t.txHash)
  )
  const filterdStable = flat([...stableTransfers.values()]).filter(
    (t) => !goldTransfers.has(t.txHash)
  )
  return filteredGold.concat(filterdStable)
}

export function notifyForNewTransfers(
  transfers: Transfer[],
  lastBlockNotified: number
): Promise<void[]> {
  const results = new Array<Promise<void>>(transfers.length)
  
  console.log('checking transfers')
  // this is a mock call for testing
  //  sendCeloPayNotification(
  //   '0xa2c09ca0a3902ca5e43017159b975c5780cfd4f7',
  //   '10',
  //   Currencies.DOLLAR,
  //   removeEmptyValuesFromObject({comment:'HELLO'})
  // )


  for (let i = 0; i < transfers.length; i++) {
    const t = transfers[i]
    // Skip transactions for which we've already sent notifications
    if (!t || t.blockNumber <= lastBlockNotified) {
      continue
    }

    // notification data must be only string type
    const notificationData = {
      ...t,
      blockNumber: String(t.blockNumber),
      timestamp: String(t.timestamp),
    }
    const result: Promise<void> = sendCeloPayNotification(
      t.recipient,
      convertWeiValue(t.value),
      t.currency,
      removeEmptyValuesFromObject(notificationData)
    )
    results[i] = result
  }
  const filtered = results.filter((el) => {
    return el !== undefined
  })
  return Promise.all(filtered)
}

export function convertWeiValue(value: string) {
  return new BigNumber(value)
    .div(WEI_PER_GOLD)
    .decimalPlaces(4)
    .valueOf()
}

export async function handleTransferNotifications(): Promise<void> {
  const lastBlockNotified = getLastBlockNotified()
  if (lastBlockNotified < 0) {
    // Set lastBlockNotified to current block number
    const res: any = await query('module=block&action=eth_block_number')
    console.info(res)
    const block = parseInt(res.result, 16)
    console.info(block - 1)
    setLastBlockNotified(block - 1)
    return
  }

  const { goldTokenAddress, stableTokenAddress } = await getTokenAddresses()
  const {
    transfers: goldTransfers,
    latestBlock: goldTransfersLatestBlock,
  } = await getLatestTokenTransfers(goldTokenAddress, lastBlockNotified, Currencies.GOLD)

  const {
    transfers: stableTransfers,
    latestBlock: stableTransfersLatestBlock,
  } = await getLatestTokenTransfers(stableTokenAddress, lastBlockNotified, Currencies.DOLLAR)

  const allTransfers = filterAndJoinTransfers(goldTransfers, stableTransfers)

  await notifyForNewTransfers(allTransfers, lastBlockNotified)
  return setLastBlockNotified(Math.max(goldTransfersLatestBlock, stableTransfersLatestBlock))
}
