"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart"

interface FinancialChartsProps {
  topCategories: { name: string; amount: number; percentage: number; transactions: number }[]
  balance: { income: number; expenses: number; net: number; savings_rate: number }
}

export function FinancialCharts({ topCategories, balance }: FinancialChartsProps) {
  // Prepare data for category chart
  const categoryChartData = topCategories.map((cat) => ({
    name: cat.name,
    amount: cat.amount,
  }))

  // Prepare data for balance chart
  const balanceChartData = [
    { name: "Receitas", value: balance.income, color: "hsl(var(--chart-1))" },
    { name: "Despesas", value: balance.expenses, color: "hsl(var(--chart-2))" },
    { name: "Saldo Líquido", value: balance.net, color: "hsl(var(--chart-3))" },
  ]

  return (
    <div className="flex flex-col gap-4 mt-4">
      {/* Gráfico de Balanço Geral */}
      <Card className="w-full bg-white shadow-md rounded-lg p-4 text-left">
        <CardHeader className="p-0 pb-2">
          <CardTitle className="text-lg font-semibold">Balanço Geral</CardTitle>
        </CardHeader>
        <CardContent className="p-0 h-[150px]">
          <ChartContainer
            config={{
              Receitas: { label: "Receitas", color: "hsl(var(--chart-1))" },
              Despesas: { label: "Despesas", color: "hsl(var(--chart-2))" },
              "Saldo Líquido": { label: "Saldo Líquido", color: "hsl(var(--chart-3))" },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={balanceChartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={100} tickLine={false} axisLine={false} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="value" fill="var(--color-name)" radius={5} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Principais Categorias */}
      {categoryChartData.length > 0 && (
        <Card className="w-full bg-white shadow-md rounded-lg p-4 text-left">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="text-lg font-semibold">Principais Categorias de Despesas</CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[250px]">
            <ChartContainer
              config={{
                amount: {
                  label: "Valor",
                  color: "hsl(var(--chart-2))", // Using a color for expenses
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-30} textAnchor="end" height={60} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="amount" fill="var(--color-amount)" name="Gasto" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
