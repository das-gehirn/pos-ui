import React, { useEffect, useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  getMonth,
  getYear
} from "date-fns";
import { formatCurrency } from "@/helpers";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MonthPicker from "@/components/customFields/date/MonthPicker";
import YearPicker from "@/components/customFields/date/YearPicker";
import Loader from "@/components/Loader";
import { useFormFieldUpdate } from "@/hooks/useFormFieldUpdate";
import { useDebouncedSetQueryParam } from "@/components/table/hooks/useDebounceSetQueryParams";
import { HandlerProps } from "@/components/customFields/type";
import { useGeneralQuery } from "@/hooks/request/useGeneralQuery";
import { GetManyProps } from "@/hooks/types";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import SalesAnalysisListView from "./SalesAnalysisListView";

const SalesAnalysis = () => {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { formValues, updateFormFieldValue } = useFormFieldUpdate({
    year: currentDate ? getYear(currentDate) : new Date().getFullYear(),
    month: currentDate ? getMonth(currentDate) + 1 : new Date().getMonth() + 1
  });
  const { debouncedSetQueryParam, queryObject } = useDebouncedSetQueryParam();
  const [openModal, setOpenModal] = useState(false);
  const { data, isFetching } = useGeneralQuery<GetManyProps<{ date: string; totalItemsSold: number }[]>>({
    queryKey: ["salesAnalysis", queryObject],
    url: "/sales/analysis",
    requireAuth: true,
    enabled: !!Object.keys(queryObject).length,
    query: queryObject
  });
  const { data: singleSalesAnalysis, isFetching: isFetchingSingleAnalysis } = useGeneralQuery<
    GetManyProps<{ productName: string; totalQuantity: number; totalPrice: number }[]>
  >({
    queryKey: ["singleSalesAnalysis", selectedDate],
    url: "/sales/single/analysis",
    requireAuth: true,
    enabled: Boolean(selectedDate),
    query: { date: selectedDate || "" }
  });
  // const { data: som } = useGeneralQuery<GetManyProps<{ name: string; totalQuantity: number; totalPrice: number }>>({
  //   queryKey: ["gfdghfgfhgf", selectedDate],
  //   url: "/sales/by/cashier",
  //   requireAuth: true,
  //   enabled: Boolean(selectedDate),
  //   query: { date: selectedDate || "" }
  // });


  useEffect(() => {
    if (queryObject && queryObject.year && queryObject.month) {
      const year = parseInt(queryObject.year);
      const month = parseInt(queryObject.month) - 1;
      setCurrentDate(new Date(year, month));
      updateFormFieldValue("year", year);
      updateFormFieldValue("month", month + 1);
    } else {
      const currentDate = new Date();
      setCurrentDate(currentDate);
      debouncedSetQueryParam({
        year: getYear(currentDate).toString(),
        month: (getMonth(currentDate) + 1).toString()
      });
    }
  }, []);

  const nextMonth = () => {
    if (currentDate) {
      const newDate = addMonths(currentDate, 1);
      setCurrentDate(newDate);
      const newYear = getYear(newDate);
      const newMonthValue = getMonth(newDate) + 1;
      updateFormFieldValue("month", newMonthValue);
      updateFormFieldValue("year", newYear);
      debouncedSetQueryParam({
        year: newYear.toString(),
        month: newMonthValue.toString()
      });
    }
  };

  const prevMonth = () => {
    if (currentDate) {
      const newDate = subMonths(currentDate, 1);
      setCurrentDate(newDate);
      const newYear = getYear(newDate);
      const newMonthValue = getMonth(newDate) + 1;
      updateFormFieldValue("month", newMonthValue);
      updateFormFieldValue("year", newYear);
      debouncedSetQueryParam({
        year: newYear.toString(),
        month: newMonthValue.toString()
      });
    }
  };

  const CalendarButton = ({
    children,
    onClick,
    disabled
  }: {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
  }) => {
    return (
      <Button
        size={"icon"}
        onClick={onClick}
        className="text-lg font-bold text-primary bg-gray-100 hover:text-gray-100 rounded-full"
        disabled={disabled}
      >
        {children}
      </Button>
    );
  };

  const handleSetSelectedDate = (date: Date) => {
    setSelectedDate(date);
    setOpenModal(true);
  };

  const handleFieldChange = (data: HandlerProps) => {
    const { key, value } = data;
    updateFormFieldValue(key, value);

    const newYear = key === "year" ? value : formValues.year;
    const newMonth = key === "month" ? value : formValues.month;
    setCurrentDate(new Date(newYear, newMonth - 1));

    debouncedSetQueryParam({ [key]: value });
  };
  const calculateSingleSalesTotal = (data: { totalPrice: number }[]) => {
    return data.reduce((initialValue, data) => initialValue + data.totalPrice, 0);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center py-2 md:px-6 mb-5">
        <CalendarButton onClick={prevMonth} disabled={isFetching}>
          <ChevronLeft />
        </CalendarButton>
        <div className="flex flex-col items-center gap-y-5">
          <span className="text-lg font-bold">{currentDate ? format(currentDate, "MMMM yyyy") : ""}</span>
          <div className="md:flex gap-x-4">
            <div className="flex">
              <MonthPicker
                type="shortMonth"
                fieldKey="month"
                value={formValues.month}
                handleFieldChange={handleFieldChange}
              />
              <YearPicker fieldKey="year" value={formValues.year} handleFieldChange={handleFieldChange} />
            </div>
          </div>
        </div>
        <CalendarButton onClick={nextMonth} disabled={isFetching}>
          <ChevronRight />
        </CalendarButton>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const startDate = currentDate ? startOfWeek(currentDate) : startOfWeek(new Date());

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="text-center py-2 w-[80px]" key={i}>
          {format(addDays(startDate, i), "EEE")}
        </div>
      );
    }

    return <div className="grid grid-cols-7">{days}</div>;
  };

  const FetchingDataLoader = () => {
    return (
      <div className="absolute z-50 md:top-[6.2rem] top-0 right-0 bottom-0 left-0 bg-gray-50 opacity-75 flex items-center justify-center flex-col">
        <Loader />
        <h1>Fetching Sales Analysis</h1>
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = currentDate ? startOfMonth(currentDate) : startOfMonth(new Date());
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "d");
        const cloneDay = day;
        const response = data?.data || [];
        const dayData = response.find((d) => format(cloneDay, "yyyy-MM-dd") === d.date)?.totalItemsSold || 0;

        days.push(
          <div
            className={`cursor-pointer square-cell flex flex-col border border-gray-50 h-[110px]`}
            key={day.toString()}
            onClick={() => handleSetSelectedDate(cloneDay)}
          >
            <div>
              <span className="p-1 text-gray-400">{formattedDate}</span>
              <sub>{format(day, "LLL")}</sub>
            </div>
            <div className="flex-1 flex items-center justify-center sm:text-sm font-medium">
              {formatCurrency({ value: dayData, minifyFormat: true })}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 " key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }

    return <div>{rows}</div>;
  };

  return (
    <div className="md:w-[95%] w-full h-full mx-auto mt-4 bg-white md:overflow-hidden relative">
      {renderHeader()}
      {isFetching && <FetchingDataLoader />}
      {renderDays()}
      {renderCells()}

      <AlertDialog open={openModal}>
        <AlertDialogContent className="max-w-screen h-screen overflow-auto !rounded-none">
          <div className="flex h-full w-full flex-col">
            {/* CONTENT START */}
            <div className="content flex-1">
              <div className="flex items-end justify-end">
                <AlertDialogCancel
                  className="flex bg-transparent hover:bg-transparent w-8 h-8"
                  onClick={() => setOpenModal(false)}
                >
                  X
                </AlertDialogCancel>
              </div>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-center">
                  <p className="underline">Sales Analysis for {selectedDate && format(selectedDate, "do MMMM yyyy")}</p>
                </AlertDialogTitle>

                <div className="mt-10 flex items-center justify-center">{isFetchingSingleAnalysis && <Loader />}</div>
              </AlertDialogHeader>

              {singleSalesAnalysis?.data && singleSalesAnalysis?.data.length > 0 && (
                <>
                  <div className="flex md:items-end md:justify-end gap-4 items-center justify-center my-5">
                    <span> Overall Total:</span>
                    <span className="text-sm font-bold">
                      {formatCurrency({ value: calculateSingleSalesTotal(singleSalesAnalysis.data) })}
                    </span>
                  </div>
                  <div className="my-10">
                    {singleSalesAnalysis?.data && singleSalesAnalysis.data.length > 0 && (
                      <SalesAnalysisListView data={singleSalesAnalysis.data} />
                    )}
                  </div>
                </>
              )}
              {!singleSalesAnalysis?.data ||
                (!singleSalesAnalysis?.data.length && <div className="font-bold text-center my-10">No Data found</div>)}
            </div>
            {/* CONTENT END */}
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpenModal(false)}>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SalesAnalysis;
