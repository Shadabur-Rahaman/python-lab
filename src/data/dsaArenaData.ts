export type DsaTopicId =
  | 'arrays-strings'
  | 'hashing-maps'
  | 'searching-sorting'
  | 'stacks-queues'
  | 'two-pointers-sliding-window'
  | 'recursion-backtracking';

export type DsaDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type DsaTopic = {
  id: DsaTopicId;
  name: string;
  tagline: string;
  color: string;
  iconName: string;
};

export type DsaProblemExample = {
  input: string;
  output: string;
  explanation?: string;
};

export type DsaApproach = {
  name: string;
  time: string;
  space: string;
  description: string;
};

export type DsaProblem = {
  id: string;
  title: string;
  topic: DsaTopicId;
  difficulty: DsaDifficulty;
  estimatedMinutes: number;
  prompt: string;
  examples: DsaProblemExample[];
  constraints: string[];
  starterCode: string;
  solutionCode: string;
  cases: {name: string; check: string}[];
  hints: string[];
  approaches: DsaApproach[];
  explanation: string;
};

export type DsaModule = {
  id: string;
  moduleIndex: number;
  topicId: DsaTopicId;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  story: string;
  objectives: string[];
  concepts: [string, string][];
  codeWalkthrough: {
    title: string;
    code: string;
    output: string;
    explanation: string;
  };
  mistake: {
    code: string;
    fix: string;
    why: string;
  };
  cheatSheet: string[];
};

export const DSA_TOPICS: DsaTopic[] = [
  {
    id: 'arrays-strings',
    name: 'Arrays, Lists & Strings',
    tagline: 'Index traversals, frequency counting, prefix sums, and in-place transformations',
    color: '#3b82f6',
    iconName: 'Layers',
  },
  {
    id: 'hashing-maps',
    name: 'Hashing & Efficient Lookups',
    tagline: 'O(1) lookups, complement matching, frequency grouping, and running sums',
    color: '#8b5cf6',
    iconName: 'Hash',
  },
  {
    id: 'searching-sorting',
    name: 'Searching & Sorting',
    tagline: 'Binary search invariants, custom sorting keys, and boundary conditions',
    color: '#10b981',
    iconName: 'Search',
  },
  {
    id: 'stacks-queues',
    name: 'Stacks, Queues & Monotonic Sequences',
    tagline: 'LIFO evaluation, parentheses validation, monotonic stacks, and FIFO deques',
    color: '#f59e0b',
    iconName: 'Database',
  },
  {
    id: 'two-pointers-sliding-window',
    name: 'Two Pointers & Sliding Window',
    tagline: 'Converging pointers, opposite-end traversals, and dynamic window expansion',
    color: '#ec4899',
    iconName: 'MoveHorizontal',
  },
  {
    id: 'recursion-backtracking',
    name: 'Recursion & Backtracking',
    tagline: 'Divide & conquer, call stack tracing, base cases, and state-tree exploration',
    color: '#06b6d4',
    iconName: 'GitBranch',
  },
];

