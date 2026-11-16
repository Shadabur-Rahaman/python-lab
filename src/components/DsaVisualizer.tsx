import {useState} from 'react';
import {
  Play,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Layers,
  Search,
  MoveHorizontal,
  Database,
  GitBranch,
  ArrowDownUp,
  Info,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export type VisualizerType =
  | 'binary-search'
  | 'two-pointer'
  | 'sliding-window'
  | 'stack-parentheses'
  | 'recursive-callstack'
  | 'insertion-sort';

type VisualizerDef = {
  id: VisualizerType;
  title: string;
  tagline: string;
  category: string;
  icon: any;
  steps: {
    description: string;
    codeLine: string;
    state: any;
  }[];
};

const VISUALIZERS: Record<VisualizerType, VisualizerDef> = {
  'binary-search': {
    id: 'binary-search',
    title: 'Binary Search Invariants & Halving',
    tagline: 'Track low, mid, and high pointers cutting the sorted search space in half',
    category: 'Searching',
    icon: Search,
    steps: [
      {
        description: 'Initialize left=0 and right=9 covering the entire sorted array. Search target is 23.',
        codeLine: 'left, right = 0, len(nums) - 1  # [0, 9]',
        state: {
          array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91],
          left: 0,
          right: 9,
          mid: null,
          target: 23,
          status: 'initial',
        },
      },
      {
        description: 'Calculate mid = (0 + 9) // 2 = 4. Element nums[4] is 16. Since 16 < 23, the target must be in the right half.',
        codeLine: 'mid = (left + right) // 2  # mid = 4 (value: 16 < 23)',
        state: {
          array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91],
          left: 0,
          right: 9,
          mid: 4,
          target: 23,
          status: 'inspecting',
        },
      },
      {
        description: 'Eliminate indices 0 to 4 by advancing left = mid + 1 = 5. Candidate range is now indices [5, 9].',
        codeLine: 'left = mid + 1  # left = 5, right = 9',
        state: {
          array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91],
          left: 5,
          right: 9,
          mid: null,
          target: 23,
          status: 'discarded-left',
        },
      },
      {
        description: 'Calculate mid = (5 + 9) // 2 = 7. Element nums[7] is 56. Since 56 > 23, the target must be in the left half.',
        codeLine: 'mid = (left + right) // 2  # mid = 7 (value: 56 > 23)',
        state: {
          array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91],
          left: 5,
          right: 9,
          mid: 7,
          target: 23,
          status: 'inspecting',
        },
      },
      {
        description: 'Eliminate indices 7 to 9 by setting right = mid - 1 = 6. Active interval is now [5, 6].',
        codeLine: 'right = mid - 1  # left = 5, right = 6',
        state: {
          array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91],
          left: 5,
          right: 6,
          mid: null,
          target: 23,
          status: 'discarded-right',
        },
      },
      {
        description: 'Calculate mid = (5 + 6) // 2 = 5. Element nums[5] is 23. Match found! nums[5] == 23.',
        codeLine: 'if nums[mid] == target: return mid  # return 5',
        state: {
          array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91],
          left: 5,
          right: 6,
          mid: 5,
          target: 23,
          status: 'found',
        },
      },
    ],
  },

  'two-pointer': {
    id: 'two-pointer',
    title: 'Converging Two-Pointer Traversal',
    tagline: 'Observe two pointers converging from both ends of a sorted array to find a target sum',
    category: 'Two Pointers',
    icon: MoveHorizontal,
    steps: [
      {
        description: 'Start with left=0 (val: 1) and right=6 (val: 15). Target sum is 14.',
        codeLine: 'left, right = 0, len(nums) - 1',
        state: {
          array: [1, 3, 4, 6, 8, 11, 15],
          left: 0,
          right: 6,
          currentSum: 16,
          target: 14,
          status: 'too-high',
        },
      },
      {
        description: 'Sum is 1 + 15 = 16. Since 16 > 14, decrease the sum by moving right pointer leftward (right = 5).',
        codeLine: 'if current_sum > target: right -= 1  # right = 5',
        state: {
          array: [1, 3, 4, 6, 8, 11, 15],
          left: 0,
          right: 5,
          currentSum: 12,
          target: 14,
          status: 'too-low',
        },
      },
      {
        description: 'Sum is 1 + 11 = 12. Since 12 < 14, increase the sum by moving left pointer rightward (left = 1).',
        codeLine: 'elif current_sum < target: left += 1  # left = 1',
        state: {
          array: [1, 3, 4, 6, 8, 11, 15],
          left: 1,
          right: 5,
          currentSum: 14,
          target: 14,
          status: 'found',
        },
      },
      {
        description: 'Sum is 3 + 11 = 14. Target found! Pair (nums[1]=3, nums[5]=11) adds to 14.',
        codeLine: 'return [left + 1, right + 1]  # 1-indexed: [2, 6]',
        state: {
          array: [1, 3, 4, 6, 8, 11, 15],
          left: 1,
          right: 5,
          currentSum: 14,
          target: 14,
          status: 'found',
        },
      },
    ],
  },

  'sliding-window': {
    id: 'sliding-window',
    title: 'Fixed Sliding Window: Maximum Sum Subarray (k=3)',
    tagline: 'Slide a window of size 3 in O(1) time per step by adding incoming and subtracting outgoing values',
    category: 'Sliding Window',
    icon: Layers,
    steps: [
      {
        description: 'Initialize initial window [2, 1, 5] of size k=3. Sum = 2 + 1 + 5 = 8. Best sum = 8.',
        codeLine: 'window_sum = sum(nums[:3])  # 2 + 1 + 5 = 8',
        state: {
          array: [2, 1, 5, 1, 3, 2],
          windowStart: 0,
          windowEnd: 2,
          windowSum: 8,
          maxSum: 8,
          incoming: null,
          outgoing: null,
        },
      },
      {
        description: 'Slide window to [1, 5, 1]. Outgoing: 2 (evicted), Incoming: 1 (added). New sum = 8 - 2 + 1 = 7. Best remains 8.',
        codeLine: 'window_sum += nums[3] - nums[0]  # 8 + 1 - 2 = 7',
        state: {
          array: [2, 1, 5, 1, 3, 2],
          windowStart: 1,
          windowEnd: 3,
          windowSum: 7,
          maxSum: 8,
          incoming: 1,
          outgoing: 2,
        },
      },
      {
        description: 'Slide window to [5, 1, 3]. Outgoing: 1, Incoming: 3. New sum = 7 - 1 + 3 = 9. New maximum sum = 9!',
        codeLine: 'window_sum += nums[4] - nums[1]  # 7 + 3 - 1 = 9',
        state: {
          array: [2, 1, 5, 1, 3, 2],
          windowStart: 2,
          windowEnd: 4,
          windowSum: 9,
          maxSum: 9,
          incoming: 3,
          outgoing: 1,
        },
      },
      {
        description: 'Slide window to [1, 3, 2]. Outgoing: 5, Incoming: 2. New sum = 9 - 5 + 2 = 6. Maximum remains 9.',
        codeLine: 'window_sum += nums[5] - nums[2]  # 9 + 2 - 5 = 6',
        state: {
          array: [2, 1, 5, 1, 3, 2],
          windowStart: 3,
          windowEnd: 5,
          windowSum: 6,
          maxSum: 9,
          incoming: 2,
          outgoing: 5,
        },
      },
      {
        description: 'End of array reached. The maximum contiguous subarray sum of size 3 is 9 ([5, 1, 3]).',
        codeLine: 'return max_sum  # 9',
        state: {
          array: [2, 1, 5, 1, 3, 2],
          windowStart: 3,
          windowEnd: 5,
          windowSum: 6,
          maxSum: 9,
          incoming: null,
          outgoing: null,
          completed: true,
        },
      },
    ],
  },

  'stack-parentheses': {
    id: 'stack-parentheses',
    title: 'Stack LIFO Bracket Validation',
    tagline: 'Push opening brackets to stack and pop matching pairs on closing symbols',
    category: 'Stacks',
    icon: Database,
    steps: [
      {
        description: 'Parsing "{ [ ( ) ] }". Start with an empty stack.',
        codeLine: 'stack = []',
        state: {
          input: ['{', '[', '(', ')', ']', '}'],
          currentIndex: -1,
          stack: [],
          action: 'init',
        },
      },
      {
        description: 'Char 0: "{" is an opening bracket. Push onto stack.',
        codeLine: 'stack.append("{")',
        state: {
          input: ['{', '[', '(', ')', ']', '}'],
          currentIndex: 0,
          stack: ['{'],
          action: 'push',
        },
      },
      {
        description: 'Char 1: "[" is an opening bracket. Push onto stack.',
        codeLine: 'stack.append("[")',
        state: {
          input: ['{', '[', '(', ')', ']', '}'],
          currentIndex: 1,
          stack: ['{', '['],
          action: 'push',
        },
      },
      {
        description: 'Char 2: "(" is an opening bracket. Push onto stack.',
        codeLine: 'stack.append("(")',
        state: {
          input: ['{', '[', '(', ')', ']', '}'],
          currentIndex: 2,
          stack: ['{', '[', '('],
          action: 'push',
        },
      },
      {
        description: 'Char 3: ")" is a closing bracket. Top of stack is "(". Match found! Pop "(".',
        codeLine: 'if stack[-1] == "(": stack.pop()',
        state: {
          input: ['{', '[', '(', ')', ']', '}'],
          currentIndex: 3,
          stack: ['{', '['],
          action: 'pop-match',
        },
      },
      {
        description: 'Char 4: "]" is a closing bracket. Top of stack is "[". Match found! Pop "[".',
        codeLine: 'if stack[-1] == "[": stack.pop()',
        state: {
          input: ['{', '[', '(', ')', ']', '}'],
          currentIndex: 4,
          stack: ['{'],
          action: 'pop-match',
        },
      },
      {
        description: 'Char 5: "}" is a closing bracket. Top of stack is "{". Match found! Pop "{".',
        codeLine: 'if stack[-1] == "{": stack.pop()',
        state: {
          input: ['{', '[', '(', ')', ']', '}'],
          currentIndex: 5,
          stack: [],
          action: 'pop-match',
        },
      },
      {
        description: 'All characters processed. Stack is completely empty. String is valid!',
        codeLine: 'return len(stack) == 0  # True',
        state: {
          input: ['{', '[', '(', ')', ']', '}'],
          currentIndex: 5,
          stack: [],
          action: 'valid',
        },
      },
    ],
  },

  'recursive-callstack': {
    id: 'recursive-callstack',
    title: 'Recursive Call Stack Execution Frames',
    tagline: 'Visualize call frames pushing down to the base case and unwinding return values',
    category: 'Recursion',
    icon: GitBranch,
    steps: [
      {
        description: 'Invoking factorial(4). Call frame factorial(4) is pushed onto the Python call stack.',
        codeLine: 'def factorial(n):  # factorial(4)',
        state: {
          frames: [{call: 'factorial(4)', depth: 1, waitingOn: 'factorial(3)'}],
          unwinding: false,
        },
      },
      {
        description: 'factorial(4) needs factorial(3). Pushing factorial(3) frame onto call stack.',
        codeLine: 'return n * factorial(n - 1)  # 4 * factorial(3)',
        state: {
          frames: [
            {call: 'factorial(4)', depth: 1, waitingOn: 'factorial(3)'},
            {call: 'factorial(3)', depth: 2, waitingOn: 'factorial(2)'},
          ],
          unwinding: false,
        },
      },
      {
        description: 'factorial(3) needs factorial(2). Pushing factorial(2) frame onto call stack.',
        codeLine: 'return n * factorial(n - 1)  # 3 * factorial(2)',
        state: {
          frames: [
            {call: 'factorial(4)', depth: 1, waitingOn: 'factorial(3)'},
            {call: 'factorial(3)', depth: 2, waitingOn: 'factorial(2)'},
            {call: 'factorial(2)', depth: 3, waitingOn: 'factorial(1)'},
          ],
          unwinding: false,
        },
      },
      {
        description: 'factorial(2) needs factorial(1). Pushing factorial(1) frame onto call stack.',
        codeLine: 'return n * factorial(n - 1)  # 2 * factorial(1)',
        state: {
          frames: [
            {call: 'factorial(4)', depth: 1, waitingOn: 'factorial(3)'},
            {call: 'factorial(3)', depth: 2, waitingOn: 'factorial(2)'},
            {call: 'factorial(2)', depth: 3, waitingOn: 'factorial(1)'},
            {call: 'factorial(1)', depth: 4, waitingOn: 'Base Case!'},
          ],
          unwinding: false,
        },
      },
      {
        description: 'Base Case reached! When n <= 1, factorial(1) immediately returns 1 without further recursive calls.',
        codeLine: 'if n <= 1: return 1  # Base Case: returns 1',
        state: {
          frames: [
            {call: 'factorial(4)', depth: 1, waitingOn: 'factorial(3)'},
            {call: 'factorial(3)', depth: 2, waitingOn: 'factorial(2)'},
            {call: 'factorial(2)', depth: 3, waitingOn: 'factorial(1)'},
            {call: 'factorial(1) -> 1', depth: 4, returnValue: 1},
          ],
          unwinding: true,
        },
      },
      {
        description: 'Unwinding call stack: factorial(2) computes 2 * 1 = 2 and returns 2.',
        codeLine: 'return 2 * 1  # factorial(2) returns 2',
        state: {
          frames: [
            {call: 'factorial(4)', depth: 1, waitingOn: 'factorial(3)'},
            {call: 'factorial(3)', depth: 2, waitingOn: 'factorial(2)'},
            {call: 'factorial(2) -> 2', depth: 3, returnValue: 2},
          ],
          unwinding: true,
        },
      },
      {
        description: 'Unwinding call stack: factorial(3) computes 3 * 2 = 6 and returns 6.',
        codeLine: 'return 3 * 2  # factorial(3) returns 6',
        state: {
          frames: [
            {call: 'factorial(4)', depth: 1, waitingOn: 'factorial(3)'},
            {call: 'factorial(3) -> 6', depth: 2, returnValue: 6},
          ],
          unwinding: true,
        },
      },
      {
        description: 'Unwinding call stack: factorial(4) computes 4 * 6 = 24 and returns final result: 24!',
        codeLine: 'return 4 * 6  # final result: 24',
        state: {
          frames: [{call: 'factorial(4) -> 24', depth: 1, returnValue: 24}],
          unwinding: true,
          completed: true,
        },
      },
    ],
  },

  'insertion-sort': {
    id: 'insertion-sort',
    title: 'Insertion Sort Walkthrough',
    tagline: 'Build a sorted partition element-by-element by shifting larger values rightward',
    category: 'Sorting',
    icon: ArrowDownUp,
    steps: [
      {
        description: 'Starting with unsorted array [7, 3, 5, 2]. Index 0 ([7]) is trivially sorted as a 1-element partition.',
        codeLine: 'for i in range(1, len(nums)):  # i = 1 (val: 3)',
        state: {
          array: [7, 3, 5, 2],
          sortedUntil: 0,
          currentKey: 3,
          currentIndex: 1,
        },
      },
      {
        description: 'Insert 3: compare with 7. Since 7 > 3, shift 7 right into index 1. Place 3 at index 0. Sorted partition: [3, 7].',
        codeLine: 'nums[j + 1] = nums[j] ... nums[0] = key',
        state: {
          array: [3, 7, 5, 2],
          sortedUntil: 1,
          currentKey: 5,
          currentIndex: 2,
        },
      },
      {
        description: 'Insert 5: compare with 7. Since 7 > 5, shift 7 right into index 2. Compare 5 with 3: 3 <= 5. Place 5 at index 1. Sorted: [3, 5, 7].',
        codeLine: 'nums[j + 1] = nums[j] ... nums[1] = key',
        state: {
          array: [3, 5, 7, 2],
          sortedUntil: 2,
          currentKey: 2,
          currentIndex: 3,
        },
      },
      {
        description: 'Insert 2: 2 is smaller than 7, 5, and 3. Shift 7, 5, and 3 right. Place 2 at index 0. Entire array [2, 3, 5, 7] is sorted!',
        codeLine: 'nums[0] = key  # Array fully sorted!',
        state: {
          array: [2, 3, 5, 7],
          sortedUntil: 3,
          currentKey: null,
          currentIndex: null,
          completed: true,
        },
      },
    ],
  },
};

