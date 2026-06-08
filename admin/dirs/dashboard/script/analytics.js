fetch("dirs/dashboard/actions/daily.php")
  .then((response) => response.json())
  .then((result) => {
    const data = result.Data;

    // if (!Array.isArray(data) || data.length === 0) {
    if (data.length === 0) {
      renderEmptyLineChart("dailyRequests");
      return;
    }

    const weeks = data.map((item) => `Week ${item.WeekOfMonth}`);
    const totals = data.map((item) => Number(item.TotalQty));

    const now = new Date();

    const monthName = now.toLocaleString("default", { month: "long" });
    const year = now.getFullYear();

    const chartTitle = `Overall Weekly Requests (${monthName} ${year})`;

    const chart = echarts.init(document.getElementById("dailyRequests"));

    chart.setOption({
      title: {
        text: chartTitle,
        left: "center",
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        data: weeks,
      },
      yAxis: {
        type: "value",
        min: 0,
      },
      series: [
        {
          name: "Total Quantity",
          type: "line",
          smooth: true,
          data: totals,
          lineStyle: {
            color: "rgba(54, 162, 235, 1)",
            width: 2,
          },
          areaStyle: {
            color: "rgba(54, 162, 235, 0.2)",
          },
        },
      ],
    });

    window.addEventListener("resize", () => {
      chart.resize();
    });
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
    renderEmptyLineChart("dailyRequests");
  });

// GROUPED PER SRN
// fetch("dirs/dashboard/actions/daily.php")
//   .then(res => res.json())
//   .then(result => {
//     const data = result.Data;

//     if (!Array.isArray(data) || data.length === 0) {
//       renderEmptyLineChart("dailyRequests");
//       return;
//     }

//     // -----------------------------
//     // 1. Aggregate by SR_Number
//     // -----------------------------
//     const srTotals = {};

//     data.forEach(item => {
//       const sr = item.SR_Number;
//       const qty = Number(item.ItemTotal_Qty || 0);

//       if (!sr) return;

//       srTotals[sr] = (srTotals[sr] || 0) + qty;
//     });

//     // -----------------------------
//     // 2. Convert to arrays
//     // -----------------------------
//     const srNumbers = Object.keys(srTotals);
//     const totals = Object.values(srTotals);

//     // -----------------------------
//     // 3. Render bar chart
//     // -----------------------------
//     const chart = echarts.init(document.getElementById("dailyRequests"));

//     chart.setOption({
//       title: {
//         text: "Total Quantity per SR",
//         left: "center"
//       },
//       tooltip: {
//         trigger: "axis",
//         axisPointer: { type: "shadow" }
//       },
//       xAxis: {
//         type: "category",
//         data: srNumbers,
//         axisLabel: {
//           rotate: 45 // helps if SR numbers are long
//         }
//       },
//       yAxis: {
//         type: "value",
//         min: 0
//       },
//       series: [
//         {
//           name: "Total Qty",
//           type: "bar",
//           data: totals,
//           itemStyle: {
//             color: "rgba(54, 162, 235, 1)"
//           }
//         }
//       ]
//     });

//     window.addEventListener("resize", () => chart.resize());
//   })
//   .catch(err => {
//     console.error(err);
//     renderEmptyLineChart("dailyRequests");
//   });

// fetch("charts/status.php")
//   .then((response) => response.json())
//   .then((data) => {
//     if (!Array.isArray(data) || data.length === 0) {
//       console.warn(
//         "No data received for requests status. Displaying placeholder chart.",
//       );
//       renderEmptyBarChart("status");
//       return;
//     }

//     const status = data.map((item) => item.status);
//     const count = data.map((item) => item.count);

//     const proposalStatusChart = echarts.init(
//       document.getElementById("status"),
//     );

//     const options = {
//       title: {
//         text: "Proposal Status",
//         left: "center",
//       },
//       tooltip: {
//         trigger: "item",
//       },
//       xAxis: {
//         type: "category",
//         data: status,
//         axisLabel: {
//           rotate: 45,
//         },
//       },
//       yAxis: {
//         type: "value",
//         min: 0,
//       },
//       series: [
//         {
//           data: count,
//           type: "bar",
//           itemStyle: {
//             color: function (params) {
//               const currentStatus = status[params.dataIndex];
//               return statusColors[currentStatus] || "#4caf50";
//             },
//           },
//         },
//       ],
//     };

