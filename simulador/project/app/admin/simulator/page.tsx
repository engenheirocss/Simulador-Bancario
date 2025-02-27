"use client";

import { useState, useEffect } from "react";
import { Building2, Info, Users, Settings, Loader2, Printer, Home } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateFinancing } from "@/lib/calculator";
import { InstallmentsModal } from "@/components/ui/installments-modal";

// Types for API responses
interface BankSimulation {
  valor_imovel: number;
  valor_entrada: number;
  valor_financiamento: number;
  prazo: number;
  sistema_amortizacao: string;
  primeira_parcela: number;
  ultima_parcela: number;
  taxa_juros_anual: number;
  taxa_juros_mensal: number;
  installments: {
    number: number;
    value: number;
    amortization: number;
    interest: number;
    balance: number;
  }[];
}

interface SimulationResults {
  [key: number]: BankSimulation | null;
}

const BANK_IDS = [1, 2, 3, 4, 5, 6];
const BANK_NAMES = {
  1: "Bradesco",
  2: "Caixa",
  3: "Itaú",
  4: "Santander",
  5: "BRB",
  6: "BRBCR"
};

// Currency formatter
const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Percentage formatter
const percentFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Function to format currency input
const formatCurrency = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  const amount = Number(numbers) / 100;
  return formatter.format(amount);
};

// Function to parse currency string to number
const parseCurrency = (value: string) => {
  return Number(value.replace(/\D/g, '')) / 100;
};

