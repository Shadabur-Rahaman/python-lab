export interface ProjectMilestone {
  index: number;
  title: string;
  objective: string;
  instructions: string;
  starter: string;
  solution: string;
  expectedBehavior: string;
  testSuite: string; // Python assertion test code executed in Pyodide
  testCasesDescription: string[];
  hints: [string, string, string]; // 3-level progressive hints
  explanation: string;
  hinglishTip?: string;
}

export interface StudioProject {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedMinutes: number;
  chapters: number[]; // prerequisite chapters
  category: 'Foundations' | 'Automation & Data' | 'Application Logic';
  brief: {
    scenario: string;
    whatYouWillBuild: string;
    requiredKnowledge: string[];
    expectedOutcome: string;
    sampleInputOutput: { input?: string; output: string };
  };
  milestones: ProjectMilestone[];
  finalSolution: string;
  sampleData?: { filename: string; content: string };
  readmeTemplate: string;
}

export const studioProjects: StudioProject[] = [
  {
    id: 'expense-tracker-pro',
    title: 'Personal Expense & Budget Tracker',
    difficulty: 'Intermediate',
    estimatedMinutes: 30,
    chapters: [4, 7, 9, 10, 12],
    category: 'Application Logic',
    brief: {
      scenario: 'You want to track your everyday spending across categories like Food, Books, Travel, and Utilities. Rather than letting money vanish, this console application validates incoming expense transactions, calculates totals per category, detects overspending against a monthly budget limit, and generates a clean financial summary.',
      whatYouWillBuild: 'A modular expense tracking library with record ingestion, category aggregation, budget threshold checking, and formatted analytical summaries.',
      requiredKnowledge: ['Dictionaries & Lists', 'Defensive Type Checking (ValueError)', 'Loops & String Formatting', 'max() with key selector'],
      expectedOutcome: 'A complete Python application that accurately groups transactions, finds the biggest spending category, warns when over budget, and handles invalid amounts gracefully.',
      sampleInputOutput: {
        output: 'Total Spent: ₹220.00\nTop Category: Books (₹120.00)\nRemaining Budget: -₹20.00 (OVER BUDGET)\nBreakdown: Food: ₹60.00, Travel: ₹40.00, Books: ₹120.00',
      },
    },
    sampleData: {
      filename: 'expenses.json',
      content: '[\n  {"category": "Food", "amount": 25.5, "description": "Lunch"},\n  {"category": "Travel", "amount": 40.0, "description": "Metro"},\n  {"category": "Food", "amount": 34.5, "description": "Dinner"},\n  {"category": "Books", "amount": 120.0, "description": "Python Book"}\n]',
    },
    milestones: [
      {
        index: 1,
        title: 'Milestone 1: Ingestion & Defensive Validation',
        objective: 'Implement add_expense(expenses, category, amount, description) to validate records.',
        instructions: 'Define add_expense(expenses: list, category: str, amount: float, description: str = ""). Strip whitespace from category and format it with .title(). Verify amount is a positive number (int or float > 0). If category is empty or amount is invalid, raise ValueError. Append {"category": ..., "amount": round(float(amount), 2), "description": description.strip()} to expenses and return it.',
        starter: 'def add_expense(expenses: list, category: str, amount: float, description: str = "") -> dict:\n    # Validate and append record\n    pass',
        solution: 'def add_expense(expenses: list, category: str, amount: float, description: str = "") -> dict:\n    if not isinstance(category, str) or not category.strip():\n        raise ValueError("Invalid category")\n    if not isinstance(amount, (int, float)) or amount <= 0:\n        raise ValueError("Amount must be positive")\n    record = {\n        "category": category.strip().title(),\n        "amount": round(float(amount), 2),\n        "description": description.strip()\n    }\n    expenses.append(record)\n    return record',
        expectedBehavior: 'Appends clean title-cased records; raises ValueError on negative amounts or blank categories.',
        testSuite: `
records = []
r1 = add_expense(records, "food", 25.5, "Lunch")
assert r1["category"] == "Food", f"Expected Food, got {r1['category']}"
assert r1["amount"] == 25.5
assert len(records) == 1

try:
    add_expense(records, "Food", -10)
    assert False, "Should raise ValueError on negative amount"
except ValueError:
    pass

try:
    add_expense(records, "  ", 20)
    assert False, "Should raise ValueError on blank category"
except ValueError:
    pass
print("Milestone 1 tests passed!")
`,
        testCasesDescription: [
          'Appends title-cased category with rounded 2-decimal float amount',
          'Raises ValueError when amount is negative or zero',
          'Raises ValueError when category is blank or whitespace only',
        ],
        hints: [
          'Direction: Check not isinstance(category, str) or not category.strip() before processing.',
          'Specific Guidance: Use isinstance(amount, (int, float)) and amount <= 0 to validate amounts.',
          'Strong Hint: Format category with category.strip().title() and amount with round(float(amount), 2).',
        ],
        explanation: 'Defensive validation guarantees that invalid or corrupt records are caught at the door before corrupting downstream calculations.',
        hinglishTip: 'Negative ya zero amount pe turant ValueError raise karo taaki bad data list me na ghuse.',
      },
      {
        index: 2,
        title: 'Milestone 2: Category Aggregation & Top Spending',
        objective: 'Implement calculate_category_totals(expenses) and find_top_category(expenses).',
        instructions: '1) calculate_category_totals(expenses) returns a dict mapping each category to its sum of amounts, rounded to 2 decimal places. 2) find_top_category(expenses) returns a tuple (category_name, total_amount) for the category with the highest expenditure. If expenses is empty, return (None, 0.0).',
        starter: 'def calculate_category_totals(expenses: list) -> dict:\n    pass\n\ndef find_top_category(expenses: list) -> tuple:\n    pass',
        solution: 'def calculate_category_totals(expenses: list) -> dict:\n    totals = {}\n    for item in expenses:\n        cat = item["category"]\n        totals[cat] = round(totals.get(cat, 0.0) + item["amount"], 2)\n    return totals\n\ndef find_top_category(expenses: list) -> tuple:\n    if not expenses:\n        return (None, 0.0)\n    totals = calculate_category_totals(expenses)\n    top_cat = max(totals, key=totals.get)\n    return (top_cat, totals[top_cat])',
        expectedBehavior: 'Aggregates amounts per category and identifies the highest spending category.',
        testSuite: `
records = [
    {"category": "Food", "amount": 25.5},
    {"category": "Travel", "amount": 40.0},
    {"category": "Food", "amount": 34.5},
    {"category": "Books", "amount": 120.0}
]
totals = calculate_category_totals(records)
assert totals["Food"] == 60.0, f"Expected Food 60.0, got {totals.get('Food')}"
assert totals["Travel"] == 40.0
assert totals["Books"] == 120.0

top_cat, top_amt = find_top_category(records)
assert top_cat == "Books", f"Expected Books, got {top_cat}"
assert top_amt == 120.0

empty_cat, empty_amt = find_top_category([])
assert empty_cat is None and empty_amt == 0.0
print("Milestone 2 tests passed!")
`,
        testCasesDescription: [
          'Correctly sums multiple items in the same category (e.g. Food 25.5 + 34.5 = 60.0)',
          'Identifies Books as top category with 120.0',
          'Safely handles empty expenses list returning (None, 0.0)',
        ],
        hints: [
          'Direction: Loop through expenses and accumulate with totals[cat] = round(totals.get(cat, 0.0) + item["amount"], 2).',
          'Specific Guidance: Use max(totals, key=totals.get) to extract the dictionary key with the largest value.',
          'Strong Hint: Check if not expenses at the start of find_top_category to avoid max() on an empty sequence.',
        ],
        explanation: 'Using dictionaries for aggregation gives O(N) linear performance, avoiding slow repeated filtering.',
        hinglishTip: 'totals.get(cat, 0.0) use karo taaki pehle se missing keys pe KeyError na aaye.',
      },
      {
        index: 3,
        title: 'Milestone 3: Analytical Summary & Budget Alerts',
        objective: 'Implement generate_expense_report(expenses, monthly_budget) with over-budget detection.',
        instructions: 'Define generate_expense_report(expenses: list, monthly_budget: float = 1000.0) -> dict. Return a dictionary containing: "total_spent", "top_category", "remaining_budget" (budget - total_spent), "over_budget" (True if remaining_budget < 0), and "category_totals". If expenses is empty, return total_spent 0.0, top_category None, remaining_budget monthly_budget, over_budget False.',
        starter: 'def generate_expense_report(expenses: list, monthly_budget: float = 1000.0) -> dict:\n    pass',
        solution: 'def generate_expense_report(expenses: list, monthly_budget: float = 1000.0) -> dict:\n    if not expenses:\n        return {\n            "total_spent": 0.0,\n            "top_category": None,\n            "remaining_budget": round(float(monthly_budget), 2),\n            "over_budget": False,\n            "category_totals": {}\n        }\n    cat_totals = calculate_category_totals(expenses)\n    total_spent = round(sum(item["amount"] for item in expenses), 2)\n    top_cat, _ = find_top_category(expenses)\n    remaining = round(monthly_budget - total_spent, 2)\n    return {\n        "total_spent": total_spent,\n        "top_category": top_cat,\n        "remaining_budget": remaining,\n        "over_budget": remaining < 0,\n        "category_totals": cat_totals\n    }',
        expectedBehavior: 'Computes total spending, remaining budget, over-budget flag, and category breakdown.',
        testSuite: `
records = [
    {"category": "Food", "amount": 60.0},
    {"category": "Travel", "amount": 40.0},
    {"category": "Books", "amount": 120.0}
]
rep = generate_expense_report(records, 200.0)
assert rep["total_spent"] == 220.0, f"Expected 220.0, got {rep['total_spent']}"
assert rep["remaining_budget"] == -20.0
assert rep["over_budget"] is True
assert rep["top_category"] == "Books"

under_rep = generate_expense_report(records, 300.0)
assert under_rep["remaining_budget"] == 80.0
assert under_rep["over_budget"] is False

empty_rep = generate_expense_report([], 500.0)
assert empty_rep["total_spent"] == 0.0
assert empty_rep["remaining_budget"] == 500.0
assert empty_rep["over_budget"] is False
print("Milestone 3 tests passed!")
`,
        testCasesDescription: [
          'Calculates total spend 220.0 and remaining budget -20.0 when budget is 200.0',
          'Flags over_budget as True when expenses exceed budget',
          'Gracefully handles empty lists preserving initial budget and over_budget False',
        ],
        hints: [
          'Direction: Sum all item["amount"] values to get total_spent, then subtract from monthly_budget.',
          'Specific Guidance: over_budget is True whenever remaining < 0.',
          'Strong Hint: Round all calculated floating-point monetary values to 2 decimal places with round(..., 2).',
        ],
        explanation: 'Packaging individual operations into a unified summary function provides a clean API for user interfaces and exports.',
        hinglishTip: 'Floating-point precision issues se bachne ke liye har step pe round(..., 2) zaroor lagao.',
      },
    ],
    finalSolution: `def add_expense(expenses: list, category: str, amount: float, description: str = "") -> dict:
    if not isinstance(category, str) or not category.strip():
        raise ValueError("Invalid category")
    if not isinstance(amount, (int, float)) or amount <= 0:
        raise ValueError("Amount must be positive")
    record = {
        "category": category.strip().title(),
        "amount": round(float(amount), 2),
        "description": description.strip()
    }
    expenses.append(record)
    return record

def calculate_category_totals(expenses: list) -> dict:
    totals = {}
    for item in expenses:
        cat = item["category"]
        totals[cat] = round(totals.get(cat, 0.0) + item["amount"], 2)
    return totals

def find_top_category(expenses: list) -> tuple:
    if not expenses:
        return (None, 0.0)
    totals = calculate_category_totals(expenses)
    top_cat = max(totals, key=totals.get)
    return (top_cat, totals[top_cat])

def generate_expense_report(expenses: list, monthly_budget: float = 1000.0) -> dict:
    if not expenses:
        return {
            "total_spent": 0.0,
            "top_category": None,
            "remaining_budget": round(float(monthly_budget), 2),
            "over_budget": False,
            "category_totals": {}
        }
    cat_totals = calculate_category_totals(expenses)
    total_spent = round(sum(item["amount"] for item in expenses), 2)
    top_cat, _ = find_top_category(expenses)
    remaining = round(monthly_budget - total_spent, 2)
    return {
        "total_spent": total_spent,
        "top_category": top_cat,
        "remaining_budget": remaining,
        "over_budget": remaining < 0,
        "category_totals": cat_totals
    }

# Sample Execution
budget = 500.0
transactions = []
add_expense(transactions, "Food", 120.0, "Groceries")
add_expense(transactions, "Travel", 45.0, "Train pass")
add_expense(transactions, "Books", 210.0, "Reference texts")
add_expense(transactions, "Food", 65.0, "Cafe dinner")

summary = generate_expense_report(transactions, budget)
print(f"Total Spent: ₹{summary['total_spent']:.2f}")
print(f"Top Category: {summary['top_category']}")
print(f"Remaining: ₹{summary['remaining_budget']:.2f} (Over budget: {summary['over_budget']})")
for cat, val in summary['category_totals'].items():
    print(f" - {cat}: ₹{val:.2f}")
`,
    readmeTemplate: `# Personal Expense & Budget Tracker

A modular Python console utility to track personal finances, categorize expenditures, check budget thresholds, and generate formatted reports.

## Features
- **Defensive Ingestion**: Rejects negative amounts or invalid categories with \`ValueError\`.
- **Category Grouping**: Aggregates totals per category using dictionary accumulation.
- **Top Category Identification**: Automatically isolates the largest expenditure category.
- **Budget Alerts**: Detects whether total spending exceeds the configured monthly budget.

## Execution
Run with Python 3:
\`\`\`bash
python expense_tracker.py
\`\`\`
`,
  },

  {
    id: 'inventory-management-pro',
    title: 'Smart Inventory & Stock Analyzer',
    difficulty: 'Intermediate',
    estimatedMinutes: 30,
    chapters: [4, 6, 7, 10, 14],
    category: 'Automation & Data',
    brief: {
      scenario: 'A university campus bookstore needs to track supplies (notebooks, pens, markers). When deliveries arrive or sales occur, stock levels must update safely. The system must prevent selling more than what is in stock, alert managers when items fall below reorder thresholds, and calculate total store inventory valuation.',
      whatYouWillBuild: 'An in-memory inventory management engine with product catalog storage, stock adjustment validation, low-stock threshold alerting, and alphabetical report generation.',
      requiredKnowledge: ['Dictionary of Records', 'Defensive Type & Range Checking', 'Error Handling (KeyError, ValueError)', 'Sorting by Dictionary Keys'],
      expectedOutcome: 'A complete inventory system that tracks quantities, guards against stockouts, calculates valuation, and produces neat sorted inventory reports.',
      sampleInputOutput: {
        output: 'Marker: 2 units @ ₹30.00\nNotebook: 10 units @ ₹45.00\nPen: 7 units @ ₹15.00\nTotal Valuation: ₹615.00\nAlerts: Marker is low on stock (2 remaining)',
      },
    },
    sampleData: {
      filename: 'inventory.json',
      content: '{\n  "Notebook": {"quantity": 10, "price": 45.0},\n  "Pen": {"quantity": 3, "price": 15.0},\n  "Marker": {"quantity": 2, "price": 30.0}\n}',
    },
    milestones: [
      {
        index: 1,
        title: 'Milestone 1: Catalog Ingestion & Defensive Product Registration',
        objective: 'Implement add_product(catalog, name, quantity, price) to register items.',
        instructions: 'Define add_product(catalog: dict, name: str, quantity: int, price: float) -> dict. Validate that name is non-empty string, quantity is non-negative int (type(quantity) is int and >= 0), and price is non-negative number. If invalid, raise ValueError. Store in catalog[name.strip()] = {"quantity": quantity, "price": round(float(price), 2)} and return the product record.',
        starter: 'def add_product(catalog: dict, name: str, quantity: int, price: float) -> dict:\n    # Validate and store product\n    pass',
        solution: 'def add_product(catalog: dict, name: str, quantity: int, price: float) -> dict:\n    if not isinstance(name, str) or not name.strip():\n        raise ValueError("Product name required")\n    if type(quantity) is not int or quantity < 0:\n        raise ValueError("Quantity must be nonnegative integer")\n    if not isinstance(price, (int, float)) or price < 0:\n        raise ValueError("Price must be nonnegative number")\n    clean_name = name.strip()\n    catalog[clean_name] = {\n        "quantity": quantity,\n        "price": round(float(price), 2)\n    }\n    return catalog[clean_name]',
        expectedBehavior: 'Registers products with integer counts and floats; rejects negative counts or prices.',
        testSuite: `
cat = {}
p = add_product(cat, "Notebook", 10, 45.0)
assert p["quantity"] == 10 and p["price"] == 45.0
assert "Notebook" in cat

try:
    add_product(cat, "Pen", -2, 10.0)
    assert False, "Should reject negative quantity"
except ValueError:
    pass

try:
    add_product(cat, "Pencil", 5, -15.0)
    assert False, "Should reject negative price"
except ValueError:
    pass
print("Milestone 1 inventory tests passed!")
`,
        testCasesDescription: [
          'Adds valid product with integer quantity and rounded float price',
          'Rejects negative quantity with ValueError',
          'Rejects negative price with ValueError',
        ],
        hints: [
          'Direction: Validate name, quantity, and price types at the start before modifying catalog.',
          'Specific Guidance: Use type(quantity) is int to guard against boolean booby-traps (since isinstance(True, int) is True).',
          'Strong Hint: Return catalog[clean_name] after assignment.',
        ],
        explanation: 'Enforcing strict integer quantities prevents fractional or negative stock units from entering inventory records.',
        hinglishTip: 'Python me True bhi int hota hai, isliye type(quantity) is int check lagao.',
      },
      {
        index: 2,
        title: 'Milestone 2: Stock Updates & Low-Stock Alerts',
        objective: 'Implement update_stock(catalog, name, delta) and get_low_stock_alerts(catalog, threshold).',
        instructions: '1) update_stock(catalog: dict, name: str, delta: int) -> int: Clean name. If not in catalog, raise KeyError. If delta is not int, raise ValueError. Compute new_qty = current + delta. If new_qty < 0, raise ValueError("Insufficient stock"). Update catalog and return new_qty. 2) get_low_stock_alerts(catalog: dict, threshold: int = 5) -> list: Returns a list of {"name": item_name, "quantity": qty} for products with quantity <= threshold, sorted alphabetically by product name.',
        starter: 'def update_stock(catalog: dict, name: str, delta: int) -> int:\n    pass\n\ndef get_low_stock_alerts(catalog: dict, threshold: int = 5) -> list:\n    pass',
        solution: 'def update_stock(catalog: dict, name: str, delta: int) -> int:\n    clean_name = name.strip()\n    if clean_name not in catalog:\n        raise KeyError(f"Product not found: {clean_name}")\n    if type(delta) is not int:\n        raise ValueError("Delta must be integer")\n    new_qty = catalog[clean_name]["quantity"] + delta\n    if new_qty < 0:\n        raise ValueError(f"Insufficient stock for {clean_name}")\n    catalog[clean_name]["quantity"] = new_qty\n    return new_qty\n\ndef get_low_stock_alerts(catalog: dict, threshold: int = 5) -> list:\n    alerts = []\n    for name in sorted(catalog):\n        if catalog[name]["quantity"] <= threshold:\n            alerts.append({"name": name, "quantity": catalog[name]["quantity"]})\n    return alerts',
        expectedBehavior: 'Updates stock levels; raises ValueError on overdraft; returns sorted low-stock alerts.',
        testSuite: `
cat = {
    "Notebook": {"quantity": 10, "price": 45.0},
    "Pen": {"quantity": 3, "price": 15.0},
    "Marker": {"quantity": 2, "price": 30.0}
}
new_pen = update_stock(cat, "Pen", 4)
assert new_pen == 7 and cat["Pen"]["quantity"] == 7

try:
    update_stock(cat, "Marker", -5)
    assert False, "Should raise ValueError on insufficient stock"
except ValueError:
    pass

try:
    update_stock(cat, "Unknown", 1)
    assert False, "Should raise KeyError on missing product"
except KeyError:
    pass

alerts = get_low_stock_alerts(cat, 5)
assert len(alerts) == 1
assert alerts[0]["name"] == "Marker"
print("Milestone 2 inventory tests passed!")
`,
        testCasesDescription: [
          'Increments stock correctly (3 + 4 = 7)',
          'Raises ValueError when decreasing stock below zero',
          'Raises KeyError when product name does not exist',
          'Identifies low-stock products at or below threshold',
        ],
        hints: [
          'Direction: Check clean_name in catalog first to raise KeyError on missing products.',
          'Specific Guidance: Calculate new_qty = current + delta. If new_qty < 0, raise ValueError before mutating catalog.',
          'Strong Hint: Iterate over sorted(catalog) to ensure low-stock alerts are returned in consistent alphabetical order.',
        ],
        explanation: 'Stock adjustments must be atomic: if a transaction would cause negative inventory, reject it immediately.',
        hinglishTip: 'Missing item pe KeyError aur invalid/overdraft delta pe ValueError raise karo.',
      },
      {
        index: 3,
        title: 'Milestone 3: Inventory Valuation & Alphabetical Stock Report',
        objective: 'Implement calculate_inventory_value(catalog) and generate_stock_report(catalog).',
        instructions: '1) calculate_inventory_value(catalog: dict) -> float: Returns total value of all stock (quantity * price), rounded to 2 decimal places. 2) generate_stock_report(catalog: dict) -> list[str]: Returns formatted strings sorted alphabetically: "{name}: {qty} units @ ₹{price:.2f}", ending with a final line "Total Valuation: ₹{total:.2f}". If catalog is empty, return ["Total Valuation: ₹0.00"].',
        starter: 'def calculate_inventory_value(catalog: dict) -> float:\n    pass\n\ndef generate_stock_report(catalog: dict) -> list[str]:\n    pass',
        solution: 'def calculate_inventory_value(catalog: dict) -> float:\n    return round(sum(item["quantity"] * item["price"] for item in catalog.values()), 2)\n\ndef generate_stock_report(catalog: dict) -> list[str]:\n    lines = []\n    for name in sorted(catalog):\n        item = catalog[name]\n        lines.append(f"{name}: {item[\'quantity\']} units @ ₹{item[\'price\']:.2f}")\n    total_val = calculate_inventory_value(catalog)\n    lines.append(f"Total Valuation: ₹{total_val:.2f}")\n    return lines',
        expectedBehavior: 'Calculates total store valuation and formats sorted report lines.',
        testSuite: `
cat = {
    "Notebook": {"quantity": 10, "price": 45.0},
    "Marker": {"quantity": 2, "price": 30.0}
}
val = calculate_inventory_value(cat)
assert val == 510.0, f"Expected 510.0, got {val}"

rep = generate_stock_report(cat)
assert rep[0] == "Marker: 2 units @ ₹30.00"
assert rep[1] == "Notebook: 10 units @ ₹45.00"
assert rep[2] == "Total Valuation: ₹510.00"

empty_rep = generate_stock_report({})
assert empty_rep == ["Total Valuation: ₹0.00"]
print("Milestone 3 inventory tests passed!")
`,
        testCasesDescription: [
          'Computes overall inventory valuation: (10 * 45) + (2 * 30) = 510.0',
          'Generates report with products in alphabetical order',
          'Handles empty catalog safely producing Total Valuation: ₹0.00',
        ],
        hints: [
          'Direction: Use a generator expression sum(item["quantity"] * item["price"] for item in catalog.values()).',
          'Specific Guidance: Loop over sorted(catalog) so product names appear alphabetically.',
          'Strong Hint: Format prices and total valuation using f"{val:.2f}".',
        ],
        explanation: 'Alphabetical sorting provides predictable reporting contracts regardless of dictionary insertion order.',
        hinglishTip: 'Report hamesha sorted(catalog) se banao taaki output order consistent rahe.',
      },
    ],
    finalSolution: `def add_product(catalog: dict, name: str, quantity: int, price: float) -> dict:
    if not isinstance(name, str) or not name.strip():
        raise ValueError("Product name required")
    if type(quantity) is not int or quantity < 0:
        raise ValueError("Quantity must be nonnegative integer")
    if not isinstance(price, (int, float)) or price < 0:
        raise ValueError("Price must be nonnegative number")
    clean_name = name.strip()
    catalog[clean_name] = {
        "quantity": quantity,
        "price": round(float(price), 2)
    }
    return catalog[clean_name]

def update_stock(catalog, name: str, delta: int) -> int:
    clean_name = name.strip()
    if clean_name not in catalog:
        raise KeyError(f"Product not found: {clean_name}")
    if type(delta) is not int:
        raise ValueError("Delta must be integer")
    new_qty = catalog[clean_name]["quantity"] + delta
    if new_qty < 0:
        raise ValueError(f"Insufficient stock for {clean_name}")
    catalog[clean_name]["quantity"] = new_qty
    return new_qty

def get_low_stock_alerts(catalog: dict, threshold: int = 5) -> list:
    alerts = []
    for name in sorted(catalog):
        if catalog[name]["quantity"] <= threshold:
            alerts.append({"name": name, "quantity": catalog[name]["quantity"]})
    return alerts

def calculate_inventory_value(catalog: dict) -> float:
    return round(sum(item["quantity"] * item["price"] for item in catalog.values()), 2)

def generate_stock_report(catalog: dict) -> list[str]:
    lines = []
    for name in sorted(catalog):
        item = catalog[name]
        lines.append(f"{name}: {item['quantity']} units @ ₹{item['price']:.2f}")
    total_val = calculate_inventory_value(catalog)
    lines.append(f"Total Valuation: ₹{total_val:.2f}")
    return lines

store = {}
add_product(store, "Notebook", 10, 45.0)
add_product(store, "Pen", 3, 15.0)
add_product(store, "Marker", 2, 30.0)

print("--- Stock Report ---")
for line in generate_stock_report(store):
    print(line)

print("")
print("--- Low Stock Alerts ---")
for alert in get_low_stock_alerts(store, 5):
    print(f"Warning: {alert['name']} has only {alert['quantity']} units remaining!")
`,
    readmeTemplate: `# Smart Inventory & Stock Analyzer

An in-memory store inventory management engine written in Python 3.

## Features
- **Strict Validation**: Rejects invalid product names, negative counts, or negative prices.
- **Atomic Stock Adjustments**: Supports increasing/decreasing stock while guarding against stockout overdrafts.
- **Low-Stock Alerting**: Identifies products falling below configurable reorder thresholds.
- **Valuation Reporting**: Computes whole-store valuation and prints clean alphabetical reports.

## Running
\`\`\`bash
python inventory_manager.py
\`\`\`
`,
  },
  {
    id: 'event-scheduler-pro',
    title: 'Event Scheduling & Conflict Detection System',
    difficulty: 'Advanced',
    estimatedMinutes: 40,
    chapters: [11, 14, 15, 16],
    category: 'Application Logic',
    brief: {
      scenario: 'You are tasked with building the core scheduling engine for a conference and co-working hub. Organizers submit room reservations, tech talks, and client meetings. Without automated verification, double-booked rooms and overlapping intervals cause chaos. This system models events with defensive object validation, detects temporal collisions, sorts schedules chronologically, resolves conflicts via greedy interval scheduling, and generates formatted reports.',
      whatYouWillBuild: 'A robust scheduling engine featuring custom exceptions, encapsulated event models, interval overlap algorithms, greedy conflict-free schedule resolvers, and automated test coverage.',
      requiredKnowledge: [
        'Custom Exception Hierarchies (InvalidEventError)',
        'Class Modeling & @property getters (duration)',
        'Algorithmic Interval Overlap Math: max(start1, start2) < min(end1, end2)',
        'Sorting with Multi-Key Lambdas',
        'Greedy Earliest-End-Time Interval Scheduling',
        'Automated Test Verification with unittest',
      ],
      expectedOutcome: 'A complete Python application that models validated events, detects overlapping schedules, eliminates double bookings, and formats human-readable agenda reports.',
      sampleInputOutput: {
        output: '=== SCHEDULE REPORT ===\n09.0 - 10.0 | Keynote (Main Hall) [1.0h]\n11.0 - 12.0 | Lunch & Networking (Cafeteria) [1.0h]\nTotal Events: 2 | Conflicts Detected: 0',
      },
    },
    sampleData: {
      filename: 'events.json',
      content: '[\n  {"id": "e1", "title": "Opening Keynote", "start": 9.0, "end": 10.0, "location": "Auditorium"},\n  {"id": "e2", "title": "AI Workshop", "start": 9.5, "end": 11.0, "location": "Lab 1"},\n  {"id": "e3", "title": "Networking Lunch", "start": 11.0, "end": 12.0, "location": "Dining Hall"}\n]',
    },
    milestones: [
      {
        index: 1,
        title: 'Milestone 1: Event Data Modeling & Defensive Validation',
        objective: 'Define InvalidEventError and the Event class with validated fields and duration property.',
        instructions: 'Define InvalidEventError(ValueError). Define Event(id, title, start_time, end_time, location="TBD"). Verify id and title are non-empty strings. Cast start_time and end_time to float; verify start_time >= 0 and end_time > start_time. If any check fails, raise InvalidEventError. Store location stripped (defaulting to "TBD" if blank). Provide @property duration returning round(end_time - start_time, 2). Provide __repr__ returning f"Event(id={self.id!r}, title={self.title!r}, start={self.start_time}, end={self.end_time})".',
        starter: `class InvalidEventError(ValueError):
    pass

class Event:
    def __init__(self, id: str, title: str, start_time: float, end_time: float, location: str = "TBD"):
        # Validate inputs and initialize attributes
        pass

    @property
    def duration(self) -> float:
        pass

    def __repr__(self) -> str:
        pass`,
        solution: `class InvalidEventError(ValueError):
    pass

class Event:
    def __init__(self, id: str, title: str, start_time: float, end_time: float, location: str = "TBD"):
        if not isinstance(id, str) or not id.strip():
            raise InvalidEventError("Event ID must be a non-empty string")
        if not isinstance(title, str) or not title.strip():
            raise InvalidEventError("Event title must be a non-empty string")
        try:
            start = float(start_time)
            end = float(end_time)
        except (TypeError, ValueError):
            raise InvalidEventError("Times must be numbers")
        if start < 0:
            raise InvalidEventError("Start time cannot be negative")
        if end <= start:
            raise InvalidEventError("End time must be strictly greater than start time")

        self.id = id.strip()
        self.title = title.strip()
        self.start_time = start
        self.end_time = end
        self.location = str(location).strip() or "TBD"

    @property
    def duration(self) -> float:
        return round(self.end_time - self.start_time, 2)

    def __repr__(self) -> str:
        return f"Event(id={self.id!r}, title={self.title!r}, start={self.start_time}, end={self.end_time})"`,
        expectedBehavior: 'Creates validated Event instances with duration calculation; raises InvalidEventError on invalid bounds.',
        testSuite: `
e = Event("e1", "Sprint Planning", 9.0, 10.5, "Room 101")
assert e.id == "e1"
assert e.title == "Sprint Planning"
assert e.start_time == 9.0
assert e.end_time == 10.5
assert e.duration == 1.5
assert e.location == "Room 101"
assert repr(e) == "Event(id='e1', title='Sprint Planning', start=9.0, end=10.5)"

# Test default location
e_default = Event("e2", "Quick Sync", 14.0, 14.5)
assert e_default.location == "TBD"

# Test defensive validations
try:
    Event("", "Bad ID", 9.0, 10.0)
    assert False, "Should raise on empty ID"
except InvalidEventError:
    pass

try:
    Event("e3", "Bad Time", 10.0, 9.0)
    assert False, "Should raise when end <= start"
except InvalidEventError:
    pass

try:
    Event("e4", "Zero Duration", 10.0, 10.0)
    assert False, "Should raise on zero duration"
except InvalidEventError:
    pass

try:
    Event("e5", "Negative Start", -1.0, 2.0)
    assert False, "Should raise on negative start time"
except InvalidEventError:
    pass

assert issubclass(InvalidEventError, ValueError)
print("Milestone 1 tests passed!")
`,
        testCasesDescription: [
          'Instantiates valid Event with accurate duration and string representation',
          'Defaults location to TBD when omitted or whitespace',
          'Raises InvalidEventError when end_time <= start_time or start_time is negative',
          'Raises InvalidEventError when id or title is empty or not a string',
        ],
        hints: [
          'Derive InvalidEventError from ValueError: class InvalidEventError(ValueError): pass.',
          'Convert start and end using float(), then check start < 0 or end <= start.',
          'Compute duration as round(self.end_time - self.start_time, 2) under @property.',
        ],
        explanation: 'Enforcing invariant bounds (start >= 0 and end > start) directly inside __init__ guarantees that corrupt or backward intervals never enter the scheduling system.',
        hinglishTip: 'Event create karte waqt end_time hamesha start_time se bada hona chahiye, warna InvalidEventError raise karo.',
      },
      {
        index: 2,
        title: 'Milestone 2: Chronological Ordering & Conflict Detection',
        objective: 'Implement is_overlapping(a, b) and find_conflicts(events) to identify overlapping schedules.',
        instructions: 'Define is_overlapping(event_a: Event, event_b: Event) -> bool. Two events overlap if and only if max(a.start_time, b.start_time) < min(a.end_time, b.end_time). Note: adjacent events where event_a.end_time == event_b.start_time do NOT overlap. Define find_conflicts(events: list[Event]) -> list[tuple[Event, Event]]. Compare all unique pairs in events. If two events overlap, include them as a tuple (event_i, event_j). Return the list of conflicting pairs.',
        starter: `def is_overlapping(event_a: Event, event_b: Event) -> bool:
    # Return True if intervals overlap
    pass

def find_conflicts(events: list[Event]) -> list[tuple[Event, Event]]:
    # Find all pairs of overlapping events
    pass`,
        solution: `def is_overlapping(event_a: Event, event_b: Event) -> bool:
    return max(event_a.start_time, event_b.start_time) < min(event_a.end_time, event_b.end_time)

def find_conflicts(events: list[Event]) -> list[tuple[Event, Event]]:
    conflicts = []
    n = len(events)
    for i in range(n):
        for j in range(i + 1, n):
            if is_overlapping(events[i], events[j]):
                conflicts.append((events[i], events[j]))
    return conflicts`,
        expectedBehavior: 'Accurately flags interval overlaps while correctly treating adjacent back-to-back events as non-conflicting.',
        testSuite: `
a = Event("1", "Keynote", 9.0, 10.0)
b = Event("2", "Workshop", 9.5, 11.0)
c = Event("3", "Lunch", 10.0, 11.0)
d = Event("4", "Closing", 11.5, 12.5)

# a (9-10) and b (9.5-11) overlap
assert is_overlapping(a, b) is True

# a (9-10) and c (10-11) are adjacent; they do NOT overlap
assert is_overlapping(a, c) is False

# b (9.5-11) and c (10-11) overlap
assert is_overlapping(b, c) is True

# a and d do not overlap
assert is_overlapping(a, d) is False

conflicts = find_conflicts([a, b, c, d])
assert len(conflicts) == 2
assert (a, b) in conflicts
assert (b, c) in conflicts
assert (a, c) not in conflicts

# No conflicts in disjoint set
clean_conflicts = find_conflicts([a, c, d])
assert len(clean_conflicts) == 0

print("Milestone 2 tests passed!")
`,
        testCasesDescription: [
          'Correctly identifies partial and full overlaps between two events',
          'Recognizes that adjacent events touching at the boundary do not conflict',
          'Detects all conflicting pairs in a multi-event list',
          'Returns an empty list when all events are disjoint',
        ],
        hints: [
          'Mathematical formula for overlap: max(a.start_time, b.start_time) < min(a.end_time, b.end_time).',
          'Adjacent check: If a ends at 10.0 and b starts at 10.0, max(9, 10) < min(10, 11) -> 10 < 10 is False.',
          'Loop with nested index: for i in range(n): for j in range(i + 1, n): to check each pair once.',
        ],
        explanation: 'Using max(starts) < min(ends) is the canonical interval intersection test in computational geometry and calendar systems.',
        hinglishTip: 'Do events tab overlap hote hain jab max(start1, start2) < min(end1, end2). Agar start2 == end1 ho toh overlap nahi maana jata!',
      },
      {
        index: 3,
        title: 'Milestone 3: Schedule Manager & Greedy Conflict Resolver',
        objective: 'Implement ScheduleManager with sorted event queries and greedy conflict-free scheduling.',
        instructions: 'Define ScheduleManager class:\n1. __init__(self): initializes an internal empty list of events.\n2. add_event(self, event: Event): validates that event is an instance of Event (raise InvalidEventError otherwise) and appends it.\n3. get_events(self) -> list[Event]: returns events sorted chronologically by (start_time, end_time, title).\n4. get_conflicts(self) -> list[tuple[Event, Event]]: returns all conflicting pairs among stored events.\n5. resolve_conflicts_greedy(self) -> list[Event]: returns a maximum-size subset of mutually non-overlapping events using the greedy earliest-end-time algorithm: sort all events by end_time, then start_time; greedily select each event whose start_time >= last_selected.end_time. Return the selected events sorted by start_time.',
        starter: `class ScheduleManager:
    def __init__(self):
        # Initialize internal storage
        pass

    def add_event(self, event: Event):
        pass

    def get_events(self) -> list[Event]:
        pass

    def get_conflicts(self) -> list[tuple[Event, Event]]:
        pass

    def resolve_conflicts_greedy(self) -> list[Event]:
        pass`,
        solution: `class ScheduleManager:
    def __init__(self):
        self._events = []

    def add_event(self, event: Event):
        if not isinstance(event, Event):
            raise InvalidEventError("Expected an Event instance")
        self._events.append(event)

    def get_events(self) -> list[Event]:
        return sorted(self._events, key=lambda e: (e.start_time, e.end_time, e.title))

    def get_conflicts(self) -> list[tuple[Event, Event]]:
        return find_conflicts(self.get_events())

    def resolve_conflicts_greedy(self) -> list[Event]:
        if not self._events:
            return []
        # Sort by earliest finish time
        ordered = sorted(self._events, key=lambda e: (e.end_time, e.start_time))
        selected = []
        last_end = -1.0
        for e in ordered:
            if e.start_time >= last_end:
                selected.append(e)
                last_end = e.end_time
        return sorted(selected, key=lambda e: (e.start_time, e.end_time))`,
        expectedBehavior: 'Organizes schedule records, sorts chronologically, and resolves overlapping schedules via greedy interval selection.',
        testSuite: `
sm = ScheduleManager()
e1 = Event("1", "Morning Keynote", 9.0, 10.0, "Auditorium")
e2 = Event("2", "AI Deep Dive", 9.5, 11.5, "Hall A")
e3 = Event("3", "DevOps Talk", 10.0, 11.0, "Hall B")
e4 = Event("4", "Closing Remarks", 11.0, 12.0, "Auditorium")

sm.add_event(e4)
sm.add_event(e1)
sm.add_event(e2)
sm.add_event(e3)

# Chronological sorting check
all_evs = sm.get_events()
assert [e.id for e in all_evs] == ["1", "2", "3", "4"]

# Conflict check: e2 (9.5-11.5) overlaps with e1 (9-10) and e3 (10-11) and e4 (11-12)
conflicts = sm.get_conflicts()
assert len(conflicts) >= 2

# Greedy resolver: should select e1 (9-10), e3 (10-11), and e4 (11-12)
optimal = sm.resolve_conflicts_greedy()
assert [e.id for e in optimal] == ["1", "3", "4"]
assert len(find_conflicts(optimal)) == 0

# Test invalid event insertion
try:
    sm.add_event({"title": "Not an event"})
    assert False, "Should raise InvalidEventError on dict"
except InvalidEventError:
    pass

print("Milestone 3 tests passed!")
`,
        testCasesDescription: [
          'Appends valid events and returns chronologically sorted listings',
          'Identifies all pairwise conflicts within the manager',
          'Applies greedy interval scheduling to pick optimal non-conflicting subset',
          'Rejects non-Event objects with InvalidEventError',
        ],
        hints: [
          'Sort events in get_events() using key=lambda e: (e.start_time, e.end_time, e.title).',
          'In resolve_conflicts_greedy, sort by e.end_time first. Keep track of last_end; if e.start_time >= last_end, select it.',
          'Remember to check isinstance(event, Event) in add_event.',
        ],
        explanation: 'The greedy interval scheduling algorithm is proven optimal: by choosing events that finish earliest, it leaves maximum remaining time for subsequent events.',
        hinglishTip: 'Greedy conflict resolution me hamesha end_time ke hisaab se sort karo. Jo pehle khatam hoga, use pehle select karo taaki aage ke events ke liye time bache.',
      },
      {
        index: 4,
        title: 'Milestone 4: Formatted Reporting & Automated Verification',
        objective: 'Implement generate_schedule_report(events) and write an automated verification test suite.',
        instructions: 'Define generate_schedule_report(events: list[Event]) -> str:\n1. If events is empty, return "No events scheduled."\n2. Otherwise, produce a clean multi-line string starting with "=== SCHEDULE REPORT ===".\n3. For each event (sorted chronologically), print a line: f"{e.start_time:04.1f} - {e.end_time:04.1f} | {e.title} ({e.location}) [{e.duration}h]".\n4. Followed by a summary line: f"Total Events: {len(events)} | Conflicts Detected: {len(find_conflicts(events))}".\n5. Implement a complete demonstration and automated test verification.',
        starter: `def generate_schedule_report(events: list[Event]) -> str:
    # Format readable schedule with metrics and conflicts
    pass`,
        solution: `def generate_schedule_report(events: list[Event]) -> str:
    if not events:
        return "No events scheduled."
    sorted_events = sorted(events, key=lambda e: (e.start_time, e.end_time, e.title))
    lines = ["=== SCHEDULE REPORT ==="]
    for e in sorted_events:
        lines.append(f"{e.start_time:04.1f} - {e.end_time:04.1f} | {e.title} ({e.location}) [{e.duration}h]")
    conflicts = find_conflicts(sorted_events)
    lines.append(f"Total Events: {len(sorted_events)} | Conflicts Detected: {len(conflicts)}")
    return "\\n".join(lines)`,
        expectedBehavior: 'Generates structured schedule reports with time blocks, durations, locations, and conflict totals.',
        testSuite: `
events = [
    Event("1", "Keynote", 9.0, 10.0, "Auditorium"),
    Event("2", "Workshop", 10.0, 11.5, "Lab 2"),
]

report = generate_schedule_report(events)
assert "=== SCHEDULE REPORT ===" in report
assert "09.0 - 10.0 | Keynote (Auditorium) [1.0h]" in report
assert "10.0 - 11.5 | Workshop (Lab 2) [1.5h]" in report
assert "Total Events: 2 | Conflicts Detected: 0" in report

empty_rep = generate_schedule_report([])
assert empty_rep == "No events scheduled."

conflicting = [
    Event("1", "A", 9.0, 10.0),
    Event("2", "B", 9.5, 10.5),
]
conf_rep = generate_schedule_report(conflicting)
assert "Total Events: 2 | Conflicts Detected: 1" in conf_rep

print("Milestone 4 tests passed!")
`,
        testCasesDescription: [
          'Generates formatted text report with exact start, end, location, and duration',
          'Includes accurate count of total events and detected conflicts',
          'Handles empty schedule list gracefully',
        ],
        hints: [
          'Sort events before formatting: sorted(events, key=lambda e: (e.start_time, e.end_time, e.title)).',
          'Format hours with :04.1f (e.g. f"{e.start_time:04.1f}").',
          'Call find_conflicts(sorted_events) to calculate the conflict count.',
        ],
        explanation: 'Clean report generators provide operators with instantaneous visibility into schedule sanity, venue utilization, and double-booking risks.',
        hinglishTip: 'Report me empty list pe "No events scheduled." return karo, aur formatted lines ko "\\n".join(lines) se combine karo.',
      },
    ],
    finalSolution: `class InvalidEventError(ValueError):
    pass

class Event:
    def __init__(self, id: str, title: str, start_time: float, end_time: float, location: str = "TBD"):
        if not isinstance(id, str) or not id.strip():
            raise InvalidEventError("Event ID must be a non-empty string")
        if not isinstance(title, str) or not title.strip():
            raise InvalidEventError("Event title must be a non-empty string")
        try:
            start = float(start_time)
            end = float(end_time)
        except (TypeError, ValueError):
            raise InvalidEventError("Times must be numbers")
        if start < 0:
            raise InvalidEventError("Start time cannot be negative")
        if end <= start:
            raise InvalidEventError("End time must be strictly greater than start time")

        self.id = id.strip()
        self.title = title.strip()
        self.start_time = start
        self.end_time = end
        self.location = str(location).strip() or "TBD"

    @property
    def duration(self) -> float:
        return round(self.end_time - self.start_time, 2)

    def __repr__(self) -> str:
        return f"Event(id={self.id!r}, title={self.title!r}, start={self.start_time}, end={self.end_time})"

    def __str__(self) -> str:
        return f"[{self.start_time:04.1f} - {self.end_time:04.1f}] {self.title} @ {self.location}"

def is_overlapping(event_a: Event, event_b: Event) -> bool:
    return max(event_a.start_time, event_b.start_time) < min(event_a.end_time, event_b.end_time)

def find_conflicts(events: list[Event]) -> list[tuple[Event, Event]]:
    conflicts = []
    n = len(events)
    for i in range(n):
        for j in range(i + 1, n):
            if is_overlapping(events[i], events[j]):
                conflicts.append((events[i], events[j]))
    return conflicts

class ScheduleManager:
    def __init__(self):
        self._events = []

    def add_event(self, event: Event):
        if not isinstance(event, Event):
            raise InvalidEventError("Expected an Event instance")
        self._events.append(event)

    def get_events(self) -> list[Event]:
        return sorted(self._events, key=lambda e: (e.start_time, e.end_time, e.title))

    def get_conflicts(self) -> list[tuple[Event, Event]]:
        return find_conflicts(self.get_events())

    def resolve_conflicts_greedy(self) -> list[Event]:
        if not self._events:
            return []
        ordered = sorted(self._events, key=lambda e: (e.end_time, e.start_time))
        selected = []
        last_end = -1.0
        for e in ordered:
            if e.start_time >= last_end:
                selected.append(e)
                last_end = e.end_time
        return sorted(selected, key=lambda e: (e.start_time, e.end_time))

def generate_schedule_report(events: list[Event]) -> str:
    if not events:
        return "No events scheduled."
    sorted_events = sorted(events, key=lambda e: (e.start_time, e.end_time, e.title))
    lines = ["=== SCHEDULE REPORT ==="]
    for e in sorted_events:
        lines.append(f"{e.start_time:04.1f} - {e.end_time:04.1f} | {e.title} ({e.location}) [{e.duration}h]")
    conflicts = find_conflicts(sorted_events)
    lines.append(f"Total Events: {len(sorted_events)} | Conflicts Detected: {len(conflicts)}")
    return "\\n".join(lines)

sm = ScheduleManager()
sm.add_event(Event("1", "Keynote Speech", 9.0, 10.0, "Auditorium"))
sm.add_event(Event("2", "Machine Learning Lab", 9.5, 11.5, "Hall A"))
sm.add_event(Event("3", "DevOps & Cloud", 10.0, 11.0, "Hall B"))
sm.add_event(Event("4", "Community Lunch", 11.0, 12.0, "Cafeteria"))

print(generate_schedule_report(sm.get_events()))
print("")
print("--- Resolving Conflicts (Greedy Algorithm) ---")
optimal = sm.resolve_conflicts_greedy()
print(generate_schedule_report(optimal))
`,
    readmeTemplate: `# Event Scheduling & Conflict Detection System

A deterministic scheduling and interval conflict resolution engine in Python 3.

## Features
- **Object Invariant Validation**: Custom \`InvalidEventError\` guards against negative start times, non-string IDs, and backward intervals (\`end <= start\`).
- **Interval Overlap Detection**: Mathematical evaluation \`max(start1, start2) < min(end1, end2)\` safely distinguishing overlapping vs adjacent intervals.
- **Greedy Conflict Resolution**: Earliest-deadline-first interval scheduling yielding a maximum-size non-overlapping itinerary.
- **Formatted Agendas**: Human-readable terminal schedule reports with duration, location, and conflict summaries.

## Running
\`\`\`bash
python event_scheduler.py
\`\`\`
`,
  },
];

export function generateProjectReadme(project: StudioProject, studentCode: string): string {
  return `# ${project.title}

## Project Brief
${project.brief.scenario}

### What You Built
${project.brief.whatYouWillBuild}

### Key Competencies Demonstrated
${project.brief.requiredKnowledge.map(k => `- ${k}`).join('\n')}

---

## Source Code (\`${project.id}.py\`)
\`\`\`python
${studentCode.trim() || project.finalSolution}
\`\`\`

---

## Verification & Milestones Completed
${project.milestones.map(m => `- [x] **${m.title}**: ${m.objective}`).join('\n')}

*Generated with Python Lab Project Studio.*
`;
}
