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
