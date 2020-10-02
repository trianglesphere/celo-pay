import { Currencies } from './blockscout/transfers'


let lastBlockNotified: number = -1



export function getLastBlockNotified() {
  return lastBlockNotified
}



export function setLastBlockNotified(newBlock: number) {
  if (newBlock <= lastBlockNotified) {
    console.debug('Block number less than latest, skipping latestBlock update.')
    return
  }

  console.debug('Updating last block notified to:', newBlock)
  lastBlockNotified = newBlock
}


const watching: Map<string,Set<string>>  = new Map()
// TODO: Blockscout returns lowercase address. Should programatically check that upper/lower/checksum case is correctly set.
watching.set('0xa2c09ca0a3902ca5e43017159b975c5780cfd4f7', new Set(["XKCD", "XKCD2"]))


export async function sendCeloPayNotification(
  address: string,
  amount: string,
  currency: Currencies,
  data: { [key: string]: string }
) {
  console.error(`GOT SEND PAYMENT NOTIFICATION. address: ${address}. comment: ${data.comment}`)
  // Lookup address, then waiting set
  const UIDS = watching.get(address)
  if (UIDS) {
    if (data.comment && UIDS.has(data.comment)) {
      console.error("GOT GOOD COMMENT TO SEND INFO ON")
      // Send webhook here
    } else {
      console.error("GOT GOOD ADDRESS BUT BAD COMMENT")
      return
    }
  } else {
    console.error("GOT BAD ADDRESS")
    return
  }
}
