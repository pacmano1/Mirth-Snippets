// Author Tony Germano 
// Discusion orginated on Mirth Slack from discussion started by nafwa03

function groupAndSum(arr, groupByKeys, sumKeys) {
  const toGroupKey = o => groupByKeys.map(k => o[k]).join('|')
  const newResultObject = sourceObj => groupByKeys
    .map(k => [k, sourceObj[k]])
    .concat(sumKeys.map(k => [k, 0]))
    .reduce((targetObj, [k, v]) => (targetObj[k] = v, targetObj), {})
​
  const groupMap = Object.create(null)
  return arr.reduce((result, currentObject) => {
    const key = toGroupKey(currentObject)
    const pushSetAndGet = o => (result.push(o), groupMap[key] = o)
    const resultObject = groupMap[key] || pushSetAndGet(newResultObject(currentObject))
    sumKeys.forEach(k => { resultObject[k] += currentObject[k] || 0 })
    return result
  }, [])
}
