import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Printer } from "lucide-react";

interface InstallmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bankName: string;
  propertyValue: number;
  loanAmount: number;
  downPayment: number;
  term: number;
  system: "PRICE" | "SAC";
  annualRate: number;
  installments: {
    number: number;
    value: number;
    amortization: number;
    interest: number;
    balance: number;
  }[];
}

export function InstallmentsModal({
  isOpen,
  onClose,
  bankName,
  propertyValue,
  loanAmount,
  downPayment,
  term,
  system,
  annualRate,
  installments,
}: InstallmentsModalProps) {
  const [activeTab, setActiveTab] = useState<"table" | "graph">("table");
  
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  const percentFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  const handlePrint = () => {
    window.print();
  };
  
  // Calculate totals
  const totalPaid = installments.reduce((sum, inst) => sum + inst.value, 0);
  const totalInterest = installments.reduce((sum, inst) => sum + inst.interest, 0);
  const totalAmortization = installments.reduce((sum, inst) => sum + inst.amortization, 0);
  
  // Get current date for print
  const currentDate = new Date().toLocaleDateString('pt-BR');
  const currentTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto dialog-content">
        <DialogHeader>
          <DialogTitle className="text-xl">Detalhamento das Parcelas - {bankName}</DialogTitle>
          <Button 
            onClick={handlePrint} 
            className="absolute right-4 top-4 print-button"
            size="sm"
          >
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
        </DialogHeader>
        
        <div className="print-date">
          {currentDate}, {currentTime}
        </div>
        <div className="print-header">
          PARCELAS {bankName.toUpperCase()}
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-100 p-4 rounded-md">
            <p className="text-sm text-gray-600 mb-1">Valor do imóvel</p>
            <p className="text-lg font-semibold">{formatter.format(propertyValue)}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-md">
            <p className="text-sm text-gray-600 mb-1">Valor financiado</p>
            <p className="text-lg font-semibold">{formatter.format(loanAmount)}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-md">
            <p className="text-sm text-gray-600 mb-1">Entrada</p>
            <p className="text-lg font-semibold">{formatter.format(downPayment)}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-100 p-4 rounded-md">
            <p className="text-sm text-gray-600 mb-1">Prazo</p>
            <p className="text-lg font-semibold">{term} meses</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-md">
            <p className="text-sm text-gray-600 mb-1">Sistema</p>
            <p className="text-lg font-semibold">{system}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-md">
            <p className="text-sm text-gray-600 mb-1">Taxa anual</p>
            <p className="text-lg font-semibold">{percentFormatter.format(annualRate / 100)}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-md">
            <p className="text-sm text-gray-600 mb-1">Primeira parcela</p>
            <p className="text-lg font-semibold">{formatter.format(installments[0]?.value || 0)}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-[#006B54] text-white p-4 rounded-md">
            <p className="text-sm mb-1">Total pago</p>
            <p className="text-lg font-semibold">{formatter.format(totalPaid)}</p>
          </div>
          <div className="bg-[#006B54] text-white p-4 rounded-md">
            <p className="text-sm mb-1">Total de juros</p>
            <p className="text-lg font-semibold">{formatter.format(totalInterest)}</p>
          </div>
          <div className="bg-[#006B54] text-white p-4 rounded-md">
            <p className="text-sm mb-1">Total amortizado</p>
            <p className="text-lg font-semibold">{formatter.format(totalAmortization)}</p>
          </div>
        </div>
        
        <Tabs defaultValue="table" value={activeTab} onValueChange={(value) => setActiveTab(value as "table" | "graph")}>
          <TabsList className="mb-4">
            <TabsTrigger value="table">Tabela</TabsTrigger>
            <TabsTrigger value="graph">Gráfico</TabsTrigger>
          </TabsList>
          
          <TabsContent value="table" className="overflow-x-auto">
            <table className="w-full border-collapse installments-table">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left">Parcela</th>
                  <th className="py-2 px-4">Valor da Parcela</th>
                  <th className="py-2 px-4">Amortização</th>
                  <th className="py-2 px-4">Juros</th>
                  <th className="py-2 px-4">Saldo Devedor</th>
                </tr>
              </thead>
              <tbody>
                {installments.map((installment) => (
                  <tr key={installment.number} className="border-b">
                    <td className="py-2 px-4">{installment.number}</td>
                    <td className="py-2 px-4">{formatter.format(installment.value)}</td>
                    <td className="py-2 px-4">{formatter.format(installment.amortization)}</td>
                    <td className="py-2 px-4">{formatter.format(installment.interest)}</td>
                    <td className="py-2 px-4">{formatter.format(installment.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TabsContent>
          
          <TabsContent value="graph">
            <div className="h-[400px] flex items-center justify-center">
              <p className="text-gray-500">Gráfico de evolução das parcelas</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}