export default function AdminSimulatorPage() {
  // Initialize with zero values
  const [propertyValue, setPropertyValue] = useState("R$ 0,00");
  const [downPayment, setDownPayment] = useState("R$ 0,00");
  const [fgts, setFgts] = useState("R$ 0,00");
  const [familyIncome, setFamilyIncome] = useState("R$ 0,00");
  const [term, setTerm] = useState(360);
  const [amortizationSystem, setAmortizationSystem] = useState<"PRICE" | "SAC">("PRICE");
  const [propertyType, setPropertyType] = useState<"new" | "used">("new");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SimulationResults>({});
  const [selectedBank, setSelectedBank] = useState<number | null>(null);
  const [showInstallments, setShowInstallments] = useState(false);

  const handlePropertyValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setPropertyValue(formatCurrency(value));
  };

  const handleDownPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setDownPayment(formatCurrency(value));
  };

  const handleFgtsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setFgts(formatCurrency(value));
  };

  const handleFamilyIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setFamilyIncome(formatCurrency(value));
  };

  const handleSimulate = async () => {
    setIsLoading(true);
    setSelectedBank(null);

    try {
      const propertyValueNum = parseCurrency(propertyValue);
      const downPaymentNum = parseCurrency(downPayment);
      const fgtsNum = parseCurrency(fgts);
      const totalDownPayment = downPaymentNum + fgtsNum;

      // Simulate for each bank
      const newResults: SimulationResults = {};

      for (const bankId of BANK_IDS) {
        try {
          const result = calculateFinancing(
            propertyValueNum,
            totalDownPayment,
            term,
            bankId,
            amortizationSystem
          );

          newResults[bankId] = {
            valor_imovel: propertyValueNum,
            valor_entrada: totalDownPayment,
            valor_financiamento: propertyValueNum - totalDownPayment,
            prazo: term,
            sistema_amortizacao: amortizationSystem,
            primeira_parcela: result.monthlyPayment,
            ultima_parcela: result.installments[result.installments.length - 1].value,
            taxa_juros_anual: result.annualRate,
            taxa_juros_mensal: result.monthlyRate * 100,
            installments: result.installments
          };
        } catch (error) {
          console.error(`Error calculating for bank ${bankId}:`, error);
          newResults[bankId] = null;
        }
      }

      setResults(newResults);

      // Find the bank with the lowest first installment
      let lowestInstallment = Infinity;
      let bestBankId = null;

      for (const [bankId, result] of Object.entries(newResults)) {
        if (result && result.primeira_parcela < lowestInstallment) {
          lowestInstallment = result.primeira_parcela;
          bestBankId = Number(bankId);
        }
      }

      setSelectedBank(bestBankId);
    } catch (error) {
      console.error("Simulation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Find the bank with the lowest first installment
  const getBestOffer = () => {
    let lowestInstallment = Infinity;
    let bestBankId = null;

    for (const [bankId, result] of Object.entries(results)) {
      if (result && result.primeira_parcela < lowestInstallment) {
        lowestInstallment = result.primeira_parcela;
        bestBankId = Number(bankId);
      }
    }

    return bestBankId;
  };

  const bestOffer = getBestOffer();

  // Auto-simulate on component mount
  useEffect(() => {
    handleSimulate();
  }, []);

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
                  <div className="space-y-2">
                    <label className="text-sm">Valor do imóvel</label>
                    <Input
                      value={propertyValue}
                      onChange={handlePropertyValueChange}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Home className="w-4 h-4" />
                    <h3 className="font-medium">Imóvel</h3>
                  </div>
                  <div className="space-y-2">
                    <Tabs defaultValue={propertyType} onValueChange={(value) => setPropertyType(value as "new" | "used")}>
                      <TabsList className="grid grid-cols-2">
                        <TabsTrigger value="new">Novo</TabsTrigger>
                        <TabsTrigger value="used">Usado</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4" />
                    <h3 className="font-medium">Dados do Beneficiário</h3>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Renda Familiar</label>
                    <Input
                      value={familyIncome}
                      onChange={handleFamilyIncomeChange}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4" />
                    <h3 className="font-medium">Condição de Pagamento</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm">Valor entrada</label>
                      <Input
                        value={downPayment}
                        onChange={handleDownPaymentChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm">Valor do FGTS</label>
                      <Input
                        value={fgts}
                        onChange={handleFgtsChange}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="w-4 h-4" />
                    <h3 className="font-medium">Configurações</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm">Prazo (meses)</label>
                      <Tabs defaultValue={term.toString()} onValueChange={(value) => setTerm(Number(value))}>
                        <TabsList className="grid grid-cols-3">
                          <TabsTrigger value="420">420</TabsTrigger>
                          <TabsTrigger value="360">360</TabsTrigger>
                          <TabsTrigger value="280">280</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm">Sistema de Amortização</label>
                      <Tabs defaultValue={amortizationSystem} onValueChange={(value) => setAmortizationSystem(value as "PRICE" | "SAC")}>
                        <TabsList className="grid grid-cols-2">
                          <TabsTrigger value="PRICE">PRICE</TabsTrigger>
                          <TabsTrigger value="SAC">SAC</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full bg-[#006B54] hover:bg-[#005443]"
                  onClick={handleSimulate}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      SIMULANDO...
                    </>
                  ) : (
                    "SIMULAR PROPOSTA"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardContent className="p-0">
                {Object.keys(results).length > 0 ? (
                  <>
                    {/* Summary boxes - using the green background from the image */}
                    <div className="bg-[#3C8B77] text-white p-4 grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm mb-1">Valor total da unidade</p>
                        <p className="text-lg font-semibold">{formatter.format(parseCurrency(propertyValue))}</p>
                      </div>
                      <div>
                        <p className="text-sm mb-1">Valor proposto de entrada</p>
                        <p className="text-lg font-semibold">{formatter.format(parseCurrency(downPayment))}</p>
                      </div>
                      <div>
                        <p className="text-sm mb-1">Valor do FGTS</p>
                        <p className="text-lg font-semibold">{formatter.format(parseCurrency(fgts))}</p>
                      </div>
                      <div>
                        <p className="text-sm mb-1 flex items-center">Menor valor para 1ª parcela <span className="text-xs ml-1">*</span></p>
                        {bestOffer !== null && results[bestOffer] ? (
                          <p className="text-2xl font-bold">{formatter.format(results[bestOffer].primeira_parcela)}</p>
                        ) : (
                          <p className="text-2xl font-bold">-</p>
                        )}
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-2">Bancos financiadores</p>
                      </div>

                      {/* Bank names */}
                      <div className="grid grid-cols-6 gap-4 mb-6">
                        {BANK_IDS.map((bankId) => (
                          <div 
                            key={bankId} 
                            className={`p-4 flex justify-center items-center border ${bankId === bestOffer ? 'border-[#006B54] relative shadow-lg' : 'border-gray-200'}`}
                          >
                            {bankId === bestOffer && (
                              <div className="absolute -top-3 left-0 right-0 flex justify-center">
                                <span className="bg-[#006B54] text-white text-xs px-2 py-1 rounded-sm">
                                  Melhor oferta*
                                </span>
                              </div>
                            )}
                            <p className={`text-xl font-bold ${bankId === bestOffer ? 'text-[#006B54]' : 'text-gray-700'}`}>
                              {BANK_NAMES[bankId as keyof typeof BANK_NAMES]}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Acquisition section */}
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Aquisição PR-SFH</p>
                      </div>

                      {/* Table with data */}
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <tbody>
                            <tr className="border-b">
                              <td className="py-2 text-sm">Valor do imóvel</td>
                              {BANK_IDS.map((bankId) => (
                                <td key={bankId} className="py-2 text-right pr-4">
                                  {results[bankId] ? formatter.format(results[bankId]!.valor_imovel) : "-"}
                                </td>
                              ))}
                            </tr>
                            <tr className="border-b">
                              <td className="py-2 text-sm">(-) Entrada + FGTS</td>
                              {BANK_IDS.map((bankId) => (
                                <td key={bankId} className="py-2 text-right pr-4">
                                  {results[bankId] ? formatter.format(results[bankId]!.valor_entrada) : "-"}
                                </td>
                              ))}
                            </tr>
                            <tr className="border-b">
                              <td className="py-2 text-sm">(-) Valor do financiamento</td>
                              {BANK_IDS.map((bankId) => (
                                <td key={bankId} className="py-2 text-right pr-4">
                                  {results[bankId] ? formatter.format(results[bankId]!.valor_financiamento) : "-"}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Parcelas section */}
                      <div className="mt-6 mb-2">
                        <p className="text-sm font-medium">Parcelas</p>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <tbody>
                            <tr className="border-b">
                              <td className="py-2 text-sm">Prazo (meses)</td>
                              {BANK_IDS.map((bankId) => (
                                <td key={bankId} className="py-2 text-right pr-4">
                                  {results[bankId] ? results[bankId]!.prazo : "-"}
                                </td>
                              ))}
                            </tr>
                            <tr className="border-b">
                              <td className="py-2 text-sm">Sistema de amortização</td>
                              {BANK_IDS.map((bankId) => (
                                <td key={bankId} className="py-2 text-right pr-4">
                                  {results[bankId] ? results[bankId]!.sistema_amortizacao : "-"}
                                </td>
                              ))}
                            </tr>
                            <tr className="border-b">
                              <td className="py-2 text-sm">Primeira parcela*</td>
                              {BANK_IDS.map((bankId) => (
                                <td key={bankId} className={`py-2 text-right pr-4 ${bankId === bestOffer ? 'font-bold' : ''}`}>
                                  {results[bankId] ? formatter.format(results[bankId]!.primeira_parcela) : "-"}
                                </td>
                              ))}
                            </tr>
                            <tr className="border-b">
                              <td className="py-2 text-sm">Última parcela*</td>
                              {BANK_IDS.map((bankId) => (
                                <td key={bankId} className="py-2 text-right pr-4">
                                  {results[bankId] ? formatter.format(results[bankId]!.ultima_parcela) : "-"}
                                </td>
                              ))}
                            </tr>
                            <tr className="border-b">
                              <td className="py-2 text-sm">Parcelas</td>
                              {BANK_IDS.map((bankId) => (
                                <td key={bankId} className="py-2 text-right pr-4">
                                  <Button 
                                    variant="link" 
                                    className="text-[#006B54] p-0 h-auto text-sm installment-button"
                                    onClick={() => {
                                      setSelectedBank(bankId);
                                      setShowInstallments(true);
                                    }}
                                    disabled={!results[bankId]}
                                  >
                                    Ver todas as parcelas
                                  </Button>
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Juros section */}
                      <div className="mt-6 mb-2">
                        <p className="text-sm font-medium">Juros</p>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <tbody>
                            <tr className="border-b">
                              <td className="py-2 text-sm">Taxa de juros anual (CET - Custo Efetivo Total)</td>
                              {BANK_IDS.map((bankId) => (
                                <td key={bankId} className="py-2 text-right pr-4">
                                  {results[bankId] ? percentFormatter.format(results[bankId]!.taxa_juros_anual / 100) : "-"}
                                </td>
                              ))}
                            </tr>
                            <tr className="border-b">
                              <td className="py-2 text-sm">Taxa de juros mensal</td>
                              {BANK_IDS.map((bankId) => (
                                <td key={bankId} className="py-2 text-right pr-4">
                                  {results[bankId] ? percentFormatter.format(results[bankId]!.taxa_juros_mensal / 100) : "-"}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-gray-500 p-4">
                    <Building2 className="w-16 h-16 mb-4" />
                    <p className="text-lg">Preencha os dados e clique em "Simular Proposta"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {selectedBank !== null && showInstallments && results[selectedBank] && (
        <InstallmentsModal
          isOpen={showInstallments}
          onClose={() => setShowInstallments(false)}
          bankName={BANK_NAMES[selectedBank as keyof typeof BANK_NAMES]}
          propertyValue={results[selectedBank]!.valor_imovel}
          loanAmount={results[selectedBank]!.valor_financiamento}
          downPayment={results[selectedBank]!.valor_entrada}
          term={results[selectedBank]!.prazo}
          system={results[selectedBank]!.sistema_amortizacao as "PRICE" | "SAC"}
          annualRate={results[selectedBank]!.taxa_juros_anual}
          installments={results[selectedBank]!.installments}
        />
      )}
    </main>
  );
}