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

export async function sendPaymentNotification(
  address: string,
  amount: string,
  currency: Currencies,
  data: { [key: string]: string }
) {
  // return sendNotification(
  //   t('paymentReceivedTitle'),
  //   t('paymentReceivedBody', {
  //     amount,
  //     currency: t(currency, { count: parseInt(amount, 10) }),
  //   }),
  //   address,
  //   data
  // )
}
