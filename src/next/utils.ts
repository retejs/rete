export function getUID() {
  const typedArray = new Uint8Array(10)
  const randomValues = window.crypto.getRandomValues(typedArray)

  return randomValues.join('');
}
