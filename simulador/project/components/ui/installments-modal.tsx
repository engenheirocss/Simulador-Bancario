import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
  const handlePrint = () => {
    window.print();
  };

  // Get current date for the report
  const currentDate = new Date().toLocaleDateString('pt-BR');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto dialog-content">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Detalhamento das Parcelas - {bankName}
          </DialogTitle>
          <div className="print-date">Data: {currentDate}</div>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Valor do imóvel</p>
              <p className="text-lg font-semibold">{formatter.format(propertyValue)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Valor da entrada</p>
              <p className="text-lg font-semibold">{formatter.format(downPayment)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Valor financiado</p>
              <p className="text-lg font-semibold">{formatter.format(loanAmount)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Taxa de juros anual</p>
              <p className="text-lg font-semibold">{percentFormatter.format(annualRate / 100)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Prazo</p>
              <p className="text-lg font-semibold">{term} meses</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Sistema de amortização</p>
              <p className="text-lg font-semibold">{system}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Tabela de Amortização</h3>
            <div className="overflow-x-auto">
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
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button 
            onClick={handlePrint} 
            className="print-button"
          >
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}