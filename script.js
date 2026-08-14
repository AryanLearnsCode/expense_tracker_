const form = document.getElementById("expense-form");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const list = document.getElementById("expense-list");
const balance = document.getElementById("balance");

let total = 0;
let expenses = [];

// Safely read expenses from localStorage (won't crash the app if storage is blocked)
function getStoredExpenses() {
    try {
        const saved = localStorage.getItem("expenses");
        return saved ? JSON.parse(saved) : [];
    } catch (err) {
        console.error("Could not read from localStorage:", err);
        return [];
    }
}

// Safely write expenses to localStorage
function saveExpenses() {
    try {
        localStorage.setItem("expenses", JSON.stringify(expenses));
    } catch (err) {
        console.error("Could not save to localStorage:", err);
    }
}

// Build the <li> for one expense and wire up its delete button
function renderExpense(expense) {
    const li = document.createElement("li");
    li.dataset.id = expense.id;

    li.innerHTML = `
        ${expense.text}
        <span>₹${expense.amount}</span>
        <span class="delete">❌</span>
    `;

    li.querySelector(".delete").addEventListener("click", function () {
        total += expense.amount;
        balance.innerText = "₹" + total;

        expenses = expenses.filter(function (e) {
            return e.id !== expense.id;
        });
        saveExpenses();

        li.remove();
    });

    list.appendChild(li);
}

// Load and render whatever is already stored (runs once on page load)
function loadExpenses() {
    expenses = getStoredExpenses();

    total = 0;
    list.innerHTML = "";

    expenses.forEach(function (expense) {
        total -= expense.amount;
        renderExpense(expense);
    });

    balance.innerText = "₹" + total;
}

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const text = description.value.trim();
    const money = Number(amount.value);

    if (!text || isNaN(money)) {
        return;
    }

    const expense = {
        id: Date.now(),
        text: text,
        amount: money
    };

    expenses.push(expense);

    total -= money;
    balance.innerText = "₹" + total;

    // Render first so the UI always updates, even if saving fails
    renderExpense(expense);
    saveExpenses();

    form.reset();
    description.focus();
});

loadExpenses();