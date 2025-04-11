import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import BudgetInput from "./components/BudgetInput";
import ExpenseBreakdown from "./components/ExpenseBreakdown";
import { calculateExpenses } from "./utils/calculations";
import stateData from "./data/stateData";

function App() {
  const [selectedState, setSelectedState] = useState("");
  const [budget, setBudget] = useState(0);
  const [expenses, setExpenses] = useState({
    housing: 0,
    food: 0,
    transportation: 0,
    utilities: 0,
    healthcare: 0,
    entertainment: 0,
    others: 0,
  });
  const [expenseMultipliers, setExpenseMultipliers] = useState({
    housing: 1,
    food: 1,
    transportation: 1,
    utilities: 1,
    healthcare: 1,
    entertainment: 1,
    others: 1,
  });

  useEffect(() => {
    if (selectedState && budget > 0) {
      const newExpenses = calculateExpenses(selectedState, budget, expenseMultipliers);
      setExpenses(prev => ({
        housing: newExpenses.housing || 0,
        food: newExpenses.food || 0,
        transportation: newExpenses.transportation || 0,
        utilities: newExpenses.utilities || 0,
        healthcare: newExpenses.healthcare || 0,
        entertainment: newExpenses.entertainment || 0,
        others: newExpenses.others || 0,
      }));
    }
  }, [selectedState, budget, expenseMultipliers]);

  const handleStateChange = event => {
    setSelectedState(event.target.value);
  };

  const handleBudgetChange = newBudget => {
    setBudget(newBudget);
  };

  const handleExpenseChange = (category, value) => {
    const newExpense = parseFloat(value) || 0;
    const oldExpense = expenses[category] || 0;
    const difference = newExpense - oldExpense;

    const currentTotal = Object.values(expenses).reduce((sum, exp) => sum + (exp || 0), 0);

    if (difference > 0 && currentTotal + difference > budget) {
      alert("Total expenses cannot exceed budget!");
      return;
    }

    const newExpenses = { ...expenses, [category]: newExpense };

    if (selectedState && budget > 0) {
      const stateExpenseData = stateData[selectedState].expenseRatios;
      const baseExpense = (budget * stateExpenseData[category]) / 100;
      if (baseExpense > 0) {
        const newMultiplier = newExpense / baseExpense;

        setExpenseMultipliers({
          ...expenseMultipliers,
          [category]: newMultiplier,
        });
      }
    }

    if (difference < 0 && selectedState) {
      const redistributeAmount = Math.abs(difference);
      let remainingCategories = Object.keys(expenses).filter(cat => cat !== category);

      if (remainingCategories.length > 0 && stateData[selectedState]) {
        const stateExpenseData = stateData[selectedState].expenseRatios;
        const totalRemainingRatio = remainingCategories.reduce((sum, cat) => sum + stateExpenseData[cat], 0);

        if (totalRemainingRatio > 0) {
          remainingCategories.forEach(cat => {
            const proportion = stateExpenseData[cat] / totalRemainingRatio;
            newExpenses[cat] += redistributeAmount * proportion;
          });
        }
      }
    } else if (difference > 0) {
      const reduceAmount = difference;
      let remainingCategories = Object.keys(expenses).filter(cat => cat !== category);
      const totalRemainingExpense = remainingCategories.reduce((sum, cat) => sum + (newExpenses[cat] || 0), 0);

      if (totalRemainingExpense > 0) {
        remainingCategories.forEach(cat => {
          const proportion = (newExpenses[cat] || 0) / totalRemainingExpense;
          newExpenses[cat] -= reduceAmount * proportion;
          if (newExpenses[cat] < 0) newExpenses[cat] = 0;
        });
      }
    }

    setExpenses(newExpenses);
  };

  const states = Object.keys(stateData);

  return (
    <div className="app-container">
      <Header />

      <div className="main-content">
        <div className="state-selector">
          <label>Select State:</label>
          <select value={selectedState} onChange={handleStateChange}>
            <option value="">Select a state...</option>
            {states.map(state => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {selectedState && <BudgetInput onBudgetChange={handleBudgetChange} costOfLivingIndex={stateData[selectedState].costOfLivingIndex} stateName={selectedState} />}

        {selectedState && budget > 0 && <ExpenseBreakdown expenses={expenses} onExpenseChange={handleExpenseChange} budget={budget} />}
      </div>
    </div>
  );
}

export default App;
