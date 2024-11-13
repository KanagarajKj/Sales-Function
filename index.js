const {SalesData} = require("./salesData");

const monthSortFun = (data) => {
  const sortedKeys = Object.keys(data).sort((a, b) => a - b);
  let sortedData = [];
  for (const item of sortedKeys) {
    sortedData.push({ month: item, data: data[item] });
  }
  return sortedData;
};

function analyzeIceCreamSales(SalesData) {
    const salesByMonth = {};
    const mostPopularItemsPerMonth = {};
    const topRevenueItemsPerMonth = {};
    const popularItemMetrics = {};

    // 1. Total sales of the store.
    const totalSalesOfStore = SalesData.reduce((acc, cur) => acc + cur.Quantity, 0);

    for (const { Date, SKU, UnitPrice, Quantity, TotalPrice } of SalesData) {
        // Extract month from Date
        const month = Date.split('-')[2];

        // 2. Month wise sales totals and revenue totals.
        if (!salesByMonth[month]) {
        salesByMonth[month] = { totalSales: 0, totalRevenue: 0 };
        }
        salesByMonth[month].totalSales += Quantity;
        salesByMonth[month].totalRevenue += TotalPrice;

        // 3. Most popular item (most quantity sold) in each month.
        if (!mostPopularItemsPerMonth[month]) {
        mostPopularItemsPerMonth[month] = {};
        }

        if (mostPopularItemsPerMonth[month][SKU]) {
        mostPopularItemsPerMonth[month][SKU] += Quantity;
        } else {
        mostPopularItemsPerMonth[month][SKU] = Quantity;
        }

        // 4. Items generating most revenue in each month.
        if (!topRevenueItemsPerMonth[month]) {
        topRevenueItemsPerMonth[month] = {};
        }

        if (topRevenueItemsPerMonth[month][SKU]) {
        topRevenueItemsPerMonth[month][SKU] += TotalPrice;
        } else {
        topRevenueItemsPerMonth[month][SKU] = TotalPrice;
        }
    }

    const mostPopularItemsPerMonthData = monthSortFun(mostPopularItemsPerMonth);

    const sortMostPopularItemsPerMonthData = mostPopularItemsPerMonthData?.map((monthObject) => {
    const sortedObjectEntries = Object.entries(monthObject?.data).sort(([, a], [, b]) => b - a).slice(0, 5);
    return { ...monthObject, data: Object.fromEntries(sortedObjectEntries) };
    });

    const topRevenuePerMonthData = monthSortFun(topRevenueItemsPerMonth);

    const sortTopRevenueItemsPerMonthData = topRevenuePerMonthData?.map((monthObject) => {
    const sortedObjectEntries = Object.entries(monthObject?.data).sort(([, a], [, b]) => b - a).slice(0, 5);
    return { ...monthObject, data: Object.fromEntries(sortedObjectEntries) };
    });

    // 5. Calculate min, max, and average for the most popular item per month
  const popularItemStatsPerMonth = {};

  for (const [month, items] of Object.entries(sortMostPopularItemsPerMonthData)) {
    const mostPopularSKU = Object.keys(items.data)[0];
    if(!popularItemStatsPerMonth[items?.month]) {
        popularItemStatsPerMonth[items?.month] = mostPopularSKU
    }
  }

  for (const [month, sku] of Object.entries(popularItemStatsPerMonth)) {
    let minQuantity = Infinity;
    let maxQuantity = 0;
    let totalQuantity = 0;
    let orderCount = 0;

    for (const singleData of SalesData) {
        const monthData = singleData?.Date?.split('-')[2];
        
        if (month === monthData && sku === singleData?.SKU) {
            minQuantity = Math.min(minQuantity, singleData?.Quantity);
            maxQuantity += singleData?.Quantity;
            totalQuantity += singleData?.Quantity;
            orderCount++;
        }
    }

    const Average = orderCount > 0 ? totalQuantity / orderCount : 0;

    popularItemMetrics[month] = {
        SKU: sku,
        minQuantity,
        maxQuantity,
        Average
    };
}

  return {
    totalSales: totalSalesOfStore,
    salesByMonth: monthSortFun(salesByMonth),
    mostPopularItemsPerMonth : sortMostPopularItemsPerMonthData,
    topRevenueItemsPerMonth: sortTopRevenueItemsPerMonthData,
    popularItemMetrics: monthSortFun(popularItemMetrics)
  };
}

// Run analysis
const results = analyzeIceCreamSales(SalesData);

// Log the full JSON structure
console.log(JSON.stringify(results, null, 1));