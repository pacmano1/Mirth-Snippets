/**
 * Author Tony Germano
 * Discussion originated on Mirth Slack from discussion started by nafwa03
 */

/**
 * Groups and sums the elements of an array of objects based on the specified groupByKeys and sumKeys.
 * This function takes an array of objects (arr), and groups them based on the specified groupByKeys. 
 * It then sums the values of sumKeys for each group. The resulting array of objects is returned after
 * the grouping and summing.
 *
 * @param {Array<Object>} arr - The array of objects to be grouped and summed.
 * @param {Array<string>} groupByKeys - The object keys used for grouping.
 * @param {Array<string>} sumKeys - The object keys used for summing.
 * @returns {Array<Object>} The resulting array of objects after grouping and summing.
 *
 * @example
 * const inputArray = [
 *   { category: 'A', subcategory: 'X', value: 10 },
 *   { category: 'A', subcategory: 'Y', value: 15 },
 *   { category: 'A', subcategory: 'X', value: 5 },
 *   { category: 'B', subcategory: 'X', value: 20 }
 * ]
 *
 * const groupedAndSummed = groupAndSum(inputArray, ['category', 'subcategory'], ['value'])
 *
 * // Result:
 * // [
 * //   { category: 'A', subcategory: 'X', value: 15 },
 * //   { category: 'A', subcategory: 'Y', value: 15 },
 * //   { category: 'B', subcategory: 'X', value: 20 }
 * // ]
 */
function groupAndSum(arr, groupByKeys, sumKeys) {
  // Function to create a key for grouping based on the groupByKeys
  const toGroupKey = o => groupByKeys.map(k => o[k]).join('|')

  // Function to create a new result object based on the sourceObj and the required keys
  const newResultObject = sourceObj => groupByKeys
    .map(k => [k, sourceObj[k]])
    .concat(sumKeys.map(k => [k, 0]))
    .reduce((targetObj, [k, v]) => (targetObj[k] = v, targetObj), {})

  // Create an empty groupMap to store the grouped objects
  const groupMap = {}

  // Reduce the input array to a new array with grouped and summed objects
  return arr.reduce((result, currentObject) => {
    const key = toGroupKey(currentObject)

    // Function to push a new result object into the result array and set its value in the groupMap
    const pushSetAndGet = o => (result.push(o), groupMap[key] = o)

    // Get the result object from the groupMap, or create a new one and add it to the result array
    const resultObject = groupMap[key] || pushSetAndGet(newResultObject(currentObject))

    // Sum the values of the sumKeys in the result object
    sumKeys.forEach(k => { resultObject[k] += currentObject[k] || 0 })

    return result
  }, [])
}
