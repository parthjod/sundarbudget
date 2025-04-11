import React from "react";
import ExpenseItem from "./ExpenseItem";

function ExpenseBreakdown({ expenses, onExpenseChange, budget }) {
  const categories = {
    housing: "Housing/Rent",
    food: "Food & Groceries",
    transportation: "Transportation",
    utilities: "Utilities",
    healthcare: "Healthcare",
    entertainment: "Entertainment",
    others: "Other Expenses",
  };

  // Use a default value of 0 for any undefined expense values
  const safeExpenses = {};
  Object.keys(categories).forEach(category => {
    safeExpenses[category] = expenses[category] || 0;
  });

  // Calculate total expenses safely
  const totalExpenses = Object.values(safeExpenses).reduce((sum, expense) => sum + expense, 0);
  const remaining = budget - totalExpenses;

  return (
    <div className="expense-breakdown">
      <h2>Monthly Expense Breakdown</h2>

      <div className="budget-summary">
        <div className="budget-total">
          <p>Total Budget</p>
          <p className="amount">₹{budget.toLocaleString("en-IN")}</p>
        </div>
        <div className="budget-remaining">
          <p>Remaining</p>
          <p className={`amount ${remaining < 0 ? "negative" : ""}`}>₹{remaining.toLocaleString("en-IN")}</p>
        </div>
      </div>

      <div className="expense-list">
        {Object.entries(categories).map(([category, label]) => (
          <ExpenseItem key={category} category={category} label={label} amount={safeExpenses[category]} percentage={(safeExpenses[category] / budget) * 100} onExpenseChange={onExpenseChange} />
        ))}
      </div>
    </div>
  );
}

export default ExpenseBreakdown;
