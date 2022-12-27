import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useMantineColorScheme } from "@mantine/core";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import type { ProductsWithDate } from "../../types/getProducts";
import { DateTime } from "luxon";

export const LineChart = ({
  product,
  colorsScheme,
}: {
  product: ProductsWithDate | undefined;
  colorsScheme: string | undefined;
}) => {
  const [stockValues, setStockValues] = useState<number[]>(
    product?.date.map((date) => date.stock) ?? []
  );
  const [dates, setDates] = useState<string[]>(
    product?.date.map((date) => date?.date as any) ?? []
  );
  useMemo(() => {
    setStockValues(product?.date.map((date) => date.stock) ?? []);
    setDates(
      product?.date.map((date) =>
        DateTime.fromISO(date?.date as any).toISO()
      ) ?? []
    );
  }, [product]);

  const schema = {
    series: [
      {
        name: "Invetory",
        data: stockValues,
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
      },
      forecastDataPoints: {
        count: 1,
      },
      stroke: {
        width: 5,
        curve: "smooth",
      },
      xaxis: {
        type: "datetime",
        categories: dates,
        tickAmount: dates.length,
        labels: {
          formatter: function (value: any, timestamp: any, opts: any) {
            return opts.dateFormatter(new Date(timestamp), "dd MMM");
          },
        },
      },
      title: {
        text: `Invetory for ${product?.name}`,
        align: "left",
        style: {
          fontSize: "16px",
          color: colorsScheme === "dark" ? "#c1c2c5" : "#000000",
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          gradientToColors: [
            "#202a34",
            "#105675",
            "#177ba9",
            "#1c98ce",
            "#22bcff",
          ],
        },
      },
      yaxis: {
        min: Math.min(...stockValues) - 10,
        max: Math.max(...stockValues) + 10,
      },
    },
  };
  const [state, setState] = useState(schema);
  useMemo(() => {
    setState(schema);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, colorsScheme]);

  return (
    <div className="mixed-chart">
      {typeof window !== "undefined" && (
        <Chart
          options={state.options as any}
          series={state.series}
          type="line"
          height="350"
        />
      )}
    </div>
  );
};
