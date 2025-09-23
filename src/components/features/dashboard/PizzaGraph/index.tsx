import { PieChart } from "@mui/x-charts";

type PizzaGraphT = {
  data: {
    categoria: string;
    valor: number;
  }[];
};

export const PizzaGraph = ({ data }: PizzaGraphT) => {
  return (
    <>
      <PieChart
        series={[
          {
            data: data.map((d, index) => ({
              id: index,
              value: d.valor,
              label: d.categoria,
            })),
          },
        ]}
        width={200}
        height={200}
      />
    </>
  );
};