export const DSA_MODULES: DsaModule[] = [
  {
    id: 'dsa-arrays-strings',
    moduleIndex: 1,
    topicId: 'arrays-strings',
    title: 'Arrays, Lists & Strings: Traversals & Prefix Accumulation',
    subtitle: 'Master array memory layout, frequency counting, in-place traversals, and prefix sum tables',
    estimatedMinutes: 25,
    story: 'In algorithmic problem solving, lists and strings form the foundation. A programmer repeatedly calculating the sum of sub-ranges using slice sum (nums[i:j]) suffers O(N*Q) runtime. By precomputing a prefix sum array once in O(N) time, every subsequent range query executes in instantaneous O(1) time.',
    objectives: [
      'Understand how Python lists are indexed in contiguous dynamic memory',
      'Apply prefix sums to answer sub-range queries in O(1) time',
      'Manipulate strings safely without creating O(N^2) memory reallocation bottlenecks',
      'Use frequency counting to verify anagrams and duplicates in linear time',
    ],
    concepts: [
      ['Contiguous Memory vs. Dynamic Arrays', 'Python lists are arrays of pointers to PyObject items. Index access nums[i] is O(1) pointer arithmetic. Appending to the end is amortized O(1), but inserting or deleting from the front is O(N) because subsequent pointers must be shifted.'],
      ['Prefix Sum Technique', 'A prefix sum array stores cumulative totals: prefix[k] = nums[0] + ... + nums[k-1]. The sum of any sub-range nums[left:right+1] is computed immediately as prefix[right+1] - prefix[left].'],
      ['String Immutability & Tokenization', 'Python strings are immutable. Repeated string concatenation s = s + char inside a loop creates a new string object each time, leading to quadratic O(N^2) time. Accumulate strings in a list and call "".join(parts) for O(N) efficiency.'],
      ['Two-Pass Scanning', 'When an operation on index i depends on elements to its left and right (e.g., product except self), separate the problem into a left-to-right pass followed by a right-to-left pass.'],
    ],
    codeWalkthrough: {
      title: 'Prefix Sum Array Construction & Range Sum Query',
      code: `def build_prefix_sums(nums: list[int]) -> list[int]:
    prefix = [0] * (len(nums) + 1)
    for i, num in enumerate(nums):
        prefix[i + 1] = prefix[i] + num
    return prefix

def query_range(prefix: list[int], left: int, right: int) -> int:
    # Query sum of nums[left:right+1] in O(1) time
    return prefix[right + 1] - prefix[left]

nums = [3, 1, 4, 1, 5, 9, 2]
pref = build_prefix_sums(nums)
print(f"Prefix array: {pref}")
print(f"Sum of range [2, 5] (4+1+5+9): {query_range(pref, 2, 5)}")`,
      output: 'Prefix array: [0, 3, 4, 8, 9, 14, 23, 25]\nSum of range [2, 5] (4+1+5+9): 19',
      explanation: 'Precomputing prefix sums takes O(N) time once. Afterwards, any range query is answered in O(1) time with a single subtraction, regardless of how large the array is.',
    },
    mistake: {
      code: `def sum_queries(nums, queries):
    results = []
    for l, r in queries:
        # BUG: slicing and summing inside loop takes O(N * Q)
        results.append(sum(nums[l:r+1]))
    return results`,
      fix: `def sum_queries(nums, queries):
    pref = [0] * (len(nums) + 1)
    for i, n in enumerate(nums):
        pref[i + 1] = pref[i] + n
    # Fixed: each query answered in O(1) -> total O(N + Q)
    return [pref[r + 1] - pref[l] for l, r in queries]`,
      why: 'Calling sum(nums[l:r+1]) inside a loop re-scans up to N elements on every single query. On 100,000 queries, O(N * Q) times out, whereas prefix sums run in milliseconds.',
    },
    cheatSheet: [
      'Access nums[i]: O(1)',
      'Append nums.append(x): O(1) amortized',
      'Insert/Delete front nums.insert(0, x): O(N)',
      'Prefix sum query [L, R]: prefix[R+1] - prefix[L]',
      'String building: use "".join(list_of_chars) instead of repeated s += char',
    ],
  },
  {
    id: 'dsa-hashing-lookups',
    moduleIndex: 2,
    topicId: 'hashing-maps',
    title: 'Hashing & Efficient Lookups: Sets, Maps & Complements',
    subtitle: 'Transform quadratic brute-force searches into linear time using hash table lookups',
    estimatedMinutes: 25,
    story: 'Finding two numbers in an array that add up to a target value is a classic algorithmic puzzle. A nested loop checking every pair of elements executes in O(N^2) time. By using a hash table to remember seen elements and their indices, we can look up the complementary value in O(1) time during a single linear scan.',
    objectives: [
      'Master hash table properties: amortized O(1) search, insert, and delete',
      'Apply complement lookup patterns to eliminate nested search loops',
      'Group related items by canonical representations (e.g. sorted signatures for anagrams)',
      'Combine running sums with hash maps to count matching sub-arrays in O(N) time',
    ],
    concepts: [
      ['The Complement Lookup Pattern', 'Instead of searching forward for a match (O(N)), store elements seen so far in a hash map. For the current element num, check if target - num exists in the map. If yes, the pair is found in O(1).'],
      ['Canonical Representation for Grouping', 'To group items that share an invariant (such as anagrams having identical character frequencies), map each item to a canonical key. For strings, tuple(sorted(s)) or a 26-element character count tuple provides a stable hashable key.'],
      ['Running Prefix Hash Map', 'To find sub-arrays that sum to k, maintain a running prefix sum current_sum. If (current_sum - k) was recorded in our prefix frequency map, every occurrence represents a valid sub-array ending at the current index.'],
      ['Hash Table Trade-Offs', 'Hash maps sacrifice space for speed: O(N) extra space enables O(1) average-time lookups. Keys must be immutable and hashable (strings, ints, tuples, but not lists or dicts).'],
    ],
    codeWalkthrough: {
      title: 'Single-Pass Complement Lookup (Two Sum Pattern)',
      code: `def two_sum_indices(nums: list[int], target: int) -> list[int]:
    seen = {}  # maps value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

print(two_sum_indices([2, 7, 11, 15], 9))
print(two_sum_indices([3, 2, 4], 6))`,
      output: '[0, 1]\n[1, 2]',
      explanation: 'In a single pass of the array, seen stores previous values. Checking "complement in seen" takes amortized O(1) time, solving the problem in O(N) time and O(N) space.',
    },
    mistake: {
      code: `def find_duplicates(nums):
    dups = []
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            # BUG: Nested loop O(N^2) comparison
            if nums[i] == nums[j] and nums[i] not in dups:
                dups.append(nums[i])
    return dups`,
      fix: `def find_duplicates(nums):
    seen = set()
    dups = set()
    for num in nums:
        # Fixed: O(1) set membership check -> O(N) overall
        if num in seen:
            dups.add(num)
        else:
            seen.add(num)
    return list(dups)`,
      why: 'Nested loops comparing every pair produce O(N^2) runtime. Hash sets provide O(1) membership checks, reducing execution time to linear O(N).',
    },
    cheatSheet: [
      'Set lookup x in my_set: O(1) average',
      'Dict lookup d[key]: O(1) average',
      'Hashable types: int, float, str, tuple, frozenset',
      'Unhashable types: list, dict, set (raise TypeError: unhashable type)',
      'Complement pattern: complement = target - current_val',
    ],
  },
  {
    id: 'dsa-searching-sorting',
    moduleIndex: 3,
    topicId: 'searching-sorting',
    title: 'Searching & Sorting: Invariants & Logarithmic Reduction',
    subtitle: 'Master binary search boundaries, loop invariants, and Python custom key sorting',
    estimatedMinutes: 25,
    story: 'Searching through 1,000,000 sorted records linearly takes up to 1,000,000 comparisons. Binary search cuts the search space in half with every comparison, locating the target in at most 20 operations (log2(1,000,000) ≈ 20). However, subtle bugs in calculating mid or updating boundaries can trigger off-by-one errors or infinite loops.',
    objectives: [
      'Understand binary search invariants and logarithmic halving (O(log N))',
      'Implement boundary-safe binary search loops without off-by-one errors',
      'Determine insertion positions in sorted sequences (bisect left)',
      'Leverage Python custom sort keys (key=lambda x: ...) and maintain sorting stability',
    ],
    concepts: [
      ['Binary Search Loop Invariant', 'In a sorted array, maintain two pointers left and right defining the active search interval. At every step, check mid = (left + right) // 2. If nums[mid] == target, return mid. If nums[mid] < target, eliminate the left half: left = mid + 1. Otherwise eliminate the right half: right = mid - 1.'],
      ['Search Space Halving', 'Because the candidate search space is divided by 2 on each iteration (N -> N/2 -> N/4 -> ... -> 1), the maximum number of iterations is ceil(log2(N)).'],
      ['Finding Insertion Index (Bisect Left)', 'When an element is not present, binary search can find where it should be inserted to maintain sorted order: use while left <= right and return left.'],
      ['Python Custom Sort Keys & Stability', 'Python sorted() and list.sort() use Timsort (O(N log N) worst-case, O(N) best-case). Timsort is stable: elements with equal keys maintain their original relative order. Multi-criteria sorting is achieved with tuple keys: key=lambda x: (-x["score"], x["name"]).'],
    ],
    codeWalkthrough: {
      title: 'Boundary-Safe Binary Search Implementation',
      code: `def binary_search(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

nums = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
print(f"Index of 23: {binary_search(nums, 23)}")
print(f"Index of 50: {binary_search(nums, 50)}")`,
      output: 'Index of 23: 5\nIndex of 50: -1',
      explanation: 'Binary search discards half the array on every step. For 10 elements, it takes at most 4 comparisons; for 1,000,000 elements, at most 20 comparisons.',
    },
    mistake: {
      code: `def bad_binary_search(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:  # BUG: misses single element or last index!
        mid = (left + right) // 2
        if nums[mid] < target:
            left = mid  # BUG: infinite loop when left == mid!
        else:
            right = mid
    return left if nums[left] == target else -1`,
      fix: `def good_binary_search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:  # Fixed: <= handles single element arrays
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1  # Fixed: advances past mid
        else:
            right = mid - 1 # Fixed: steps behind mid
    return -1`,
      why: 'Setting left = mid without adding 1 when (left + right) // 2 equals left creates an infinite loop. Always advance boundaries with left = mid + 1 and right = mid - 1.',
    },
    cheatSheet: [
      'Standard BS Condition: while left <= right:',
      'Mid Calculation: mid = (left + right) // 2',
      'Target is larger: left = mid + 1',
      'Target is smaller: right = mid - 1',
      'Timsort complexity: O(N log N) time, O(N) space',
      'Multi-key sort: key=lambda x: (x.primary, -x.secondary)',
    ],
  },
  {
    id: 'dsa-stacks-queues-recursion',
    moduleIndex: 4,
    topicId: 'stacks-queues',
    title: 'Stacks, Queues & Recursion: LIFO, Monotonic & Call Stacks',
    subtitle: 'Manage nested state, bracket balance, monotonic search, and recursive function frames',
    estimatedMinutes: 25,
    story: 'Compilers, code formatters, and browser history engines rely on Last-In, First-Out (LIFO) stacks. When parsing nested parentheses like "{ [ ( ) ] }", each opening bracket is pushed onto the stack; closing brackets must match the most recently pushed opening symbol. Similarly, recursive function execution creates a call stack in memory that operates under identical LIFO rules.',
    objectives: [
      'Model Last-In First-Out (LIFO) state using Python lists as stacks',
      'Validate matching bracket pairs and syntax nesting in linear O(N) time',
      'Understand monotonic stacks for finding next greater / warmer elements',
      'Trace recursive call stacks, identify base cases, and prevent stack overflow',
    ],
    concepts: [
      ['The LIFO Principle', 'A stack adds elements to the top (push / append) and removes elements from the top (pop). In Python, list.append() and list.pop() are O(1) operations that make lists ideal stacks.'],
      ['Bracket Matching Algorithm', 'Iterate through characters: if opening bracket ((, [, {), push to stack. If closing bracket (), ], }), verify stack is non-empty and popped top matches. When done, stack must be completely empty.'],
      ['Monotonic Stack', 'A stack whose elements are kept in strictly increasing or decreasing order. When iterating through array elements, pop elements that violate monotonicity to instantly find the "next greater element" in amortized O(N) overall time.'],
      ['Recursion & The Call Stack', 'A recursive function calls itself with a smaller subproblem until it reaches a base case. Each call pushes a new frame onto the Python runtime call stack. Forgetting a base case causes RecursionError: maximum recursion depth exceeded.'],
    ],
    codeWalkthrough: {
      title: 'Valid Parentheses Matching Using a Stack',
      code: `def is_valid_parentheses(s: str) -> bool:
    matching = {')': '(', '}': '{', ']': '['}
    stack = []
    for char in s:
        if char in matching.values():
            stack.append(char)
        elif char in matching:
            if not stack or stack[-1] != matching[char]:
                return False
            stack.pop()
    return len(stack) == 0

print(is_valid_parentheses("{[()]}"))
print(is_valid_parentheses("([)]"))
print(is_valid_parentheses("((("))`,
      output: 'True\nFalse\nFalse',
      explanation: 'Opening brackets are pushed onto the stack. Each closing bracket verifies that the top element matches and pops it. The string is valid if and only if all brackets matched and the stack is empty.',
    },
    mistake: {
      code: `def count_parens(s):
    # BUG: Counting cannot verify proper bracket NESTING!
    return s.count('(') == s.count(')') and s.count('[') == s.count(']')`,
      fix: `def is_valid_parens(s):
    # Fixed: Use a stack to verify ordering and nesting
    stack = []
    pairs = {')': '(', ']': '['}
    for c in s:
        if c in '([': stack.append(c)
        elif c in pairs:
            if not stack or stack.pop() != pairs[c]: return False
    return len(stack) == 0`,
      why: 'Simple counting fails on invalid sequences like "[(])" where counts are equal but nesting is illegal. Stacks enforce chronological nesting order.',
    },
    cheatSheet: [
      'Stack Push: stack.append(x) (O(1))',
      'Stack Pop: stack.pop() (O(1))',
      'Stack Top: stack[-1] (O(1))',
      'Stack Empty check: not stack',
      'Recursion golden rule: Base case first, then recursive call on smaller input',
    ],
  },
  {
    id: 'dsa-patterns-invariants',
    moduleIndex: 5,
    topicId: 'two-pointers-sliding-window',
    title: 'Algorithmic Problem-Solving Patterns: Pointers, Windows & Greed',
    subtitle: 'Master two-pointer convergence, fixed and variable sliding windows, and greedy decisions',
    estimatedMinutes: 25,
    story: 'When analyzing a sequence of stock prices or streaming data, evaluating every continuous sub-range produces O(N^2) complexity. The Sliding Window technique maintains a moving frame of computation: as the window slides forward, we add the new incoming element and subtract the outgoing element in O(1) time, turning quadratic brute force into smooth linear O(N) streaming.',
    objectives: [
      'Apply converging two-pointer technique on sorted sequences',
      'Implement fixed-size sliding windows to compute moving aggregates in O(N) time',
      'Implement dynamic variable-size sliding windows with condition invariants',
      'Make locally optimal greedy choices to solve interval scheduling problems',
    ],
    concepts: [
      ['Converging Two Pointers', 'When an array is sorted, placing one pointer at index 0 and another at index len(nums)-1 lets you adjust the sum monotonically: if sum < target, advance left pointer to increase total; if sum > target, retract right pointer to decrease total.'],
      ['Fixed-Size Sliding Window', 'For a sub-array of fixed length k, calculate the sum of the first k elements. For each subsequent step, current_sum += nums[i] - nums[i - k]. This avoids re-summing k elements on every step.'],
      ['Variable-Size Sliding Window', 'Expand the right boundary until the window satisfies or violates a condition. When violated, contract the left boundary until the invariant is restored. Each element enters and exits the window at most once, guaranteeing O(N) time.'],
      ['Greedy Decisions', 'Greedy algorithms build a solution piece by piece, always choosing the immediate next piece that offers the most obvious benefit. For interval scheduling, sorting by earliest end time guarantees maximum non-overlapping intervals.'],
    ],
    codeWalkthrough: {
      title: 'Fixed-Size Sliding Window: Max Sum Subarray of Size K',
      code: `def max_sub_array_k(nums: list[int], k: int) -> int:
    if len(nums) < k or k <= 0:
        return 0
    window_sum = sum(nums[:k])
    max_sum = window_sum
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)
    return max_sum

nums = [2, 1, 5, 1, 3, 2]
print(f"Max sum of 3 contiguous elements: {max_sub_array_k(nums, 3)}")`,
      output: 'Max sum of 3 contiguous elements: 9',
      explanation: 'The initial window [2, 1, 5] sums to 8. Subsequent windows update in O(1) by adding the new element and subtracting the evicted element, processing the entire array in O(N) time.',
    },
    mistake: {
      code: `def max_sum_k_bad(nums, k):
    max_val = 0
    for i in range(len(nums) - k + 1):
        # BUG: sum(nums[i:i+k]) recalculates k items every step -> O(N * k)
        max_val = max(max_val, sum(nums[i:i+k]))
    return max_val`,
      fix: `def max_sum_k_good(nums, k):
    if len(nums) < k or k <= 0: return 0
    current = sum(nums[:k])
    best = current
    # Fixed: slide window by adding incoming and subtracting outgoing -> O(N)
    for i in range(k, len(nums)):
        current += nums[i] - nums[i - k]
        best = max(best, current)
    return best`,
      why: 'Slicing and summing on every step takes O(N * k) time. The sliding window update executes in O(1) per step, guaranteeing O(N) total execution.',
    },
    cheatSheet: [
      'Fixed window size: window += incoming - outgoing',
      'Variable window: expand right, while invalid shrink left',
      'Two pointers (sorted): if sum < target: left += 1 else: right -= 1',
      'Greedy choice: make local optimal choice that does not invalidate future choices',
    ],
  },
];

