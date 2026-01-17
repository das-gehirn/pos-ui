import DashboardLayout from "@/components/dashboard/Layout";
import DashboardCard from "@/components/dashboard/shared/DashboardCard";
import DashboardCardSkeleton from "@/components/dashboard/shared/DashboardCardSkeleton";
import ChartSkeleton from "@/components/dashboard/shared/ChartSkeleton";
import PortfolioCardSkeleton from "@/components/dashboard/shared/PortfolioCardSkeleton";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ApexOptions } from "apexcharts";
import { Coins } from "lucide-react";
import Chart from "react-apexcharts";
// import SalesReport from "../sales/SalesReport";
import { formatCurrency } from "@/helpers";
import { useDashboardStats, useDashboardStatistics } from "@/hooks/request/useDashboardRequest";

const Dashboard = () => {
  const { dashboardStats, isLoading: isLoadingStats } = useDashboardStats();
  const { statistics, isLoading: isLoadingStatistics } = useDashboardStatistics();
  const salesPerMonthData = statistics?.salesPerMonth || [];
  const state = {
    options: {
      chart: {
        id: "basic-bar",
        tooltip: {
          show: false
        },
        toolbar: {
          show: false
        }
      },
      xaxis: {
        categories: salesPerMonthData.map(item => item.month)
      }
    },
    series: [
      {
        name: "Sales",
        data: salesPerMonthData.map(item => item.total)
      }
    ]
  };
  const debtorsCreditors = statistics?.totalDebtorsCreditors;
  const plotOptions: ApexOptions = {
    series: [debtorsCreditors?.debtors.count || 0, debtorsCreditors?.creditors.count || 0],
    labels: ["Total Debtors", "Total Creditors"]
  };
  return (
    <DashboardLayout pageTitle="Dashboard" pageDescription="Here is the analysis for your store" showScrollToTopButton>
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4">
        {isLoadingStats ? (
          <>
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
          </>
        ) : (
          <>
            <DashboardCard 
              amount={dashboardStats?.monthlySales ?? 0} 
              percentageDifference={0} 
              title="Monthly Sales" 
            />
            <DashboardCard 
              amount={dashboardStats?.monthlyExpenditure ?? 0} 
              percentageDifference={0} 
              title="Monthly Expenditure" 
            />
            <DashboardCard 
              amount={dashboardStats?.totalStockTaken ?? 0} 
              percentageDifference={-12} 
              title="Total Stock Taken" 
              isAmount={false}
              isNumber={true} 
            />
            <DashboardCard 
              amount={dashboardStats?.monthlyProfit ?? 0} 
              percentageDifference={9} 
              title="Monthly Profit" 
            />
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-3 my-16 gap-5">
        {isLoadingStatistics ? (
          <div className="md:col-span-2">
            <ChartSkeleton height={400} showHeader={true} />
          </div>
        ) : (
          <div className="p-3 bg-white md:col-span-2">
            <div className="flex items-center justify-between">
              <h1 className="ml-4 text-2xl">Sales Per Month</h1>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apple">2024</SelectItem>
                  <SelectItem value="banana">2023</SelectItem>
                  <SelectItem value="blueberry">2022</SelectItem>
                  <SelectItem value="grapes">2021</SelectItem>
                  <SelectItem value="pineapple">2020</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Chart
              options={{
                ...state.options,
                grid: {
                  show: false
                },
                stroke: { curve: "smooth", show: false },
                dataLabels: { enabled: false },
                tooltip: {
                  custom: function ({ seriesIndex, dataPointIndex, w }) {
                    const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
                    return `<div style="padding:0.3rem; background:#1e7974; color: #ccc; font-size:12px;">$${data.toFixed(
                      2
                    )}</div>`;
                  }
                },
                plotOptions: {
                  bar: {
                    borderRadiusApplication: "end",
                    // borderRadius: 15,
                    columnWidth: 30
                  }
                },
                //'#4089D0''#20B2AA',
                colors: ["#20B2AA"]
              }}
              series={state.series}
              type="bar"
              width="100%"
              height={400}
            />
          </div>
        )}
        {isLoadingStatistics ? (
          <div className="order-first md:order-last space-y-8">
            <PortfolioCardSkeleton />
            <ChartSkeleton height={300} showHeader={true} />
          </div>
        ) : (
          <div className="order-first md:order-last">
            <div className="card min-h-[200px] bg-primary w-full rounded-md flex flex-col justify-between px-8 text-white mb-8">
            <div className="flex flex-1 items-center justify-between">
              <div className="space-y-3">
                <p className="text-[12px]">Yearly Portfolio value</p>
                <h1 className="text-xl font-medium">{formatCurrency({ value: statistics?.yearlyPortfolioValue?.total || 0 })}</h1>
              </div>
              <div className="border-[#cccccc2b] rounded-full w-10 h-10 border flex items-center justify-center">
                <Coins className="text-green-500" />
              </div>
            </div>
            <div className="flex mt-3 justify-center flex-col flex-1">
              <div className="w-full bg-green-100 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-green-400 h-2.5 rounded-full" 
                  style={{ 
                    width: `${statistics?.yearlyPortfolioValue?.total 
                      ? (statistics.yearlyPortfolioValue.profit / statistics.yearlyPortfolioValue.total) * 100 
                      : 0}%` 
                  }}
                ></div>
              </div>
              <div className="flex my-3 gap-3">
                <div className="flex text-[12px] items-center gap-1">
                  <span className="h-2 w-2 bg-green-400 block rounded-full"></span>
                  <p>Profit: {formatCurrency({ value: statistics?.yearlyPortfolioValue?.profit || 0 })}</p>
                </div>
                <div className="flex text-[12px] items-center gap-1">
                  <span className="h-2 w-2 bg-green-100 block rounded-full"></span>
                  <p>Loss: {formatCurrency({ value: statistics?.yearlyPortfolioValue?.loss || 0 })}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-5 bg-white">
            <div className="flex mb-4 justify-between items-center">
              <h1 className="font-medium text-primary">Profit Per month</h1>
              <Button size={"sm"} className="h-8 bg-green-100 text-green-500 text-sm font-light">
                View All
              </Button>
            </div>

            <Chart
              type="line"
              options={{
                markers: {
                  shape: "circle",
                  colors: ["#4ade80", "#F44336"],
                  strokeColors: [],
                  strokeWidth: 1,
                  size: 2,
                  hover: {
                    size: 5
                  }
                },
                tooltip: {
                  custom: function ({ seriesIndex, dataPointIndex, w }) {
                    const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
                    return `<div style="padding:0.3rem; background:#002b31; color:#4ade80; font-size:12px;">$${data.toFixed(
                      2
                    )}</div>`;
                  }
                },
                xaxis: {
                  categories: statistics?.profitPerMonth?.map(item => item.month) || [],
                  tooltip: {
                    enabled: false
                  }
                },
                stroke: {
                  curve: "smooth",
                  width: 2,
                  colors: ["#002b31"],
                  show: true
                },
                grid: {
                  show: true,
                  xaxis: {
                    lines: {
                      show: true
                    }
                  },
                  yaxis: {
                    lines: {
                      show: false
                    }
                  }
                },
                chart: {
                  toolbar: {
                    show: false
                  }
                }
              }}
              series={[
                {
                  name: "Profit",
                  data: statistics?.profitPerMonth?.map(item => item.profit) || []
                }
              ]}
            />
          </div>
        </div>
        )}
      </div>
      <div className="md:flex my-16 gap-5 space-y-10 md:space-y-0">
        {isLoadingStatistics ? (
          <>
            <div className="md:w-[60%]">
              <ChartSkeleton height={400} showHeader={false} />
            </div>
            <div className="flex-1 md:w-[40%] space-y-4">
              <div className="bg-white p-5">
                <Skeleton className="h-6 w-48 mb-10" />
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <Skeleton className="h-16 w-20 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <div>
                    <Skeleton className="h-16 w-20 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="w-full h-[200px] rounded-full" />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="p-2 bg-white md:w-[60%]">
              <h1 className="ml-4 text-2xl">Sales Target Per Month</h1>
              <Chart
            series={[
              {
                name: "Actual",
                data: statistics?.salesTargetPerMonth?.map(item => ({
                  x: item.month,
                  y: item.actual,
                  goals: [
                    {
                      name: "Expected",
                      value: item.expected,
                      strokeWidth: 17.5,
                      strokeHeight: 4,
                      strokeColor: "#775DD0"
                    }
                  ]
                })) || []
              }
            ]}
            options={{
              stroke: { show: true, width: 1 },
              markers: {
                size: 2,
                colors: ["#fff"],
                strokeColors: ["blue"],
                hover: {
                  size: 5
                }
              },
              colors: ["#1b4bf1"],
              chart: {
                toolbar: {
                  show: false
                }
              },
              grid: {
                yaxis: {
                  lines: {
                    show: false
                  }
                },
                xaxis: {
                  lines: {
                    show: true
                  }
                }
              },

              tooltip: {
                custom: function ({ seriesIndex, dataPointIndex, w }) {
                  const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
                  const expectedValues = data?.goals[0]?.value || 0;
                  return `
                  <div style="padding: 1rem;">
                  <p style="margin-bottom:0.5rem;">${data.x}</p>
                  <div style="display:flex; justify-content: space-between; align-items: center; gap:1rem;font-size: 12px;">
                    <p className="text-sm">Actual: ${data.y}</p>
                    <p className="text-sm">Expected: ${expectedValues}</p>
                  </div>
                </div>
                  `;
                  // return `<div style="padding:0.3rem; background:#000; color: white; font-size:12px;"></div>`;
                }
              },
              dataLabels: { enabled: false },
              xaxis: {
                categories: statistics?.salesTargetPerMonth?.map(item => item.month) || [],
                tooltip: {
                  enabled: true
                }
              },
              legend: {
                show: true,
                showForSingleSeries: true,
                customLegendItems: ["Actual", "Expected"],
                markers: {
                  fillColors: ["blue", "#775DD0"]
                }
              }
            }}
            type="bar"
            width="100%"
            height={400}
          />
        </div>
        <div className="flex-1 md:w-[40%] bg-white">
          <div className="p-2">
            <h1 className="text-xl mb-10">Total Debtors/Creditors</h1>

            <div className="card flex items-center justify-between">
              <div className="data">
                <h1 className="font-medium text-5xl md:text-7xl">{debtorsCreditors?.debtors.count || 0}</h1>
                <p className="text-sm">Total Debtors</p>
              </div>
              <div className="data">
                <h1 className="font-medium text-5xl md:text-7xl">{debtorsCreditors?.creditors.count || 0}</h1>
                <p className="text-sm">Total Creditors</p>
              </div>
            </div>
          </div>
          <Chart
            options={{
              labels: plotOptions.labels,
              legend: { show: true, position: "bottom" },
              stroke: { width: 2 },
              colors: ["#234568", "#AFEEEE"]
            }}
            series={plotOptions.series}
            type="donut"
          />
        </div>
          </>
        )}
      </div>

    </DashboardLayout>
  );
};

export default Dashboard;
