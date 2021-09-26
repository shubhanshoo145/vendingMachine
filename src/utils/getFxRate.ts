/**
 * 
 * @param sourceCurrency 
 * @param destinationCurrency 
 * This will ideally be an api call to fetch the rates
 * But for simplicity I am using a random number generator to get the rates
 */
export async function getFxRate(sourceCurrency: string, destinationCurrency: string): Promise<number> {
  return new Promise((resolve, reject) => {
    resolve(Math.floor(Math.random() * 100));
  })
}