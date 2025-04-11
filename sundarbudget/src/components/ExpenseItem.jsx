import React, { useState } from "react";

function ExpenseItem({ category, label, amount, percentage, onExpenseChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(amount || 0);

  const handleEdit = () => {
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

  const formattedAmount = amount !== undefined ? amount.toLocaleString("en-IN") : "0";

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
