function groupAndSum(arr, groupByKeys, sumKeys) {
    const groupMap = {};

    arr.forEach(item => {
        const key = groupByKeys.map(k => item[k]).join('|');

        if (!groupMap[key]) {
            groupMap[key] = groupByKeys.reduce((obj, k) => (obj[k] = item[k], obj), {});
            sumKeys.forEach(k => groupMap[key][k] = 0);
        }

        sumKeys.forEach(k => {
            groupMap[key][k] += item[k] || 0;
        });
    });

    return Object.values(groupMap);
}

const inputArray = [
    {category: 'A', subcategory: 'X', value: 10},
    {category: 'A', subcategory: 'Y', value: 15},
    {category: 'A', subcategory: 'X', value: 5},
    {category: 'B', subcategory: 'X', value: 20}
]

const groupedAndSummed = groupAndSum(inputArray, ['category', 'subcategory'], ['value'])
