const loops = 'for i in range(3):\n    print("Welcome")';
export const pilotActivities = {
  2: {
    title:'Chai shop bill',intro:'One cup costs ₹20. Start with three cups, then change cups to five and run the bill again.',
    code:'price = 20\ncups = 3\ntotal = price * cups\nprint(total)', prediction:'What total will five cups cost?', answer:'100',
    broken:'price = 20\ncups = 3\nprint(totel)', repair:'price = 20\ncups = 3\ntotal = price * cups\nprint(total)',
    hint:'Compare the name in print() with the name you computed.', reason:'Python needs the same name at assignment and use. Calculate total before printing it.',
    task:'Calculate your expenses. Store 40 for travel and 60 for food in two named variables, then print their sum.',
    starter:'travel = 40\nfood = 60\n# Print the sum', solution:'travel = 40\nfood = 60\nprint(travel + food)', expected:'100',
    remember:'Variable ek naam hai jo value ko refer karta hai. Naam ko doosri value se jod bhi sakte ho.',
    application:'Names let you reuse measurements, marks, and expenses. Assignment binds a name to a value.',
  },
  6: {
    title:'Decide whether a student passes',intro:'A score of 40 or more passes. Try 39, 40, and 75 to see what happens at the boundary.',
    code:'marks = 75\nif marks >= 40:\n    print("Pass")\nelse:\n    print("Fail")', prediction:'What prints when marks is 40?',answer:'pass',
    broken:'marks = 75\nif marks >= 40\n    print("Pass")', repair:'marks = 75\nif marks >= 40:\n    print("Pass")',
    hint:'Look at the end of the if line.',reason:'A colon introduces the indented body. Indent each statement that belongs to the branch.',
    task:'Print Discount if an order total is at least 500. Print No discount otherwise. Start with an order of 500.',
    starter:'order = 500\n# Add an if and else',solution:'order = 500\nif order >= 500:\n    print("Discount")\nelse:\n    print("No discount")',expected:'Discount',
    remember:'If ka matlab agar, elif ka matlab warna agar, aur else ka matlab warna.',
    application:'Add elif when another test should run only after an earlier condition fails. Use conditions to flag records that need review.',
  },
  7: {
    title:'Repeat a welcome message',intro:'Three separate print calls repeat the same job. A loop lets you write print once and repeat it for each value in range(3).',
    code:loops, prediction:'What is the last value of i in range(3)?',answer:'2',
    broken:'for i in range(3):\nprint("Welcome")',repair:loops,
    hint:'Check the spaces at the start of the print line.',reason:'Indent the body so Python knows which statement to repeat.',
    task:'Add the values 1, 2 and 3 with a loop. Print the running total only after the loop finishes. Try range(1, 6) afterward to sum 1 through 5.',
    starter:'total = 0\n# Loop over range(1, 4) and add each number\nprint(total)',
    solution:'total = 0\nfor i in range(1, 4):\n    total += i\nprint(total)',expected:'6',
    remember:'For har item par chalta hai. While tab tak chalta hai jab tak condition true hai.',
    application:'Loops can process a list of student names or add one sale at a time. In a while loop, update the tested value so the loop can stop.',
  },
} as const;
