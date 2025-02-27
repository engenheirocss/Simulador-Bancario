"use client";

import { useState } from "react";
import { Building2, Info } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SimulatorPage() {
  const [propertyValue, setPropertyValue] = useState("2000000.00");
  const [income, setIncome] = useState("450000.00");
  const [downPayment, setDownPayment] = useState("450000.00");
  const [fgts, setFgts] = useState("0.00");

  return (
    <main className="min-h-screen bg-[#f5f5f5] p-4">
      <div className="max-w-[1200px] mx-auto">
        <div className="bg-[#006B54] text-white p-4 mb-4 rounded-sm">
          <h1 className="text-lg font-medium">ASSISTENTE DE SIMULAÇÃO DE CRÉDITO</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[300px,1fr] gap-4">
          <div className="space-y-4">
            <Card>
              <CardHeader className="bg-[#006B54] text-white p-4">
                <CardTitle className="text-lg">Simulador</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4" />
                    <h3 className="font-medium">Dados do Imóvel</h3>
                  </div>
                  <div className="border p-3 rounded-md mb-4">
                    <p className="text-sm text-gray-600 mb-2">UNIDADE: 2001</p>
                    <p className="text-sm text-gray-600">RESIDENCIAL LOFT</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Valor do imóvel</label>
                    <Input
                      value={propertyValue}
                      onChange={(e) => setPropertyValue(e.target.value)}
                      prefix="R$"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Dados do beneficiário</h3>
                  <div className="space-y-2">
                    <label className="text-sm">Renda Familiar</label>
                    <Input
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                      prefix="R$"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Condição de Pagamento</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm">Valor entrada</label>
                      <Input
                        value={downPayment}
                        onChange={(e) => setDownPayment(e.target.value)}
                        prefix="R$"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm">Valor do FGTS</label>
                      <Input
                        value={fgts}
                        onChange={(e) => setFgts(e.target.value)}
                        prefix="R$"
                      />
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-[#006B54] hover:bg-[#005443]">
                  SIMULAR PROPOSTA
                </Button>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader className="bg-gray-100 p-4">
                <div className="flex justify-between items-center">
                  <Tabs defaultValue="360x">
                    <TabsList>
                      <TabsTrigger value="420x">420x</TabsTrigger>
                      <TabsTrigger value="360x">360x</TabsTrigger>
                      <TabsTrigger value="300x">300x</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <Info className="w-5 h-5 text-gray-500" />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-[#3C8B77] text-white p-4 rounded">
                    <p className="text-sm mb-1">Valor total da unidade</p>
                    <p className="text-lg font-semibold">R$ 2.000.000,00</p>
                  </div>
                  <div className="bg-[#3C8B77] text-white p-4 rounded">
                    <p className="text-sm mb-1">Valor proposto de entrada</p>
                    <p className="text-lg font-semibold">R$ 450.000,00</p>
                  </div>
                  <div className="bg-[#3C8B77] text-white p-4 rounded">
                    <p className="text-sm mb-1">Valor do FGTS</p>
                    <p className="text-lg font-semibold">R$ 0,00</p>
                  </div>
                  <div className="bg-[#3C8B77] text-white p-4 rounded">
                    <p className="text-sm mb-1">Menor valor para 1ª prestação</p>
                    <p className="text-lg font-semibold">R$ 13.419,46</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((bank) => (
                      <Card key={bank} className="border-2 border-gray-200">
                        <CardContent className="p-4">
                          <div className="h-[200px] flex items-center justify-center">
                            <p className="text-gray-400">Banco {bank}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">Valor do imóvel</td>
                        <td className="py-2">R$ 2.000.000,00</td>
                        <td className="py-2">R$ 2.000.000,00</td>
                        <td className="py-2">R$ 2.000.000,00</td>
                        <td className="py-2">R$ 2.000.000,00</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Prazo (meses)</td>
                        <td className="py-2">360</td>
                        <td className="py-2">360</td>
                        <td className="py-2">360</td>
                        <td className="py-2">360</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Sistema de amortização</td>
                        <td className="py-2">PRICE</td>
                        <td className="py-2">PRICE</td>
                        <td className="py-2">PRICE</td>
                        <td className="py-2">PRICE</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Taxa de juros anual (CET)</td>
                        <td className="py-2">10,65%</td>
                        <td className="py-2">10,31%</td>
                        <td className="py-2">10,45%</td>
                        <td className="py-2">10,45%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Taxa de juros mensal</td>
                        <td className="py-2">0,85%</td>
                        <td className="py-2">0,82%</td>
                        <td className="py-2">0,83%</td>
                        <td className="py-2">0,83%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}