type Props = {
  initialType?: VisualizerType;
};

export default function DsaVisualizer({initialType = 'binary-search'}: Props) {
  const [activeType, setActiveType] = useState<VisualizerType>(initialType);
  const [stepIndex, setStepIndex] = useState(0);

  const visualizer = VISUALIZERS[activeType] || VISUALIZERS['binary-search'];
  const currentStep = visualizer.steps[stepIndex] || visualizer.steps[0];
  const totalSteps = visualizer.steps.length;

  function handleSelectType(type: VisualizerType) {
    setActiveType(type);
    setStepIndex(0);
  }

  function handlePrev() {
    setStepIndex(idx => Math.max(0, idx - 1));
  }

  function handleNext() {
    setStepIndex(idx => Math.min(totalSteps - 1, idx + 1));
  }

  function handleReset() {
    setStepIndex(0);
  }

  return (
    <div className="dsa-visualizer-suite card" id="dsa-visualizers">
      <div className="visualizer-header">
        <div>
          <span className="eyebrow">
            <Sparkles size={14} /> ALGORITHM STEPPER & INVARIANT INSPECTOR
          </span>
          <h3>{visualizer.title}</h3>
          <p className="visualizer-tagline">{visualizer.tagline}</p>
        </div>
        <div className="badge-walkthrough">
          <Info size={13} />
          <span>Illustrative Step-by-Step Walkthrough</span>
        </div>
      </div>

      {/* Visualizer Type Selector */}
      <div className="visualizer-tabs-nav" role="tablist" aria-label="Algorithm Visualizers">
        {(Object.keys(VISUALIZERS) as VisualizerType[]).map(typeKey => {
          const v = VISUALIZERS[typeKey];
          const Icon = v.icon;
          const isActive = typeKey === activeType;
          return (
            <button
              key={typeKey}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`visualizer-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleSelectType(typeKey)}
            >
              <Icon size={14} />
              <span>{v.title.split(':')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage */}
      <div className="visualizer-stage-card">
        {/* Step Progress & Controls */}
        <div className="visualizer-controls-bar">
          <div className="step-indicator">
            <strong>Step {stepIndex + 1}</strong> of {totalSteps}
          </div>
          <div className="stepper-actions">
            <button
              type="button"
              className="button small"
              onClick={handleReset}
              title="Reset to beginning"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
            <button
              type="button"
              className="button small"
              onClick={handlePrev}
              disabled={stepIndex === 0}
              title="Previous Step"
            >
              <ChevronLeft size={14} />
              <span>Prev</span>
            </button>
            <button
              type="button"
              className="button primary small"
              onClick={handleNext}
              disabled={stepIndex === totalSteps - 1}
              title="Next Step"
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Step Description Box */}
        <div className="step-explanation-box">
          <p>{currentStep.description}</p>
          <div className="code-snippet-preview">
            <code>{currentStep.codeLine}</code>
          </div>
        </div>

        {/* Dynamic Visual Rendering */}
        <div className="visualizer-display-canvas">
          {/* Binary Search Canvas */}
          {activeType === 'binary-search' && (
            <div className="canvas-binary-search">
              <div className="target-pill">Target = {currentStep.state.target}</div>
              <div className="array-cells-track">
                {currentStep.state.array.map((val: number, idx: number) => {
                  const isLeft = idx === currentStep.state.left;
                  const isRight = idx === currentStep.state.right;
                  const isMid = idx === currentStep.state.mid;
                  const isExcluded =
                    idx < currentStep.state.left || idx > currentStep.state.right;
                  const isFound = idx === currentStep.state.mid && currentStep.state.status === 'found';

                  return (
                    <div
                      key={idx}
                      className={`array-cell ${isMid ? 'mid-cell' : ''} ${
                        isExcluded ? 'excluded-cell' : ''
                      } ${isFound ? 'found-cell' : ''}`}
                    >
                      <span className="cell-index">[{idx}]</span>
                      <strong className="cell-value">{val}</strong>
                      <div className="cell-pointers">
                        {isLeft && <span className="pointer-tag left-tag">L</span>}
                        {isMid && <span className="pointer-tag mid-tag">M</span>}
                        {isRight && <span className="pointer-tag right-tag">R</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Two-Pointer Canvas */}
          {activeType === 'two-pointer' && (
            <div className="canvas-two-pointer">
              <div className="target-pill">
                Target Sum = {currentStep.state.target} | Current Sum = {currentStep.state.currentSum}
              </div>
              <div className="array-cells-track">
                {currentStep.state.array.map((val: number, idx: number) => {
                  const isLeft = idx === currentStep.state.left;
                  const isRight = idx === currentStep.state.right;
                  const isFound =
                    (isLeft || isRight) && currentStep.state.status === 'found';

                  return (
                    <div
                      key={idx}
                      className={`array-cell ${isLeft ? 'left-cell' : ''} ${
                        isRight ? 'right-cell' : ''
                      } ${isFound ? 'found-cell' : ''}`}
                    >
                      <span className="cell-index">[{idx}]</span>
                      <strong className="cell-value">{val}</strong>
                      <div className="cell-pointers">
                        {isLeft && <span className="pointer-tag left-tag">Left</span>}
                        {isRight && <span className="pointer-tag right-tag">Right</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sliding Window Canvas */}
          {activeType === 'sliding-window' && (
            <div className="canvas-sliding-window">
              <div className="target-pill">
                Window Sum = {currentStep.state.windowSum} | Max Sum Found = {currentStep.state.maxSum}
              </div>
              <div className="array-cells-track">
                {currentStep.state.array.map((val: number, idx: number) => {
                  const inWindow =
                    idx >= currentStep.state.windowStart &&
                    idx <= currentStep.state.windowEnd;
                  return (
                    <div
                      key={idx}
                      className={`array-cell ${inWindow ? 'window-cell' : ''}`}
                    >
                      <span className="cell-index">[{idx}]</span>
                      <strong className="cell-value">{val}</strong>
                      {inWindow && <div className="window-indicator-bar" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stack Canvas */}
          {activeType === 'stack-parentheses' && (
            <div className="canvas-stack">
              <div className="stack-input-stream">
                <span>Input Expression: </span>
                {currentStep.state.input.map((char: string, idx: number) => (
                  <span
                    key={idx}
                    className={`stream-char ${
                      idx === currentStep.state.currentIndex ? 'active-char' : ''
                    }`}
                  >
                    {char}
                  </span>
                ))}
              </div>
              <div className="stack-vertical-bin">
                <div className="bin-label">LIFO Stack (Top at Top)</div>
                {currentStep.state.stack.length === 0 ? (
                  <div className="empty-stack-placeholder">Stack is Empty</div>
                ) : (
                  currentStep.state.stack
                    .slice()
                    .reverse()
                    .map((item: string, idx: number) => (
                      <div key={idx} className="stack-item-card">
                        {item}
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

          {/* Recursive Call Stack Canvas */}
          {activeType === 'recursive-callstack' && (
            <div className="canvas-callstack">
              <div className="callstack-frames-list">
                {currentStep.state.frames.map((frame: any, idx: number) => (
                  <div key={idx} className="callstack-frame-card">
                    <div className="frame-header">
                      <span className="frame-depth">Frame #{frame.depth}</span>
                      <strong>{frame.call}</strong>
                    </div>
                    <div className="frame-body">
                      {frame.returnValue ? (
                        <span className="frame-return">
                          <CheckCircle2 size={13} /> Returned: {frame.returnValue}
                        </span>
                      ) : (
                        <span className="frame-waiting">Waiting on: {frame.waitingOn}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insertion Sort Canvas */}
          {activeType === 'insertion-sort' && (
            <div className="canvas-sorting">
              <div className="target-pill">
                Sorted Partition: [0 to {currentStep.state.sortedUntil}]
              </div>
              <div className="array-cells-track">
                {currentStep.state.array.map((val: number, idx: number) => {
                  const isSorted = idx <= currentStep.state.sortedUntil;
                  const isKey = idx === currentStep.state.currentIndex;
                  return (
                    <div
                      key={idx}
                      className={`array-cell ${isSorted ? 'sorted-cell' : ''} ${
                        isKey ? 'key-cell' : ''
                      }`}
                    >
                      <span className="cell-index">[{idx}]</span>
                      <strong className="cell-value">{val}</strong>
                      <div className="cell-pointers">
                        {isSorted && <span className="pointer-tag left-tag">Sorted</span>}
                        {isKey && <span className="pointer-tag mid-tag">Key</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