export const DSA_PROBLEMS: DsaProblem[] = [
  // ==========================================
  // TOPIC 1: ARRAYS, LISTS & STRINGS (4)
  // ==========================================
  {
    id: 'running-sum',
    title: 'Running Sum of 1D Array',
    topic: 'arrays-strings',
    difficulty: 'Beginner',
    estimatedMinutes: 10,
    prompt: 'Given an array `nums`, return the running sum of `nums` where `running_sum[i] = sum(nums[0]...nums[i])`.\n\nYour solution should calculate prefix sums in a single pass of $O(N)$ time.',
    examples: [
      {input: 'nums = [1, 2, 3, 4]', output: '[1, 3, 6, 10]', explanation: 'Running sum is obtained as [1, 1+2, 1+2+3, 1+2+3+4].'},
      {input: 'nums = [1, 1, 1, 1, 1]', output: '[1, 2, 3, 4, 5]'},
      {input: 'nums = [3, -1, 2, -10, 5]', output: '[3, 2, 4, -6, -1]'},
    ],
    constraints: [
      '1 <= len(nums) <= 10^4',
      '-10^6 <= nums[i] <= 10^6',
    ],
    starterCode: `def running_sum(nums: list[int]) -> list[int]:
    """Calculate the running prefix sum of an array in O(N) time."""
    # Write your solution here
    pass`,
    solutionCode: `def running_sum(nums: list[int]) -> list[int]:
    result = []
    current = 0
    for num in nums:
        current += num
        result.append(current)
    return result`,
    cases: [
      {name: 'Standard positive array', check: 'running_sum([1, 2, 3, 4]) == [1, 3, 6, 10]'},
      {name: 'Identical elements', check: 'running_sum([1, 1, 1, 1, 1]) == [1, 2, 3, 4, 5]'},
      {name: 'Negative numbers and zeros', check: 'running_sum([3, -1, 2, -10, 5]) == [3, 2, 4, -6, -1]'},
      {name: 'Single element boundary', check: 'running_sum([42]) == [42]'},
      {name: 'Empty list boundary', check: 'running_sum([]) == []'},
    ],
    hints: [
      'Maintain a running variable current that accumulates elements as you iterate.',
      'Append current to a new result list on each step.',
      'Time complexity should be O(N) with O(1) auxiliary space (excluding result).',
    ],
    approaches: [
      {name: 'Brute Force (Slice Sum)', time: 'O(N^2)', space: 'O(1)', description: 'Calculating sum(nums[:i+1]) on each iteration re-sums previous elements.'},
      {name: 'Cumulative Accumulation', time: 'O(N)', space: 'O(1)', description: 'Add each incoming element to running total in a single pass.'},
    ],
    explanation: 'By carrying forward the previous sum in a single scalar variable, each position is computed in O(1) time without redundant re-addition.',
  },

  {
    id: 'reverse-words',
    title: 'Reverse Words in a String',
    topic: 'arrays-strings',
    difficulty: 'Beginner',
    estimatedMinutes: 12,
    prompt: 'Given an input string `s`, reverse the order of the words.\n\nA word is defined as a sequence of non-space characters. The words in `s` will be separated by at least one space.\n\nReturn a string of the words in reverse order concatenated by a single space, with leading and trailing spaces stripped and multiple spaces between words reduced to a single space.',
    examples: [
      {input: 's = "the sky is blue"', output: '"blue is sky the"'},
      {input: 's = "  hello world  "', output: '"world hello"', explanation: 'Reversed string should not contain leading or trailing spaces.'},
      {input: 's = "a good   example"', output: '"example good a"', explanation: 'Multiple spaces between words are reduced to a single space.'},
    ],
    constraints: [
      '1 <= len(s) <= 10^4',
      's contains English letters, digits, and spaces',
    ],
    starterCode: `def reverse_words(s: str) -> str:
    """Reverse word order and normalize inter-word spacing."""
    # Write your solution here
    pass`,
    solutionCode: `def reverse_words(s: str) -> str:
    words = s.split()
    return " ".join(reversed(words))`,
    cases: [
      {name: 'Standard sentence', check: 'reverse_words("the sky is blue") == "blue is sky the"'},
      {name: 'Leading and trailing spaces', check: 'reverse_words("  hello world  ") == "world hello"'},
      {name: 'Multiple internal spaces', check: 'reverse_words("a good   example") == "example good a"'},
      {name: 'Single word', check: 'reverse_words("word") == "word"'},
      {name: 'Empty string boundary', check: 'reverse_words("") == ""'},
    ],
    hints: [
      'Python s.split() without arguments automatically splits on consecutive whitespace and strips leading/trailing spaces.',
      'Reverse the extracted word list using reversed(words) or words[::-1].',
      'Join words with a single space: " ".join(...).',
    ],
    approaches: [
      {name: 'Split & Reverse', time: 'O(N)', space: 'O(N)', description: 'Tokenize by whitespace in linear time and join reversed tokens.'},
    ],
    explanation: 'Calling s.split() handles arbitrary whitespace normalization automatically. Reversing the word list and joining with " " produces clean O(N) output.',
  },

  {
    id: 'longest-common-prefix',
    title: 'Longest Common Prefix',
    topic: 'arrays-strings',
    difficulty: 'Intermediate',
    estimatedMinutes: 15,
    prompt: 'Write a function `longest_common_prefix(strs: list[str]) -> str` to find the longest common prefix string amongst an array of strings.\n\nIf there is no common prefix, return an empty string `""`. If the list is empty, return `""`.',
    examples: [
      {input: 'strs = ["flower", "flow", "flight"]', output: '"fl"'},
      {input: 'strs = ["dog", "racecar", "car"]', output: '""', explanation: 'There is no common prefix among the input strings.'},
    ],
    constraints: [
      '0 <= len(strs) <= 200',
      '0 <= len(strs[i]) <= 200',
    ],
    starterCode: `def longest_common_prefix(strs: list[str]) -> str:
    """Find the longest common prefix across all strings."""
    # Write your solution here
    pass`,
    solutionCode: `def longest_common_prefix(strs: list[str]) -> str:
    if not strs:
        return ""
    prefix = strs[0]
    for s in strs[1:]:
        while not s.startswith(prefix):
            prefix = prefix[:-1]
            if not prefix:
                return ""
    return prefix`,
    cases: [
      {name: 'Common prefix exists', check: 'longest_common_prefix(["flower", "flow", "flight"]) == "fl"'},
      {name: 'No common prefix', check: 'longest_common_prefix(["dog", "racecar", "car"]) == ""'},
      {name: 'Long shared prefix', check: 'longest_common_prefix(["interspecies", "interstellar", "interstate"]) == "inters"'},
      {name: 'Empty array boundary', check: 'longest_common_prefix([]) == ""'},
      {name: 'Single string in list', check: 'longest_common_prefix(["alone"]) == "alone"'},
    ],
    hints: [
      'Start by assuming the first string strs[0] is the prefix.',
      'For each subsequent string s, shorten the prefix while s does not start with prefix.',
      'If the prefix becomes empty, return "" immediately.',
    ],
    approaches: [
      {name: 'Horizontal Scanning', time: 'O(S)', space: 'O(1)', description: 'Iteratively trim prefix against each subsequent string where S is total characters.'},
      {name: 'Vertical Scanning', time: 'O(S)', space: 'O(1)', description: 'Compare characters column by column across all strings simultaneously.'},
    ],
    explanation: 'Horizontal scanning trims the prefix string against each candidate. In the worst case where all strings are identical, every character is inspected once in O(S) time.',
  },

  {
    id: 'product-except-self',
    title: 'Product of Array Except Self',
    topic: 'arrays-strings',
    difficulty: 'Advanced',
    estimatedMinutes: 20,
    prompt: 'Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.\n\nYou must write an algorithm that runs in **$O(N)$ time** and **without using the division operation**.',
    examples: [
      {input: 'nums = [1, 2, 3, 4]', output: '[24, 12, 8, 6]'},
      {input: 'nums = [-1, 1, 0, -3, 3]', output: '[0, 0, 9, 0, 0]'},
    ],
    constraints: [
      '2 <= len(nums) <= 10^5',
      '-30 <= nums[i] <= 30',
      'The product of any prefix or suffix of nums fits in a 32-bit integer',
    ],
    starterCode: `def product_except_self(nums: list[int]) -> list[int]:
    """Return array where output[i] is product of all elements except nums[i] without division."""
    # Write your solution here
    pass`,
    solutionCode: `def product_except_self(nums: list[int]) -> list[int]:
    n = len(nums)
    if n <= 1:
        return [1] * n
    res = [1] * n
    prefix = 1
    for i in range(n):
        res[i] = prefix
        prefix *= nums[i]
    postfix = 1
    for i in range(n - 1, -1, -1):
        res[i] *= postfix
        postfix *= nums[i]
    return res`,
    cases: [
      {name: 'Standard integers', check: 'product_except_self([1, 2, 3, 4]) == [24, 12, 8, 6]'},
      {name: 'Contains zero', check: 'product_except_self([-1, 1, 0, -3, 3]) == [0, 0, 9, 0, 0]'},
      {name: 'Two elements', check: 'product_except_self([2, 3]) == [3, 2]'},
      {name: 'Multiple zeros', check: 'product_except_self([0, 0]) == [0, 0]'},
      {name: 'Single element boundary', check: 'product_except_self([5]) == [1]'},
    ],
    hints: [
      'Notice that answer[i] = (product of elements to the left of i) * (product of elements to the right of i).',
      'Make a left-to-right pass filling res[i] with the product of all elements before i.',
      'Make a right-to-left pass multiplying res[i] by the running product of all elements after i.',
    ],
    approaches: [
      {name: 'Division (Disallowed)', time: 'O(N)', space: 'O(1)', description: 'Multiply all elements and divide by nums[i], but breaks when array contains 0.'},
      {name: 'Prefix and Suffix Passes', time: 'O(N)', space: 'O(1)', description: 'Accumulate prefix products into result array, then scale by running suffix product.'},
    ],
    explanation: 'By decomposing answer[i] into prefix_product[i-1] * suffix_product[i+1], we compute both running products in two sequential O(N) passes without division.',
  },

  // ==========================================
  // TOPIC 2: HASHING & SETS (4)
  // ==========================================
  {
    id: 'contains-duplicate',
    title: 'Contains Duplicate',
    topic: 'hashing-maps',
    difficulty: 'Beginner',
    estimatedMinutes: 10,
    prompt: 'Given an integer array `nums`, return `True` if any value appears at least twice in the array, and return `False` if every element is distinct.',
    examples: [
      {input: 'nums = [1, 2, 3, 1]', output: 'True'},
      {input: 'nums = [1, 2, 3, 4]', output: 'False'},
      {input: 'nums = [1, 1, 1, 3, 3, 4, 3, 2, 4, 2]', output: 'True'},
    ],
    constraints: [
      '1 <= len(nums) <= 10^5',
      '-10^9 <= nums[i] <= 10^9',
    ],
    starterCode: `def contains_duplicate(nums: list[int]) -> bool:
    """Check if array contains any duplicates in O(N) time."""
    # Write your solution here
    pass`,
    solutionCode: `def contains_duplicate(nums: list[int]) -> bool:
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False`,
    cases: [
      {name: 'Duplicate present', check: 'contains_duplicate([1, 2, 3, 1]) == True'},
      {name: 'All unique elements', check: 'contains_duplicate([1, 2, 3, 4]) == False'},
      {name: 'Multiple duplicates', check: 'contains_duplicate([1, 1, 1, 3, 3, 4, 3, 2, 4, 2]) == True'},
      {name: 'Empty list', check: 'contains_duplicate([]) == False'},
      {name: 'Single element', check: 'contains_duplicate([99]) == False'},
    ],
    hints: [
      'Use a set to store numbers as you iterate through the list.',
      'Before adding each number to the set, check if it already exists.',
      'Alternatively, compare len(nums) with len(set(nums)).',
    ],
    approaches: [
      {name: 'Brute Force Nested Loop', time: 'O(N^2)', space: 'O(1)', description: 'Comparing every pair takes quadratic time.'},
      {name: 'Hash Set Lookup', time: 'O(N)', space: 'O(N)', description: 'Set membership test is O(1) amortized, taking O(N) time overall.'},
    ],
    explanation: 'A hash set allows O(1) lookup. Early return on the first duplicate found can terminate well before visiting the entire array.',
  },

  {
    id: 'two-sum-hash',
    title: 'Two Sum (Hash Map Lookup)',
    topic: 'hashing-maps',
    difficulty: 'Beginner',
    estimatedMinutes: 12,
    prompt: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have at most one solution, and you may not use the same element twice. If no pair exists, return `[]`.',
    examples: [
      {input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]', explanation: 'Because nums[0] + nums[1] == 9, return [0, 1].'},
      {input: 'nums = [3, 2, 4], target = 6', output: '[1, 2]'},
      {input: 'nums = [3, 3], target = 6', output: '[0, 1]'},
    ],
    constraints: [
      '2 <= len(nums) <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
    ],
    starterCode: `def two_sum(nums: list[int], target: int) -> list[int]:
    """Find indices of two numbers that sum to target in O(N) time."""
    # Write your solution here
    pass`,
    solutionCode: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    cases: [
      {name: 'Standard pair', check: 'sorted(two_sum([2, 7, 11, 15], 9)) == [0, 1]'},
      {name: 'Indices not at start', check: 'sorted(two_sum([3, 2, 4], 6)) == [1, 2]'},
      {name: 'Duplicate values as pair', check: 'sorted(two_sum([3, 3], 6)) == [0, 1]'},
      {name: 'Negative numbers', check: 'sorted(two_sum([-1, -2, -3, -4, -5], -8)) == [2, 4]'},
      {name: 'No valid pair found', check: 'two_sum([1, 2, 3], 10) == []'},
    ],
    hints: [
      'Use a dictionary mapping seen values to their indices.',
      'For each number, calculate complement = target - num.',
      'If complement in seen, return [seen[complement], current_index].',
    ],
    approaches: [
      {name: 'Brute Force Pair Search', time: 'O(N^2)', space: 'O(1)', description: 'Nested loops checking every pair.'},
      {name: 'One-Pass Hash Map', time: 'O(N)', space: 'O(N)', description: 'Insert elements while simultaneously checking for complement.'},
    ],
    explanation: 'By checking for the complement in our hash map before inserting the current element, we avoid using the same index twice and achieve O(N) runtime.',
  },

  {
    id: 'group-anagrams',
    title: 'Group Anagrams',
    topic: 'hashing-maps',
    difficulty: 'Intermediate',
    estimatedMinutes: 18,
    prompt: 'Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
    examples: [
      {input: 'strs = ["eat", "tea", "tan", "ate", "nat", "bat"]', output: '[["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]'},
      {input: 'strs = [""]', output: '[[""]]'},
      {input: 'strs = ["a"]', output: '[["a"]]'},
    ],
    constraints: [
      '1 <= len(strs) <= 10^4',
      '0 <= len(strs[i]) <= 100',
      'strs[i] consists of lowercase English letters',
    ],
    starterCode: `def group_anagrams(strs: list[str]) -> list[list[str]]:
    """Group strings that are anagrams of each other."""
    # Write your solution here
    pass`,
    solutionCode: `from collections import defaultdict

def group_anagrams(strs: list[str]) -> list[list[str]]:
    groups = defaultdict(list)
    for s in strs:
        key = "".join(sorted(s))
        groups[key].append(s)
    return list(groups.values())`,
    cases: [
      {name: 'Standard anagrams', check: 'sorted([sorted(g) for g in group_anagrams(["eat", "tea", "tan", "ate", "nat", "bat"])]) == [["ate", "eat", "tea"], ["bat"], ["nat", "tan"]]'},
      {name: 'Empty string', check: 'group_anagrams([""]) == [[""]]'},
      {name: 'Single character string', check: 'group_anagrams(["a"]) == [["a"]]'},
      {name: 'Multiple groups', check: 'sorted([sorted(g) for g in group_anagrams(["stop", "pots", "tops", "hello"])]) == [["hello"], ["pots", "stop", "tops"]]'},
    ],
    hints: [
      'Notice that two strings are anagrams if and only if their sorted characters are identical.',
      'Use "".join(sorted(s)) as the hash map dictionary key.',
      'Append each original string s to groups[key].',
    ],
    approaches: [
      {name: 'Sorted String Key', time: 'O(N * K log K)', space: 'O(N * K)', description: 'Sort each string of length K to use as hash map key.'},
      {name: 'Character Count Tuple Key', time: 'O(N * K)', space: 'O(N * K)', description: 'Use 26-element tuple count of characters as key.'},
    ],
    explanation: 'Sorting each word creates a canonical representation common to all anagrams in that set. Grouping these with collections.defaultdict(list) runs in O(N * K log K) time.',
  },

  {
    id: 'subarray-sum-equals-k',
    title: 'Subarray Sum Equals K',
    topic: 'hashing-maps',
    difficulty: 'Advanced',
    estimatedMinutes: 20,
    prompt: 'Given an array of integers `nums` and an integer `k`, return the total number of continuous subarrays whose sum equals to `k`.\n\nA subarray is a contiguous non-empty sequence of elements within an array. Your solution must run in **$O(N)$ time**.',
    examples: [
      {input: 'nums = [1, 1, 1], k = 2', output: '2'},
      {input: 'nums = [1, 2, 3], k = 3', output: '2', explanation: 'Subarrays [1, 2] and [3] both sum to 3.'},
    ],
    constraints: [
      '1 <= len(nums) <= 2 * 10^4',
      '-1000 <= nums[i] <= 1000',
      '-10^7 <= k <= 10^7',
    ],
    starterCode: `def subarray_sum(nums: list[int], k: int) -> int:
    """Return count of contiguous subarrays summing to k in O(N) time."""
    # Write your solution here
    pass`,
    solutionCode: `from collections import defaultdict

def subarray_sum(nums: list[int], k: int) -> int:
    prefix_counts = defaultdict(int)
    prefix_counts[0] = 1  # Base case: empty subarray sum is 0
    current_sum = 0
    count = 0
    for num in nums:
        current_sum += num
        # If (current_sum - k) was seen before, those sub-arrays sum to k!
        if (current_sum - k) in prefix_counts:
            count += prefix_counts[current_sum - k]
        prefix_counts[current_sum] += 1
    return count`,
    cases: [
      {name: 'Standard array with positive numbers', check: 'subarray_sum([1, 1, 1], 2) == 2'},
      {name: 'Multiple matching subarrays', check: 'subarray_sum([1, 2, 3], 3) == 2'},
      {name: 'Contains negative numbers and zeros', check: 'subarray_sum([1, -1, 0], 0) == 3'},
      {name: 'Longer mixed sequence', check: 'subarray_sum([3, 4, 7, 2, -3, 1, 4, 2], 7) == 4'},
      {name: 'Empty array boundary', check: 'subarray_sum([], 5) == 0'},
    ],
    hints: [
      'A subarray nums[i:j+1] sums to k if prefix[j+1] - prefix[i] == k.',
      'Rearrange this: prefix[i] = prefix[j+1] - k.',
      'Store counts of previously seen prefix sums in a hash map. Initialize map[0] = 1 to handle subarrays starting from index 0.',
    ],
    approaches: [
      {name: 'Brute Force All Pairs', time: 'O(N^2)', space: 'O(1)', description: 'Calculate sums of all N*(N+1)/2 subarrays.'},
      {name: 'Prefix Sum Hash Map', time: 'O(N)', space: 'O(N)', description: 'Single pass recording frequency of running prefix sums.'},
    ],
    explanation: 'By storing the frequencies of running prefix sums in a hash map, any sub-array ending at the current index with sum k is counted in O(1) time whenever (current_sum - k) exists in the map.',
  },

  // ==========================================
  // TOPIC 3: SEARCHING & SORTING (4)
  // ==========================================
  {
    id: 'binary-search-basic',
    title: 'Classic Binary Search',
    topic: 'searching-sorting',
    difficulty: 'Beginner',
    estimatedMinutes: 10,
    prompt: 'Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`.\n\nIf `target` exists, then return its index. Otherwise, return `-1`.\n\nYou must write an algorithm with **$O(\\log N)$ runtime complexity**.',
    examples: [
      {input: 'nums = [-1, 0, 3, 5, 9, 12], target = 9', output: '4', explanation: '9 exists in nums and its index is 4.'},
      {input: 'nums = [-1, 0, 3, 5, 9, 12], target = 2', output: '-1', explanation: '2 does not exist in nums so return -1.'},
    ],
    constraints: [
      '1 <= len(nums) <= 10^4',
      '-10^4 < nums[i], target < 10^4',
      'All integers in nums are unique and sorted in ascending order',
    ],
    starterCode: `def binary_search(nums: list[int], target: int) -> int:
    """Find target index in sorted array in O(log N) time."""
    # Write your solution here
    pass`,
    solutionCode: `def binary_search(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
    cases: [
      {name: 'Target found in middle', check: 'binary_search([-1, 0, 3, 5, 9, 12], 9) == 4'},
      {name: 'Target missing', check: 'binary_search([-1, 0, 3, 5, 9, 12], 2) == -1'},
      {name: 'Single element match', check: 'binary_search([5], 5) == 0'},
      {name: 'Single element miss', check: 'binary_search([5], -5) == -1'},
      {name: 'Empty array boundary', check: 'binary_search([], 1) == -1'},
    ],
    hints: [
      'Initialize left = 0 and right = len(nums) - 1.',
      'Use while left <= right so single-element ranges are checked.',
      'Calculate mid = (left + right) // 2. Update left = mid + 1 or right = mid - 1.',
    ],
    approaches: [
      {name: 'Linear Scan', time: 'O(N)', space: 'O(1)', description: 'Inspect each element sequentially from index 0.'},
      {name: 'Binary Search', time: 'O(log N)', space: 'O(1)', description: 'Halve the search space on each iteration using the sorted property.'},
    ],
    explanation: 'By repeatedly eliminating half the candidates, binary search locates any element among 1,000,000 items in at most 20 iterations.',
  },

  {
    id: 'search-insert-position',
    title: 'Search Insert Position',
    topic: 'searching-sorting',
    difficulty: 'Beginner',
    estimatedMinutes: 12,
    prompt: 'Given a sorted array of distinct integers and a target value, return the index if the target is found.\n\nIf not, return the index where it would be if it were inserted in order.\n\nYou must write an algorithm with **$O(\\log N)$ runtime complexity**.',
    examples: [
      {input: 'nums = [1, 3, 5, 6], target = 5', output: '2'},
      {input: 'nums = [1, 3, 5, 6], target = 2', output: '1'},
      {input: 'nums = [1, 3, 5, 6], target = 7', output: '4'},
      {input: 'nums = [1, 3, 5, 6], target = 0', output: '0'},
    ],
    constraints: [
      '1 <= len(nums) <= 10^4',
      '-10^4 <= nums[i], target <= 10^4',
      'nums contains distinct values sorted in ascending order',
    ],
    starterCode: `def search_insert(nums: list[int], target: int) -> int:
    """Return index of target or insertion position in O(log N) time."""
    # Write your solution here
    pass`,
    solutionCode: `def search_insert(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return left`,
    cases: [
      {name: 'Target exists in array', check: 'search_insert([1, 3, 5, 6], 5) == 2'},
      {name: 'Insert in middle', check: 'search_insert([1, 3, 5, 6], 2) == 1'},
      {name: 'Insert at end', check: 'search_insert([1, 3, 5, 6], 7) == 4'},
      {name: 'Insert at start', check: 'search_insert([1, 3, 5, 6], 0) == 0'},
      {name: 'Empty array boundary', check: 'search_insert([], 10) == 0'},
    ],
    hints: [
      'When binary search terminates without finding the target, where does the left pointer point?',
      'left will always be positioned at the exact index where target belongs.',
      'Return left after the while loop terminates.',
    ],
    approaches: [
      {name: 'Binary Search (Bisect Left)', time: 'O(log N)', space: 'O(1)', description: 'Invariant guarantees left pointer converges on the insertion index.'},
    ],
    explanation: 'The loop invariant ensures that all elements to the left of left are smaller than target, and all elements to the right of right are greater. When left > right, left is the exact insertion point.',
  },

  {
    id: 'sort-by-custom-key',
    title: 'Sort Records by Custom Multi-Key Criteria',
    topic: 'searching-sorting',
    difficulty: 'Intermediate',
    estimatedMinutes: 15,
    prompt: 'Implement `sort_students(students: list[dict]) -> list[dict]` that sorts a list of student dictionaries by:\n1. `grade` in **descending** order (highest grade first).\n2. If grades are tied, sort by `name` in **ascending** alphabetical order (A to Z).\n\nDo not mutate the original input list.',
    examples: [
      {
        input: 'students = [{"name": "Alice", "grade": 88}, {"name": "Bob", "grade": 95}, {"name": "Charlie", "grade": 88}]',
        output: '[{"name": "Bob", "grade": 95}, {"name": "Alice", "grade": 88}, {"name": "Charlie", "grade": 88}]',
        explanation: 'Bob has highest grade (95). Alice and Charlie tie at 88, so Alice comes before Charlie alphabetically.',
      },
    ],
    constraints: [
      '0 <= len(students) <= 10^4',
      'grade is an integer between 0 and 100',
    ],
    starterCode: `def sort_students(students: list[dict]) -> list[dict]:
    """Sort students by grade descending, then name ascending."""
    # Write your solution here
    pass`,
    solutionCode: `def sort_students(students: list[dict]) -> list[dict]:
    return sorted(students, key=lambda s: (-s["grade"], s["name"]))`,
    cases: [
      {
        name: 'Mixed grades with tie-breaker',
        check: 'sort_students([{"name": "Alice", "grade": 88}, {"name": "Bob", "grade": 95}, {"name": "Charlie", "grade": 88}]) == [{"name": "Bob", "grade": 95}, {"name": "Alice", "grade": 88}, {"name": "Charlie", "grade": 88}]',
      },
      {name: 'Empty list boundary', check: 'sort_students([]) == []'},
      {
        name: 'Equal grades alphabetical sorting',
        check: 'sort_students([{"name": "Zoe", "grade": 50}, {"name": "Aaron", "grade": 50}]) == [{"name": "Aaron", "grade": 50}, {"name": "Zoe", "grade": 50}]',
      },
    ],
    hints: [
      'Use Python built-in sorted(students, key=...).',
      'Return a tuple in the key lambda: (primary_criterion, secondary_criterion).',
      'To sort an integer descending while other keys are ascending, negate the integer: -s["grade"].',
    ],
    approaches: [
      {name: 'Timsort with Tuple Key', time: 'O(N log N)', space: 'O(N)', description: 'Python stable sorting with compound comparison key.'},
    ],
    explanation: 'Python compares tuples element by element: (A1, B1) vs (A2, B2). Negating the numeric grade allows mixing descending order with ascending string order in a single sort pass.',
  },

  {
    id: 'search-in-rotated-sorted-array',
    title: 'Search in Rotated Sorted Array',
    topic: 'searching-sorting',
    difficulty: 'Advanced',
    estimatedMinutes: 20,
    prompt: 'There is an integer array `nums` sorted in ascending order with distinct values that was rotated at an unknown pivot index.\n\nGiven the rotated array `nums` and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums`.\n\nYou must write an algorithm with **$O(\\log N)$ runtime complexity**.',
    examples: [
      {input: 'nums = [4, 5, 6, 7, 0, 1, 2], target = 0', output: '4'},
      {input: 'nums = [4, 5, 6, 7, 0, 1, 2], target = 3', output: '-1'},
      {input: 'nums = [1], target = 0', output: '-1'},
    ],
    constraints: [
      '1 <= len(nums) <= 5000',
      '-10^4 <= nums[i], target <= 10^4',
      'All values of nums are unique',
    ],
    starterCode: `def search_rotated(nums: list[int], target: int) -> int:
    """Find target in rotated sorted array in O(log N) time."""
    # Write your solution here
    pass`,
    solutionCode: `def search_rotated(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        # Determine whether left half is normally sorted
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        # Otherwise, right half is normally sorted
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    return -1`,
    cases: [
      {name: 'Target found in rotated right half', check: 'search_rotated([4, 5, 6, 7, 0, 1, 2], 0) == 4'},
      {name: 'Target missing in rotated array', check: 'search_rotated([4, 5, 6, 7, 0, 1, 2], 3) == -1'},
      {name: 'Single element miss', check: 'search_rotated([1], 0) == -1'},
      {name: 'Single element match', check: 'search_rotated([1], 1) == 0'},
      {name: 'Target in rotated three-element array', check: 'search_rotated([5, 1, 3], 3) == 2'},
    ],
    hints: [
      'Notice that at least one half of a rotated sorted array is always cleanly sorted!',
      'Check if nums[left] <= nums[mid]. If yes, the left half is sorted.',
      'If the left half is sorted, check if target falls within nums[left] <= target < nums[mid].',
    ],
    approaches: [
      {name: 'Modified Binary Search', time: 'O(log N)', space: 'O(1)', description: 'Determine which half is sorted, then check whether target falls inside its bounds.'},
    ],
    explanation: 'Even when rotated, dividing the array at mid produces at least one half that is cleanly sorted. Testing whether target lies within the sorted half allows discarding the other half in O(log N) time.',
  },

  // ==========================================
  // TOPIC 4: STACKS & QUEUES (4)
  // ==========================================
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    topic: 'stacks-queues',
    difficulty: 'Beginner',
    estimatedMinutes: 12,
    prompt: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
    examples: [
      {input: 's = "()"', output: 'True'},
      {input: 's = "()[]{}"', output: 'True'},
      {input: 's = "(]"', output: 'False'},
      {input: 's = "([)]"', output: 'False'},
      {input: 's = "{[]}"', output: 'True'},
    ],
    constraints: [
      '0 <= len(s) <= 10^4',
      's consists of parentheses only "()[]{}"',
    ],
    starterCode: `def is_valid_parentheses(s: str) -> bool:
    """Validate matching and nested parentheses using a stack."""
    # Write your solution here
    pass`,
    solutionCode: `def is_valid_parentheses(s: str) -> bool:
    pairs = {')': '(', '}': '{', ']': '['}
    stack = []
    for char in s:
        if char in pairs.values():
            stack.append(char)
        elif char in pairs:
            if not stack or stack[-1] != pairs[char]:
                return False
            stack.pop()
    return len(stack) == 0`,
    cases: [
      {name: 'Simple pair', check: 'is_valid_parentheses("()") == True'},
      {name: 'Multiple consecutive pairs', check: 'is_valid_parentheses("()[]{}") == True'},
      {name: 'Mismatched types', check: 'is_valid_parentheses("(]") == False'},
      {name: 'Improper interleaving', check: 'is_valid_parentheses("([)]") == False'},
      {name: 'Properly nested brackets', check: 'is_valid_parentheses("{[]}") == True'},
      {name: 'Empty string boundary', check: 'is_valid_parentheses("") == True'},
      {name: 'Unclosed single bracket', check: 'is_valid_parentheses("[") == False'},
    ],
    hints: [
      'Use a stack to store opening brackets.',
      'When encountering a closing bracket, check if the top of the stack matches its corresponding opening bracket.',
      'Remember to check if the stack is completely empty at the end.',
    ],
    approaches: [
      {name: 'LIFO Stack', time: 'O(N)', space: 'O(N)', description: 'Push open brackets and pop on matching closed brackets.'},
    ],
    explanation: 'The Last-In, First-Out property of a stack mirrors nested structures. Each closing bracket matches the most recently opened symbol.',
  },

  {
    id: 'min-stack-design',
    title: 'Design MinStack with O(1) Minimum Retrieval',
    topic: 'stacks-queues',
    difficulty: 'Intermediate',
    estimatedMinutes: 18,
    prompt: 'Design a stack that supports `push`, `pop`, `top`, and retrieving the minimum element in **$O(1)$ constant time**.\n\nImplement the `MinStack` class:\n- `MinStack()` initializes the stack object.\n- `push(val: int) -> None` pushes the element `val` onto the stack.\n- `pop() -> None` removes the element on the top of the stack.\n- `top() -> int` gets the top element of the stack.\n- `get_min() -> int` retrieves the minimum element in the stack.',
    examples: [
      {
        input: 'minStack = MinStack()\nminStack.push(-2)\nminStack.push(0)\nminStack.push(-3)\nminStack.get_min() -> -3\nminStack.pop()\nminStack.top() -> 0\nminStack.get_min() -> -2',
        output: 'All operations execute in O(1) time',
      },
    ],
    constraints: [
      '-2^31 <= val <= 2^31 - 1',
      'Methods pop, top, and get_min will always be called on non-empty stacks in tests',
    ],
    starterCode: `class MinStack:
    """Stack supporting O(1) push, pop, top, and get_min."""
    def __init__(self):
        # Initialize your data structures here
        pass

    def push(self, val: int) -> None:
        pass

    def pop(self) -> None:
        pass

    def top(self) -> int:
        pass

    def get_min(self) -> int:
        pass`,
    solutionCode: `class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val: int) -> None:
        self.stack.append(val)
        current_min = self.min_stack[-1] if self.min_stack else val
        self.min_stack.append(min(val, current_min))

    def pop(self) -> None:
        if self.stack:
            self.stack.pop()
            self.min_stack.pop()

    def top(self) -> int:
        return self.stack[-1]

    def get_min(self) -> int:
        return self.min_stack[-1]`,
    cases: [
      {
        name: 'Standard push, pop, get_min verification',
        check: `(lambda: (
    ms := MinStack(),
    ms.push(-2),
    ms.push(0),
    ms.push(-3),
    c1 := (ms.get_min() == -3),
    ms.pop(),
    c2 := (ms.top() == 0),
    c3 := (ms.get_min() == -2),
    c1 and c2 and c3
)[-1])()`,
      },
      {
        name: 'Repeated minimum values',
        check: `(lambda: (
    ms := MinStack(),
    ms.push(5),
    ms.push(5),
    ms.push(5),
    c1 := (ms.get_min() == 5),
    ms.pop(),
    c2 := (ms.get_min() == 5),
    c1 and c2
)[-1])()`,
      },
    ],
    hints: [
      'How can you store the minimum value alongside each element?',
      'Maintain an auxiliary min_stack tracking the minimum value at each stack depth.',
      'When pushing val, also push min(val, current_min) onto min_stack.',
    ],
    approaches: [
      {name: 'Two Stacks / Value-Min Pairs', time: 'O(1) all operations', space: 'O(N)', description: 'Store minimum snapshot corresponding to each stack level.'},
    ],
    explanation: 'By storing the running minimum alongside each element on an auxiliary stack, popping the top element automatically restores the previous minimum in O(1) time without rescanning.',
  },

  {
    id: 'daily-temperatures',
    title: 'Daily Temperatures (Next Warmer Day)',
    topic: 'stacks-queues',
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    prompt: 'Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the $i^{\\text{th}}$ day to get a warmer temperature.\n\nIf there is no future day for which this is possible, keep `answer[i] == 0` instead.\n\nYour solution must run in **$O(N)$ time**.',
    examples: [
      {input: 'temperatures = [73, 74, 75, 71, 69, 72, 76, 73]', output: '[1, 1, 4, 2, 1, 1, 0, 0]'},
      {input: 'temperatures = [30, 40, 50, 60]', output: '[1, 1, 1, 0]'},
      {input: 'temperatures = [30, 60, 90]', output: '[1, 1, 0]'},
    ],
    constraints: [
      '1 <= len(temperatures) <= 10^5',
      '30 <= temperatures[i] <= 100',
    ],
    starterCode: `def daily_temperatures(temperatures: list[int]) -> list[int]:
    """Find number of days until warmer temperature in O(N) using monotonic stack."""
    # Write your solution here
    pass`,
    solutionCode: `def daily_temperatures(temperatures: list[int]) -> list[int]:
    n = len(temperatures)
    ans = [0] * n
    stack = []  # stores indices of unresolved cooler days
    for i, temp in enumerate(temperatures):
        while stack and temperatures[stack[-1]] < temp:
            prev_index = stack.pop()
            ans[prev_index] = i - prev_index
        stack.append(i)
    return ans`,
    cases: [
      {name: 'Fluctuating temperatures', check: 'daily_temperatures([73, 74, 75, 71, 69, 72, 76, 73]) == [1, 1, 4, 2, 1, 1, 0, 0]'},
      {name: 'Strictly increasing', check: 'daily_temperatures([30, 40, 50, 60]) == [1, 1, 1, 0]'},
      {name: 'Three temperatures', check: 'daily_temperatures([30, 60, 90]) == [1, 1, 0]'},
      {name: 'Empty array boundary', check: 'daily_temperatures([]) == []'},
      {name: 'Single day boundary', check: 'daily_temperatures([80]) == [0]'},
    ],
    hints: [
      'A nested loop checking future days takes O(N^2). Use a monotonic decreasing stack.',
      'Store indices of days waiting for a warmer temperature in the stack.',
      'When current temperature temp is warmer than the temperature at stack[-1], pop and record the day difference.',
    ],
    approaches: [
      {name: 'Brute Force Future Scan', time: 'O(N^2)', space: 'O(1)', description: 'Nested loop scanning forward from each day.'},
      {name: 'Monotonic Decreasing Stack', time: 'O(N)', space: 'O(N)', description: 'Each index enters and exits the stack at most once.'},
    ],
    explanation: 'A monotonic decreasing stack keeps unresolved cooler days. When a warmer day arrives, it resolves all cooler days waiting on the stack in amortized O(1) time per day.',
  },

  {
    id: 'simplify-path',
    title: 'Simplify Unix File Path',
    topic: 'stacks-queues',
    difficulty: 'Advanced',
    estimatedMinutes: 20,
    prompt: "Given an absolute path for a Unix-style file system, which begins with a slash '/', transform this path to its simplified canonical path.\\n\\nIn a Unix-style file system:\\n- A period '.' refers to the current directory.\\n- A double period '..' refers to the directory up a level (parent directory).\\n- Multiple consecutive slashes such as '//' are treated as a single slash '/'.\\n- Any trailing slashes should be removed.\\n\\nThe canonical path must start with a single slash '/' and have directories separated by exactly one slash.",
    examples: [
      {input: 'path = "/home/"', output: '"/home"'},
      {input: 'path = "/../"', output: '"/"', explanation: 'Going one level up from root directory is not possible.'},
      {input: 'path = "/home//foo/"', output: '"/home/foo"'},
      {input: 'path = "/a/./b/../../c/"', output: '"/c"'},
    ],
    constraints: [
      '1 <= len(path) <= 3000',
      'path consists of English letters, digits, period, slash, and underscore',
      'path is a valid absolute Unix path',
    ],
    starterCode: `def simplify_path(path: str) -> str:
    """Transform Unix absolute path into simplified canonical path."""
    # Write your solution here
    pass`,
    solutionCode: `def simplify_path(path: str) -> str:
    parts = path.split('/')
    stack = []
    for part in parts:
        if part == '' or part == '.':
            continue
        elif part == '..':
            if stack:
                stack.pop()
        else:
            stack.append(part)
    return '/' + '/'.join(stack)`,
    cases: [
      {name: 'Trailing slash removed', check: 'simplify_path("/home/") == "/home"'},
      {name: 'Up from root remains root', check: 'simplify_path("/../") == "/"'},
      {name: 'Double slash reduced', check: 'simplify_path("/home//foo/") == "/home/foo"'},
      {name: 'Nested traversal with ..', check: 'simplify_path("/a/./b/../../c/") == "/c"'},
      {name: 'Complex redundant segments', check: 'simplify_path("/a/../../b/../c//.//") == "/c"'},
    ],
    hints: [
      'Split the path by "/" using path.split("/").',
      'Ignore empty strings and "." which represent current directory.',
      'When encountering "..", pop from stack if stack is non-empty. Otherwise push the directory name.',
    ],
    approaches: [
      {name: 'Stack Simulation', time: 'O(N)', space: 'O(N)', description: 'Simulate directory descent with push and upward navigation with pop.'},
    ],
    explanation: 'Splitting on "/" reduces the problem to token processing. A stack matches hierarchical directory navigation: normal names are pushed, and ".." pops the parent.',
  },

  // ==========================================
  // TOPIC 5: TWO POINTERS & SLIDING WINDOW (4)
  // ==========================================
  {
    id: 'valid-palindrome-two-pointer',
    title: 'Valid Palindrome (Two Pointers)',
    topic: 'two-pointers-sliding-window',
    difficulty: 'Beginner',
    estimatedMinutes: 10,
    prompt: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\n\nAlphanumeric characters include letters and numbers.\n\nGiven a string `s`, return `True` if it is a palindrome, or `False` otherwise.',
    examples: [
      {input: 's = "A man, a plan, a canal: Panama"', output: 'True', explanation: '"amanaplanacanalpanama" is a palindrome.'},
      {input: 's = "race a car"', output: 'False', explanation: '"raceacar" is not a palindrome.'},
      {input: 's = " "', output: 'True', explanation: 'An empty string reads the same forward and backward.'},
    ],
    constraints: [
      '1 <= len(s) <= 2 * 10^5',
      's consists only of printable ASCII characters',
    ],
    starterCode: `def is_palindrome(s: str) -> bool:
    """Check if string is palindrome ignoring non-alphanumeric characters."""
    # Write your solution here
    pass`,
    solutionCode: `def is_palindrome(s: str) -> bool:
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1
    return True`,
    cases: [
      {name: 'Complex palindrome with punctuation', check: 'is_palindrome("A man, a plan, a canal: Panama") == True'},
      {name: 'Non-palindrome', check: 'is_palindrome("race a car") == False'},
      {name: 'Whitespace only', check: 'is_palindrome(" ") == True'},
      {name: 'Letters and numbers', check: 'is_palindrome("0P") == False'},
      {name: 'Single word palindrome', check: 'is_palindrome("Madam") == True'},
    ],
    hints: [
      'Use two pointers starting at opposite ends: left = 0 and right = len(s) - 1.',
      'Skip non-alphanumeric characters using char.isalnum().',
      'Compare lowercased characters s[left].lower() and s[right].lower().',
    ],
    approaches: [
      {name: 'In-Place Two Pointers', time: 'O(N)', space: 'O(1)', description: 'Converge inward from both ends skipping punctuation without allocating new memory.'},
    ],
    explanation: 'Two pointers converging from ends examine each character at most once with O(1) auxiliary space, checking symmetry in linear O(N) time.',
  },

  {
    id: 'two-sum-sorted',
    title: 'Two Sum II — Input Array Is Sorted',
    topic: 'two-pointers-sliding-window',
    difficulty: 'Beginner',
    estimatedMinutes: 12,
    prompt: 'Given a **1-indexed** array of integers `numbers` that is already sorted in non-decreasing order, find two numbers such that they add up to a specific `target` number.\n\nReturn the indices of the two numbers, `index1` and `index2`, added by one as an integer array `[index1, index2]` of length 2.\n\nYou must use only **$O(1)$ constant extra space**.',
    examples: [
      {input: 'numbers = [2, 7, 11, 15], target = 9', output: '[1, 2]'},
      {input: 'numbers = [2, 3, 4], target = 6', output: '[1, 3]'},
      {input: 'numbers = [-1, 0], target = -1', output: '[1, 2]'},
    ],
    constraints: [
      '2 <= len(numbers) <= 3 * 10^4',
      '-1000 <= numbers[i] <= 1000',
      'numbers is sorted in non-decreasing order',
      'Exactly one valid solution exists',
    ],
    starterCode: `def two_sum_sorted(numbers: list[int], target: int) -> list[int]:
    """Find 1-indexed pair summing to target using two pointers in O(1) space."""
    # Write your solution here
    pass`,
    solutionCode: `def two_sum_sorted(numbers: list[int], target: int) -> list[int]:
    left, right = 0, len(numbers) - 1
    while left < right:
        current = numbers[left] + numbers[right]
        if current == target:
            return [left + 1, right + 1]
        elif current < target:
            left += 1
        else:
            right -= 1
    return []`,
    cases: [
      {name: 'Standard positive sorted', check: 'two_sum_sorted([2, 7, 11, 15], 9) == [1, 2]'},
      {name: 'Target at non-adjacent ends', check: 'two_sum_sorted([2, 3, 4], 6) == [1, 3]'},
      {name: 'Negative numbers', check: 'two_sum_sorted([-1, 0], -1) == [1, 2]'},
      {name: 'Duplicate values', check: 'two_sum_sorted([1, 2, 3, 4, 4, 9], 8) == [4, 5]'},
    ],
    hints: [
      'Because numbers is sorted, if numbers[left] + numbers[right] < target, moving left forward will increase the sum.',
      'If the sum > target, moving right backward will decrease the sum.',
      'Remember the output must be 1-indexed ([left + 1, right + 1]).',
    ],
    approaches: [
      {name: 'Converging Two Pointers', time: 'O(N)', space: 'O(1)', description: 'Adjust left or right pointer based on sum comparison in O(1) space.'},
    ],
    explanation: 'The sorted property guarantees monotonicity: moving left increases the sum; moving right decreases it. We reach the target in at most N steps using zero extra memory.',
  },

  {
    id: 'max-sum-subarray-k',
    title: 'Maximum Sum Subarray of Size K',
    topic: 'two-pointers-sliding-window',
    difficulty: 'Intermediate',
    estimatedMinutes: 15,
    prompt: 'Given an array of positive integers `nums` and a positive integer `k`, find the maximum sum of any contiguous subarray of size `k`.\n\nIf `len(nums) < k` or `k <= 0`, return `0`.\n\nYour solution must execute in **$O(N)$ time** using a sliding window.',
    examples: [
      {input: 'k = 3, nums = [2, 1, 5, 1, 3, 2]', output: '9', explanation: 'Subarray [5, 1, 3] has the maximum sum of 9.'},
      {input: 'k = 2, nums = [2, 3, 4, 1, 5]', output: '7', explanation: 'Subarray [3, 4] has the maximum sum of 7.'},
    ],
    constraints: [
      '1 <= len(nums) <= 10^5',
      '1 <= k <= len(nums)',
    ],
    starterCode: `def max_sub_array_of_size_k(k: int, nums: list[int]) -> int:
    """Find maximum sum of contiguous subarray of size k in O(N)."""
    # Write your solution here
    pass`,
    solutionCode: `def max_sub_array_of_size_k(k: int, nums: list[int]) -> int:
    if not nums or k <= 0 or len(nums) < k:
        return 0
    window_sum = sum(nums[:k])
    max_sum = window_sum
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)
    return max_sum`,
    cases: [
      {name: 'Standard array with size 3 window', check: 'max_sub_array_of_size_k(3, [2, 1, 5, 1, 3, 2]) == 9'},
      {name: 'Window size 2', check: 'max_sub_array_of_size_k(2, [2, 3, 4, 1, 5]) == 7'},
      {name: 'Single element window', check: 'max_sub_array_of_size_k(1, [-5, -2, -10]) == -2'},
      {name: 'Array shorter than k', check: 'max_sub_array_of_size_k(4, [1, 2, 3]) == 0'},
    ],
    hints: [
      'Compute the sum of the first k elements to initialize window_sum.',
      'Slide the window forward one element at a time: window_sum += nums[i] - nums[i - k].',
      'Track max_sum = max(max_sum, window_sum) on each step.',
    ],
    approaches: [
      {name: 'Fixed Sliding Window', time: 'O(N)', space: 'O(1)', description: 'Add incoming element and subtract outgoing element in O(1) per step.'},
    ],
    explanation: 'Rather than recalculating k elements on every iteration (O(N*k)), updating the running window by adding the incoming element and subtracting the evicted element takes O(1) time.',
  },

  {
    id: 'longest-substring-no-repeating',
    title: 'Longest Substring Without Repeating Characters',
    topic: 'two-pointers-sliding-window',
    difficulty: 'Advanced',
    estimatedMinutes: 20,
    prompt: 'Given a string `s`, find the length of the **longest substring** without repeating characters.\n\nYour solution must run in **$O(N)$ time** using a variable sliding window.',
    examples: [
      {input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.'},
      {input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.'},
      {input: 's = "pwwkew"', output: '3', explanation: 'The answer is "wke", with the length of 3.'},
    ],
    constraints: [
      '0 <= len(s) <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces',
    ],
    starterCode: `def length_of_longest_substring(s: str) -> int:
    """Find length of longest substring without repeating characters in O(N)."""
    # Write your solution here
    pass`,
    solutionCode: `def length_of_longest_substring(s: str) -> int:
    char_index = {}
    left = 0
    max_len = 0
    for right, char in enumerate(s):
        if char in char_index and char_index[char] >= left:
            left = char_index[char] + 1
        char_index[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len`,
    cases: [
      {name: 'Standard repeating characters', check: 'length_of_longest_substring("abcabcbb") == 3'},
      {name: 'All identical characters', check: 'length_of_longest_substring("bbbbb") == 1'},
      {name: 'Contains overlapping substrings', check: 'length_of_longest_substring("pwwkew") == 3'},
      {name: 'Empty string boundary', check: 'length_of_longest_substring("") == 0'},
      {name: 'Two unique characters', check: 'length_of_longest_substring("au") == 2'},
    ],
    hints: [
      'Use a dictionary char_index mapping characters to their last seen index.',
      'Maintain a left window boundary. When encountering a duplicate inside the current window, move left to char_index[char] + 1.',
      'Update max_len with right - left + 1 on every iteration.',
    ],
    approaches: [
      {name: 'Variable Sliding Window with Hash Map', time: 'O(N)', space: 'O(min(N, M))', description: 'Advance right pointer and jump left pointer directly past duplicates.'},
    ],
    explanation: 'By storing the last observed index of each character, when a duplicate appears we can jump the left pointer forward in O(1) time without stepping through intermediate indices.',
  },

  // ==========================================
  // TOPIC 6: RECURSION & BACKTRACKING (4)
  // ==========================================
  {
    id: 'fibonacci-recursion',
    title: 'Fibonacci Number with Base Cases & Call Tracing',
    topic: 'recursion-backtracking',
    difficulty: 'Beginner',
    estimatedMinutes: 10,
    prompt: 'The Fibonacci numbers, commonly denoted $F(n)$, form a sequence where each number is the sum of the two preceding ones, starting from 0 and 1:\n- $F(0) = 0, F(1) = 1$\n- $F(n) = F(n - 1) + F(n - 2)$ for $n > 1$\n\nGiven $n$, calculate $F(n)$. Include explicit base cases to avoid infinite recursion.',
    examples: [
      {input: 'n = 2', output: '1', explanation: 'F(2) = F(1) + F(0) = 1 + 0 = 1.'},
      {input: 'n = 3', output: '2', explanation: 'F(3) = F(2) + F(1) = 1 + 1 = 2.'},
      {input: 'n = 4', output: '3'},
    ],
    constraints: [
      '0 <= n <= 30',
    ],
    starterCode: `def fib(n: int) -> int:
    """Compute nth Fibonacci number with proper recursive base cases."""
    # Write your solution here
    pass`,
    solutionCode: `def fib(n: int) -> int:
    if n <= 0:
        return 0
    if n == 1:
        return 1
    # Iterative or memoized formulation for safety
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b`,
    cases: [
      {name: 'Base case 0', check: 'fib(0) == 0'},
      {name: 'Base case 1', check: 'fib(1) == 1'},
      {name: 'Small value 2', check: 'fib(2) == 1'},
      {name: 'Medium value 6', check: 'fib(6) == 8'},
      {name: 'Larger value 10', check: 'fib(10) == 55'},
    ],
    hints: [
      'Ensure base cases: if n <= 0 return 0; if n == 1 return 1.',
      'Notice that naive recursion fib(n-1) + fib(n-2) takes O(2^N) exponential time.',
      'Use memoization or an iterative accumulation loop to achieve O(N) time.',
    ],
    approaches: [
      {name: 'Naive Recursion', time: 'O(2^N)', space: 'O(N)', description: 'Binary tree of recursive calls recalculating subproblems repeatedly.'},
      {name: 'Dynamic Programming / Iterative', time: 'O(N)', space: 'O(1)', description: 'Accumulate the two previous states in two scalar variables.'},
    ],
    explanation: 'Explicit base cases prevent recursion depth overflow. Transitioning from tree recursion to bottom-up accumulation eliminates duplicate calculations, improving complexity from exponential O(2^N) to linear O(N).',
  },

  {
    id: 'power-calculation',
    title: 'Fast Exponentiation (Divide & Conquer Power)',
    topic: 'recursion-backtracking',
    difficulty: 'Intermediate',
    estimatedMinutes: 15,
    prompt: 'Implement `my_pow(x: float, n: int) -> float`, which calculates $x$ raised to the power $n$ ($x^n$).\n\nYour solution must execute in **$O(\\log N)$ time** using divide-and-conquer binary exponentiation.\n\nHandle negative exponents where $x^{-n} = \\frac{1}{x^n}$.',
    examples: [
      {input: 'x = 2.00000, n = 10', output: '1024.00000'},
      {input: 'x = 2.10000, n = 3', output: '9.26100'},
      {input: 'x = 2.00000, n = -2', output: '0.25000', explanation: '2^-2 = 1/(2^2) = 1/4 = 0.25.'},
    ],
    constraints: [
      '-100.0 < x < 100.0',
      '-2^31 <= n <= 2^31 - 1',
      'n is an integer',
    ],
    starterCode: `def my_pow(x: float, n: int) -> float:
    """Calculate x^n in O(log n) time using divide-and-conquer exponentiation."""
    # Write your solution here
    pass`,
    solutionCode: `def my_pow(x: float, n: int) -> float:
    if n == 0:
        return 1.0
    if n < 0:
        x = 1.0 / x
        n = -n
    half = my_pow(x, n // 2)
    if n % 2 == 0:
        return half * half
    else:
        return half * half * x`,
    cases: [
      {name: 'Standard integer power', check: 'abs(my_pow(2.0, 10) - 1024.0) < 1e-5'},
      {name: 'Float base', check: 'abs(my_pow(2.1, 3) - 9.261) < 1e-4'},
      {name: 'Negative exponent', check: 'abs(my_pow(2.0, -2) - 0.25) < 1e-5'},
      {name: 'Zero exponent', check: 'my_pow(5.0, 0) == 1.0'},
    ],
    hints: [
      'Notice that x^n = (x^(n//2))^2 when n is even.',
      'When n is odd, x^n = (x^(n//2))^2 * x.',
      'Handle negative exponents: if n < 0, compute (1/x)^(-n).',
    ],
    approaches: [
      {name: 'Linear Iteration', time: 'O(N)', space: 'O(1)', description: 'Multiplying x by itself n times takes O(N) operations.'},
      {name: 'Binary Exponentiation', time: 'O(log N)', space: 'O(log N)', description: 'Halve the exponent on each step with divide and conquer.'},
    ],
    explanation: 'By computing half = my_pow(x, n // 2) only once, the problem size halves on every recursive step, enabling 2^1,000,000,000 to be computed in roughly 30 multiplications.',
  },

  {
    id: 'generate-parentheses',
    title: 'Generate Well-Formed Parentheses',
    topic: 'recursion-backtracking',
    difficulty: 'Intermediate',
    estimatedMinutes: 18,
    prompt: 'Given `n` pairs of parentheses, write a function to generate all combinations of well-formed parentheses.\n\nYour solution must use backtracking with count invariants (never place a closing parenthesis unless there are open ones to match).',
    examples: [
      {input: 'n = 3', output: '["((()))", "(()())", "(())()", "()(())", "()()()"]'},
      {input: 'n = 1', output: '["()"]'},
    ],
    constraints: [
      '1 <= n <= 8',
    ],
    starterCode: `def generate_parentheses(n: int) -> list[str]:
    """Generate all combinations of n well-formed parentheses pairs."""
    # Write your solution here
    pass`,
    solutionCode: `def generate_parentheses(n: int) -> list[str]:
    result = []
    def backtrack(current: str, open_count: int, close_count: int):
        if len(current) == 2 * n:
            result.append(current)
            return
        if open_count < n:
            backtrack(current + '(', open_count + 1, close_count)
        if close_count < open_count:
            backtrack(current + ')', open_count, close_count + 1)
    backtrack("", 0, 0)
    return result`,
    cases: [
      {name: 'Three pairs combinations', check: 'sorted(generate_parentheses(3)) == ["((()))", "(()())", "(())()", "()(())", "()()()"]'},
      {name: 'Single pair', check: 'generate_parentheses(1) == ["()"]'},
      {name: 'Two pairs', check: 'sorted(generate_parentheses(2)) == ["(())", "()()"]'},
      {name: 'Zero pairs boundary', check: 'generate_parentheses(0) == [""]'},
    ],
    hints: [
      'Maintain open_count and close_count in your recursive helper.',
      'You can add an open bracket if open_count < n.',
      'You can only add a close bracket if close_count < open_count.',
    ],
    approaches: [
      {name: 'Backtracking with Pruning', time: 'O(4^N / sqrt(N))', space: 'O(N)', description: 'Generate only valid prefixes by enforcing count invariants.'},
    ],
    explanation: 'Enforcing the condition close_count < open_count prunes invalid branches immediately, avoiding generating and checking 2^(2N) arbitrary binary strings.',
  },

  {
    id: 'subsets-generation',
    title: 'Generate All Subsets (Power Set)',
    topic: 'recursion-backtracking',
    difficulty: 'Advanced',
    estimatedMinutes: 20,
    prompt: 'Given an integer array `nums` of **unique** elements, return all possible subsets (the power set).\n\nThe solution set **must not contain duplicate subsets**. Return the solution in any order.',
    examples: [
      {input: 'nums = [1, 2, 3]', output: '[[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]'},
      {input: 'nums = [0]', output: '[[], [0]]'},
    ],
    constraints: [
      '1 <= len(nums) <= 10',
      '-10 <= nums[i] <= 10',
      'All numbers of nums are unique',
    ],
    starterCode: `def subsets(nums: list[int]) -> list[list[int]]:
    """Generate all subsets of unique elements using backtracking."""
    # Write your solution here
    pass`,
    solutionCode: `def subsets(nums: list[int]) -> list[list[int]]:
    result = []
    current = []
    def backtrack(index: int):
        if index == len(nums):
            result.append(list(current))
            return
        # Decision 1: Exclude nums[index]
        backtrack(index + 1)
        # Decision 2: Include nums[index]
        current.append(nums[index])
        backtrack(index + 1)
        current.pop() # Backtrack state
    backtrack(0)
    return result`,
    cases: [
      {name: 'Three element subsets', check: 'sorted([sorted(s) for s in subsets([1, 2, 3])]) == [[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]'},
      {name: 'Single element subset', check: 'sorted([sorted(s) for s in subsets([0])]) == [[], [0]]'},
      {name: 'Two elements', check: 'sorted([sorted(s) for s in subsets([1, 2])]) == [[], [1], [1, 2], [2]]'},
      {name: 'Empty list boundary', check: 'subsets([]) == [[]]'},
    ],
    hints: [
      'For every element, you make a binary decision: either include it in current subset, or exclude it.',
      'Recurse with backtrack(index + 1). Then append nums[index], recurse again, and pop() to undo the choice.',
      'A set of size N has exactly 2^N total subsets.',
    ],
    approaches: [
      {name: 'Backtracking Decision Tree', time: 'O(N * 2^N)', space: 'O(N)', description: 'Explore inclusion and exclusion branches at each step.'},
    ],
    explanation: 'Every element presents a binary choice (include vs exclude). Backtracking traverses the 2^N tree depth-first while reusing the current path list via push/pop.',
  },
];
