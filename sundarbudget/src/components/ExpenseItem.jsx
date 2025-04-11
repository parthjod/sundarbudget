import React, { useState } from "react";

function ExpenseItem({ category, label, amount, percentage, onExpenseChange }) {
  const [isEditing, setIsEditing] = useState(false);
  // Initialize editValue safely with amount or 0 if amount is undefined
  const [editValue, setEditValue] = useState(amount || 0);

  const handleEdit = () => {
    // Make sure we have a valid number for editValue
    setEditValue(amount ? amount.toFixed(0) : "0");
    setIsEditing(true);
  };

  const handleSave = () => {
    const numValue = parseFloat(editValue);
    if (!isNaN(numValue) && numValue >= 0) {
      onExpenseChange(category, numValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = e => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  // Make sure amount is defined before using toLocaleString
  const formattedAmount = amount !== undefined ? amount.toLocaleString("en-IN") : "0";
  // Use a default value of 0 for percentage if it's undefined
  const formattedPercentage = percentage !== undefined ? percentage.toFixed(1) : "0.0";

  return (
    <div className="expense-item">
      <div className="expense-details">
        <p className="expense-name">{label}</p>
        <p className="expense-percentage">{formattedPercentage}% of budget</p>
      </div>

      <div className="expense-amount">
        {isEditing ? (
          <div className="expense-edit">
            <span className="rupee-symbol">₹</span>
            <input type="number" value={editValue} onChange={e => setEditValue(e.target.value)} onKeyDown={handleKeyDown} min="0" autoFocus />
            <button onClick={handleSave} className="save-btn">
              Save
            </button>
          </div>
        ) : (
          <>
            <p>₹{formattedAmount}</p>
            <button onClick={handleEdit} className="edit-btn">
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ExpenseItem;
