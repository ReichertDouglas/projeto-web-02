"use client";

import React, { useState } from "react";

export default function DashboardPage() {
  // Mock de dados – substitua depois por chamadas reais
  const [overview] = useState({
    receitas: 8500,
    despesas: 5600,
  });
  const saldo = overview.receitas - overview.despesas;

  const [despesasCategoria] = useState([
    { categoria: "Alimentação", valor: 1800 },
    { categoria: "Transporte", valor: 700 },
    { categoria: "Lazer", valor: 500 },
    { categoria: "Moradia", valor: 2600 },
  ]);

  const [alertas] = useState([
    { id: 1, nome: "Conta de luz", vencimento: "25/09/2025", valor: 230 },
    { id: 2, nome: "Internet", vencimento: "27/09/2025", valor: 120 },
  ]);

  const [cotacoes] = useState({
    dolar: "R$ 5,42",
    ibov: "118.320 pts",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho */}
        <header className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-bold">Dashboard • FinTrack</h1>
          <button className="px-4 py-2 rounded bg-slate-800 text-white">
            Logout
          </button>
        </header>

        {/* Balanço Geral */}
        <section className="grid gap-6 md:grid-cols-3 mb-10">
          <Card title="Receitas" value={`R$ ${overview.receitas.toFixed(2)}`} color="text-green-600" />
          <Card title="Despesas" value={`R$ ${overview.despesas.toFixed(2)}`} color="text-red-600" />
          <Card title="Saldo Atual" value={`R$ ${saldo.toFixed(2)}`} color={saldo >= 0 ? "text-green-700" : "text-red-700"} />
        </section>

        {/* Gráficos */}
        <section className="bg-white shadow rounded-2xl p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">Distribuição de Despesas</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Placeholder gráfico de pizza */}
            <div className="h-64 flex items-center justify-center text-slate-400 border rounded">
              [Gráfico de Pizza aqui]
            </div>
            {/* Tabela resumo */}
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2">Categoria</th>
                  <th className="py-2">Valor</th>
                </tr>
              </thead>
              <tbody>
                {despesasCategoria.map((d) => (
                  <tr key={d.categoria} className="border-b last:border-none">
                    <td className="py-2">{d.categoria}</td>
                    <td className="py-2">R$ {d.valor.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Alertas de Vencimentos */}
        <section className="bg-white shadow rounded-2xl p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">Contas a Vencer</h2>
          {alertas.length === 0 ? (
            <p className="text-slate-500">Nenhuma conta próxima do vencimento.</p>
          ) : (
            <ul className="space-y-3">
              {alertas.map((a) => (
                <li key={a.id} className="flex justify-between border-b pb-2 last:border-none">
                  <span>{a.nome} – {a.vencimento}</span>
                  <span className="font-semibold">R$ {a.valor.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Cotações */}
        <section className="bg-white shadow rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Cotações</h2>
          <div className="flex gap-10">
            <div>
              <p className="text-sm text-slate-500">Dólar (USD)</p>
              <p className="text-lg font-bold">{cotacoes.dolar}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Ibovespa</p>
              <p className="text-lg font-bold">{cotacoes.ibov}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Card({ title, value, color }: { title: string; value: string; color: string }) {
  return (
    <div className="bg-white shadow rounded-2xl p-6 flex flex-col items-center justify-center">
      <h3 className="text-sm text-slate-500 mb-2">{title}</h3>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