//     proposalStatusChart.setOption(options);
//     window.addEventListener("resize", function () {
//       proposalStatusChart.resize();
//     });
//   })
//   .catch((error) => {
//     console.error("Error fetching data:", error);
//     renderEmptyBarChart("proposal_status"); // Call bar chart placeholder on error
//   });

// // For the ownership chart (Pie Chart)
// fetch("charts/branch.php")
//   .then((response) => response.json())
//   .then((data) => {
//     if (!Array.isArray(data) || data.length === 0) {
//       console.warn(
//         "No data received for branch requests. Displaying placeholder chart.",
//       );
//       renderEmptyPieChart("branch"); // Call pie chart placeholder
//       return;
//     }

//     const total = data.map((item) => item.total);
//     const proposals = data.map((item) => item.proposals);

//     const statusChart = echarts.init(document.getElementById("branch"));

//     const options = {
//       title: {
//         text: "Branch Requests",
//         left: "center",
//       },
//       tooltip: {
//         trigger: "item",
//         formatter: "{a} <br/>{b}: {c} ({d}%)",
//       },
//       series: [
//         {
//           name: "Branch Requests",
//           type: "pie",
//           radius: "50%",
//           data: proposals.map((proposal, index) => ({
//             value: total[index],
//             name: proposal,
//           })),
//           label: {
//             formatter: "{b}: {c} ({d}%)",
//           },
//         },
//       ],
//     };

//     statusChart.setOption(options);
//     window.addEventListener("resize", function () {
//       statusChart.resize();
//     });
//   })
//   .catch((error) => {
//     console.error("Error fetching data:", error);
//     renderEmptyPieChart("status"); // Call pie chart placeholder on error
//   });

// Function to render an empty Line Chart (for Proposal)
function renderEmptyLineChart(chartId) {
  const chartDom = document.getElementById(chartId);
  if (!chartDom) {
    console.error(`Chart DOM element '${chartId}' not found.`);
    return;
  }

  const myLineChart = echarts.init(chartDom);

  const option = {
    title: {
      text: "No Data Available",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: ["No Data"],
    },
    yAxis: {
      type: "value",
      min: 0,
    },
    series: [
      {
        data: [0],
        type: "line",
        smooth: true,
        lineStyle: {
          color: "#ccc",
          width: 2,
        },
        areaStyle: {
          color: "rgba(204, 204, 204, 0.3)",
        },
      },
    ],
  };

  myLineChart.setOption(option);
}

// function renderEmptyBarChart(chartId) {
//   const chartDom = document.getElementById(chartId);
//   if (!chartDom) return;

//   const myChart = echarts.init(chartDom);

//   const option = {
//     title: {
//       text: "No Data Available",
//       left: "center",
//     },
//     tooltip: {
//       trigger: "axis",
//     },
//     xAxis: {
//       type: "category",
//       data: ["No Data"],
//     },
//     yAxis: {
//       type: "value",
//       min: 0,
//     },
//     series: [
//       {
//         data: [0],
//         type: "bar",
//         itemStyle: {
//           color: "#ccc", // Light gray for the empty bar
//         },
//       },
//     ],
//   };

//   myChart.setOption(option);
// }

// function renderEmptyPieChart(chartId) {
//   const chartDom = document.getElementById(chartId);
//   if (!chartDom) return;

//   const myChart = echarts.init(chartDom);

//   const option = {
//     title: {
//       text: "No Data Available",
//       left: "center",
//     },
//     tooltip: {
//       trigger: "item",
//       formatter: "{a} <br/>{b}: {c} ({d}%)",
//     },
//     series: [
//       {
//         name: "No Data",
//         type: "pie",
//         radius: "50%",
//         data: [{ value: 0, name: "No Data" }],
//       },
//     ],
//   };

//   myChart.setOption(option);
// }
