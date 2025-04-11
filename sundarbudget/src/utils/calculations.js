import stateData from "../data/stateData";

export const calculateExpenses = (state, budget, multipliers = {}) => {
  if (!state || !budget || budget <= 0) {
    return {};
  }

  const stateInfo = stateData[state];
  if (!stateInfo) {
    return {};
  }

  const expenseRatios = stateInfo.expenseRatios;
  const expenses = {};

  for (const category in expenseRatios) {
    const percentage = expenseRatios[category];
    const baseAmount = (budget * percentage) / 100;
    const multiplier = multipliers[category] || 1;

    expenses[category] = baseAmount * multiplier;
  }

  const total = Object.values(expenses).reduce((sum, expense) => sum + expense, 0);

  if (total !== budget) {
    const ratio = budget / total;
    for (const category in expenses) {
      expenses[category] *= ratio;
    }
  }

  return expenses;
};

export const getSuggestedBudget = (state, lifestyle = "moderate") => {
  if (!state || !stateData[state]) {
    return 0;
  }

  const baseBudget = {
    "minimal": 15000,
    "moderate": 30000,
    "comfortable": 50000,
    "luxury": 100000,
  };

  const stateIndex = stateData[state].costOfLivingIndex;
  const adjustedBudget = (baseBudget[lifestyle] * stateIndex) / 100;

  return Math.round(adjustedBudget);
};
