import React, { useState } from "react";

function BudgetInput({ onBudgetChange, costOfLivingIndex, stateName }) {
  const [budgetInput, setBudgetInput] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    const budget = parseFloat(budgetInput);
    if (!isNaN(budget) && budget > 0) {
      onBudgetChange(budget);
    }
  };

  return (
    <div className="budget-input-section">
      <h2>Enter Your Monthly Budget</h2>
      <p className="cost-index-info">
        {stateName} has a cost of living index of {costOfLivingIndex} (where 100 is the national average)
      </p>

      <form onSubmit={handleSubmit} className="budget-form">
        <div className="input-group">
          <div className="rupee-input">
            <span className="rupee-symbol">₹</span>
            <input type="number" value={budgetInput} onChange={e => setBudgetInput(e.target.value)} placeholder="Enter amount in INR" min="1000" />
          </div>
        </div>
        <button type="submit" className="calculate-btn">
          Calculate
        </button>
      </form>
    </div>
  );
}

export default BudgetInput;
