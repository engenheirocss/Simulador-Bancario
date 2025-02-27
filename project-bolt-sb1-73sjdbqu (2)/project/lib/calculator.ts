// Financing calculator utility functions

export interface FinancingResult {
  bankName: string;
  annualRate: number;
  monthlyRate: number;
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
  installments: {
    number: number;
    value: number;
    amortization: number;
    interest: number;
    balance: number;
  }[];
}

// Current SELIC rate
const SELIC_RATE = 10.75;

// Bank-specific rates based on SELIC + spread
export const BANK_RATES = {
  1: { // Bradesco
    baseRate: SELIC_RATE + 0.94, // 11.69%
    minDownPayment: 0.20,
    maxTerm: 420,
  },
  2: { // Caixa
    baseRate: SELIC_RATE + 0.24, // 10.99%
    minDownPayment: 0.20,
    maxTerm: 420,
  },
  3: { // Itaú
    baseRate: SELIC_RATE + 0.94, // 11.69%
    minDownPayment: 0.20,
    maxTerm: 360,
  },
  4: { // Santander
    baseRate: SELIC_RATE + 1.24, // 11.99%
    minDownPayment: 0.20,
    maxTerm: 420,
  }
};

export function calculateMonthlyRate(annualRate: number): number {
  // Convert annual rate to monthly rate
  return Math.pow(1 + (annualRate / 100), 1/12) - 1;
}

export function calculatePRICEPayment(
  loanAmount: number,
  monthlyRate: number,
  termInMonths: number
): number {
  const numerator = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termInMonths);
  const denominator = Math.pow(1 + monthlyRate, termInMonths) - 1;
  return numerator / denominator;
}

export function calculateSACPayment(
  loanAmount: number,
  monthlyRate: number,
  termInMonths: number,
  currentMonth: number
): number {
  const amortization = loanAmount / termInMonths;
  const remainingBalance = loanAmount - (amortization * (currentMonth - 1));
  const interest = remainingBalance * monthlyRate;
  return amortization + interest;
}

export function calculateInstallments(
  loanAmount: number,
  monthlyRate: number,
  termInMonths: number,
  system: 'PRICE' | 'SAC'
) {
  const installments = [];
  let balance = loanAmount;
  const amortization = system === 'SAC' ? loanAmount / termInMonths : 0;
  const pricePayment = system === 'PRICE' ? calculatePRICEPayment(loanAmount, monthlyRate, termInMonths) : 0;

  for (let i = 1; i <= termInMonths; i++) {
    const interest = balance * monthlyRate;
    let payment: number;
    let currentAmortization: number;

    if (system === 'PRICE') {
      payment = pricePayment;
      currentAmortization = payment - interest;
    } else { // SAC
      currentAmortization = amortization;
      payment = currentAmortization + interest;
    }

    balance = Math.max(0, balance - currentAmortization);

    installments.push({
      number: i,
      value: Math.round(payment * 100) / 100,
      amortization: Math.round(currentAmortization * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      balance: Math.round(balance * 100) / 100
    });
  }

  return installments;
}

export function calculateFinancing(
  propertyValue: number,
  downPayment: number,
  termInMonths: number,
  bankId: number,
  system: 'PRICE' | 'SAC'
): FinancingResult {
  const bankConfig = BANK_RATES[bankId as keyof typeof BANK_RATES];
  
  if (!bankConfig) {
    throw new Error(`Invalid bank ID: ${bankId}`);
  }

  const loanAmount = propertyValue - downPayment;
  const annualRate = bankConfig.baseRate;
  const monthlyRate = calculateMonthlyRate(annualRate);
  const installments = calculateInstallments(loanAmount, monthlyRate, termInMonths, system);
  
  const totalPaid = installments.reduce((sum, inst) => sum + inst.value, 0);
  const totalInterest = totalPaid - loanAmount;

  return {
    bankName: getBankName(bankId),
    annualRate,
    monthlyRate,
    monthlyPayment: installments[0].value,
    totalPaid,
    totalInterest,
    installments
  };
}

// Function to check if property qualifies for Minha Casa Minha Vida
export function checkMinhaCasaMinhaVida(
  propertyValue: number,
  monthlyIncome: number,
  isNewProperty: boolean
): { qualifies: boolean; rate: number | null } {
  if (isNewProperty && propertyValue <= 350000) {
    if (monthlyIncome <= 4500) {
      return { qualifies: true, rate: 4.50 };
    } else {
      return { qualifies: true, rate: 8.66 };
    }
  } else if (!isNewProperty && propertyValue <= 264000) {
    if (monthlyIncome <= 4400) {
      return { qualifies: true, rate: 4.50 };
    } else {
      return { qualifies: true, rate: 8.66 };
    }
  }
  
  return { qualifies: false, rate: null };
}

function getBankName(bankId: number): string {
  const banks = {
    1: 'Bradesco',
    2: 'Caixa',
    3: 'Itaú',
    4: 'Santander'
  };
  return banks[bankId as keyof typeof banks] || 'Unknown Bank';
}