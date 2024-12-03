'use client'

import React, { useState, useEffect, ChangeEvent } from "react";
import { 
  Dialog, 
  DialogHeader, 
  DialogContent, 
  DialogTitle, 
  DialogFooter 
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { FilePenIcon, PlusIcon, TrashIcon, WalletIcon } from "lucide-react";

export default function ExpenseTracker() {
  type Expense = {
    id: number;
    name: string;
    amount: number;
    date: Date;
  };

  const initialExpense: Expense[] = [
    {
      id: 1,
      name: "Groceries",
      amount: 250,
      date: new Date("2024-05-15"),
    },
    {
      id: 2,
      name: "Rent",
      amount: 320,
      date: new Date("2024-06-01"),
    },
    {
      id: 3,
      name: "Utilities",
      amount: 480,
      date: new Date("2024-06-05"),
    },
    {
      id: 4,
      name: "Dining Out",
      amount: 230,
      date: new Date("2024-06-10"),
    },
  ];

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentExpenseId, setCurrentExpenseId] = useState<number | null>(null);
  const [newExpense, setNewExpense] = useState<{
    name: string;
    amount: string;
    date: Date;
  }>({
    name: "",
    amount: "",
    date: new Date(),
  });

  useEffect(() => {
    const storedExpenses = localStorage.getItem("expenses");
    if (storedExpenses) {
      setExpenses(
        JSON.parse(storedExpenses).map((expense: Expense) => ({
          ...expense,
          date: new Date(expense.date),
        }))
      );
    } else {
      setExpenses(initialExpense);
    }
  }, []);

  useEffect(() => {
    if (expenses.length > 0) {
      localStorage.setItem("expenses", JSON.stringify(expenses));
    }
  }, [expenses]);

  const handleAddExpense = (): void => {
    setExpenses([
      ...expenses,
      {
        id: expenses.length + 1,
        name: newExpense.name,
        amount: parseFloat(newExpense.amount),
        date: new Date(newExpense.date),
      },
    ]);
    resetForm();
    setShowModal(false);
  };

  const handleEditExpense = (id: number): void => {
    const expenseToEdit = expenses.find((expense) => expense.id === id);

    if (expenseToEdit) {
      setNewExpense({
        name: expenseToEdit.name,
        amount: expenseToEdit.amount.toString(),
        date: expenseToEdit.date,
      });
      setCurrentExpenseId(id);
      setIsEditing(true);
      setShowModal(true);
    }
  };

  const handleSaveEditExpense = (): void => {
    setExpenses(
      expenses.map((expense) =>
        expense.id === currentExpenseId
          ? { ...expense, ...newExpense, amount: parseFloat(newExpense.amount) }
          : expense
      )
    );
    resetForm();
    setShowModal(false);
  };

  const resetForm = (): void => {
    setNewExpense({
      name: "",
      amount: "",
      date: new Date(),
    });
    setIsEditing(false);
    setCurrentExpenseId(null);
  };

  const handleDeleteExpense = (id: number): void => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target;
    setNewExpense((prevExpense) => ({
      ...prevExpense,
      [id]:
        id === "amount"
          ? parseFloat(value)
          : id === "date"
          ? new Date(value)
          : value,
    }));
  };

  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  return (
    <div className="bg-gradient-to-br from-blue-100 via-slate-100 to-rose-100 min-h-screen">
      <div className="container mx-auto max-w-2xl">
        <header className="bg-white shadow-md rounded-b-xl p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <WalletIcon className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">Expense Tracker</h1>
            </div>
            <div className="text-2xl font-semibold text-green-600">
              Total: ${totalExpenses.toFixed(2)}
            </div>
          </div>
        </header>

        <main className="mt-8 space-y-6">
          {expenses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <p className="text-gray-500 text-lg">No expenses tracked yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div 
                  key={expense.id} 
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{expense.name}</h3>
                    <p className="text-gray-500">
                      ${expense.amount} • {expense.date.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-blue-500 hover:bg-blue-50"
                      onClick={() => handleEditExpense(expense.id)}
                    >
                      <FilePenIcon className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:bg-red-50"
                      onClick={() => handleDeleteExpense(expense.id)}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        <div className="fixed bottom-8 right-8">
          <Button 
            className="rounded-full bg-blue-600 hover:bg-blue-700 shadow-xl transform hover:scale-110 transition-transform duration-300" 
            size="icon"
            onClick={() => {
              setShowModal(true);
              setIsEditing(false);
              resetForm();
            }}
          >
            <PlusIcon className="w-6 h-6 text-white" />
          </Button>
        </div>

        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800">
                {isEditing ? "Edit Expense" : "Add New Expense"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-700">Expense Name</Label>
                <Input 
                  id="name" 
                  value={newExpense.name} 
                  onChange={handleInputChange}
                  className="mt-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
              </div>
              <div>
                <Label htmlFor="amount" className="text-gray-700">Amount</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  value={newExpense.amount} 
                  onChange={handleInputChange}
                  className="mt-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
              </div>
              <div>
                <Label htmlFor="date" className="text-gray-700">Date</Label>
                <Input 
                  id="date" 
                  type="date" 
                  value={newExpense.date.toISOString().slice(0, 10)} 
                  onChange={handleInputChange}
                  className="mt-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button 
                variant="outline" 
                className="mr-2 text-gray-600 hover:bg-gray-100"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={isEditing ? handleSaveEditExpense : handleAddExpense}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isEditing ? "Save Changes" : "Add Expense"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}