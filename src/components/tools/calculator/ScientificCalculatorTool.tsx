import React, { useState, useEffect, useCallback } from 'react';
import { Copy, Check, RotateCcw, Delete, History, Trash2, Sparkles, Calculator as CalcIcon } from 'lucide-react';

interface ScientificCalculatorToolProps {
  onShowToast: (message: string) => void;
}

interface HistoryItem {
  id: string;
  expression: string;
  result: string;
}

export const ScientificCalculatorTool: React.FC<ScientificCalculatorToolProps> = ({ onShowToast }) => {
  const [expression, setExpression] = useState<string>('');
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [isRadMode, setIsRadMode] = useState<boolean>(true); // true = Radian, false = Degree
  const [memory, setMemory] = useState<number>(0);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem('splitdrop_calc_history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [copied, setCopied] = useState<boolean>(false);

  // Safe mathematical parser & evaluator without eval()
  const evaluateMath = useCallback((expr: string, isRad: boolean): number => {
    let clean = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, `${Math.PI}`)
      .replace(/\be\b/g, `${Math.E}`);

    // Helper for factorial
    const factorial = (n: number): number => {
      if (n < 0 || Math.floor(n) !== n) return NaN;
      if (n === 0 || n === 1) return 1;
      let res = 1;
      for (let i = 2; i <= n; i++) res *= i;
      return res;
    };

    // Parse functions like sin, cos, tan, log, ln, sqrt, etc.
    // Replace sin(x)
    const trigFactor = isRad ? 1 : Math.PI / 180;
    const invTrigFactor = isRad ? 1 : 180 / Math.PI;

    // Tokenizer & Shunting-yard algorithm
    const tokenize = (input: string): string[] => {
      const tokens: string[] = [];
      let i = 0;
      while (i < input.length) {
        const char = input[i];
        if (/\s/.test(char)) {
          i++;
          continue;
        }
        if (/[0-9.]/.test(char)) {
          let num = '';
          while (i < input.length && /[0-9.]/.test(input[i])) {
            num += input[i];
            i++;
          }
          tokens.push(num);
          continue;
        }
        if (/[a-zA-Z]/.test(char)) {
          let fn = '';
          while (i < input.length && /[a-zA-Z0-9]/.test(input[i])) {
            fn += input[i];
            i++;
          }
          tokens.push(fn);
          continue;
        }
        if (['+', '-', '*', '/', '^', '%', '(', ')', '!'].includes(char)) {
          tokens.push(char);
          i++;
          continue;
        }
        i++;
      }
      return tokens;
    };

    const tokens = tokenize(clean);

    // Operator precedence
    const precedence: Record<string, number> = {
      '+': 1,
      '-': 1,
      '*': 2,
      '/': 2,
      '%': 2,
      '^': 3,
      '!': 4
    };

    const outputQueue: string[] = [];
    const operatorStack: string[] = [];

    tokens.forEach((token, index) => {
      if (!isNaN(Number(token))) {
        outputQueue.push(token);
      } else if (['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'log', 'ln', 'sqrt', 'cbrt', 'abs'].includes(token)) {
        operatorStack.push(token);
      } else if (token in precedence) {
        // Handle unary minus
        if (token === '-' && (index === 0 || ['(', '+', '-', '*', '/', '^'].includes(tokens[index - 1]))) {
          outputQueue.push('0');
        }
        while (
          operatorStack.length &&
          operatorStack[operatorStack.length - 1] !== '(' &&
          precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]
        ) {
          outputQueue.push(operatorStack.pop()!);
        }
        operatorStack.push(token);
      } else if (token === '(') {
        operatorStack.push(token);
      } else if (token === ')') {
        while (operatorStack.length && operatorStack[operatorStack.length - 1] !== '(') {
          outputQueue.push(operatorStack.pop()!);
        }
        operatorStack.pop(); // discard '('
        if (
          operatorStack.length &&
          ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'log', 'ln', 'sqrt', 'cbrt', 'abs'].includes(
            operatorStack[operatorStack.length - 1]
          )
        ) {
          outputQueue.push(operatorStack.pop()!);
        }
      }
    });

    while (operatorStack.length) {
      outputQueue.push(operatorStack.pop()!);
    }

    // Evaluate RPN
    const evalStack: number[] = [];
    outputQueue.forEach(token => {
      if (!isNaN(Number(token))) {
        evalStack.push(Number(token));
      } else if (token === '!') {
        const a = evalStack.pop() || 0;
        evalStack.push(factorial(a));
      } else if (['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'log', 'ln', 'sqrt', 'cbrt', 'abs'].includes(token)) {
        const a = evalStack.pop() || 0;
        switch (token) {
          case 'sin': evalStack.push(Math.sin(a * trigFactor)); break;
          case 'cos': evalStack.push(Math.cos(a * trigFactor)); break;
          case 'tan': evalStack.push(Math.tan(a * trigFactor)); break;
          case 'asin': evalStack.push(Math.asin(a) * invTrigFactor); break;
          case 'acos': evalStack.push(Math.acos(a) * invTrigFactor); break;
          case 'atan': evalStack.push(Math.atan(a) * invTrigFactor); break;
          case 'log': evalStack.push(Math.log10(a)); break;
          case 'ln': evalStack.push(Math.log(a)); break;
          case 'sqrt': evalStack.push(Math.sqrt(a)); break;
          case 'cbrt': evalStack.push(Math.cbrt(a)); break;
          case 'abs': evalStack.push(Math.abs(a)); break;
        }
      } else {
        const b = evalStack.pop() || 0;
        const a = evalStack.pop() || 0;
        switch (token) {
          case '+': evalStack.push(a + b); break;
          case '-': evalStack.push(a - b); break;
          case '*': evalStack.push(a * b); break;
          case '/': evalStack.push(b === 0 ? NaN : a / b); break;
          case '%': evalStack.push(a % b); break;
          case '^': evalStack.push(Math.pow(a, b)); break;
        }
      }
    });

    return evalStack.pop() ?? 0;
  }, []);

  const handleInput = (val: string) => {
    setExpression(prev => prev + val);
  };

  const handleClear = () => {
    setExpression('');
    setDisplayValue('0');
  };

  const handleDelete = () => {
    setExpression(prev => prev.slice(0, -1));
  };

  const handleCalculate = () => {
    if (!expression.trim()) return;
    try {
      const result = evaluateMath(expression, isRadMode);
      if (isNaN(result) || !isFinite(result)) {
        setDisplayValue('Error');
        onShowToast('Invalid mathematical expression');
        return;
      }

      // Format clean decimals
      const formatted = Number(result.toFixed(10)).toString();
      setDisplayValue(formatted);

      // Add to history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        expression,
        result: formatted
      };
      setHistory(prev => {
        const next = [newHistoryItem, ...prev].slice(0, 15);
        try {
          localStorage.setItem('splitdrop_calc_history', JSON.stringify(next));
        } catch {}
        return next;
      });

      setExpression(formatted);
    } catch {
      setDisplayValue('Error');
      onShowToast('Evaluation error');
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if ((e.key >= '0' && e.key <= '9') || ['.', '+', '-', '*', '/', '(', ')', '^', '%'].includes(e.key)) {
        e.preventDefault();
        const mapped = e.key === '*' ? '×' : e.key === '/' ? '÷' : e.key;
        handleInput(mapped);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleCalculate();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleDelete();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expression, isRadMode]);

  const handleCopyResult = () => {
    navigator.clipboard.writeText(displayValue);
    setCopied(true);
    onShowToast('Copied result to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('splitdrop_calc_history');
    } catch {}
    onShowToast('Calculation history cleared');
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Calculator Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calculator Body - 8 Cols */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-5">
          {/* Display Header */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRadMode(!isRadMode)}
                  className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold uppercase"
                >
                  {isRadMode ? 'RAD' : 'DEG'}
                </button>
                {memory !== 0 && <span className="font-bold text-indigo-500">M</span>}
              </div>
              <span className="truncate max-w-[200px]">{expression || '0'}</span>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-3xl sm:text-4xl font-black font-mono text-slate-900 dark:text-white tracking-tight truncate">
                {displayValue}
              </p>
              <button
                onClick={handleCopyResult}
                className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                title="Copy Result"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Keypad Grid */}
          <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
            {/* Row 1: Memory & Function controls */}
            <button
              onClick={() => { setMemory(0); onShowToast('Memory Cleared'); }}
              className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750 transition-all"
            >
              MC
            </button>
            <button
              onClick={() => { setExpression(prev => prev + memory.toString()); }}
              className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750 transition-all"
            >
              MR
            </button>
            <button
              onClick={() => {
                const cur = parseFloat(displayValue) || 0;
                setMemory(prev => prev + cur);
                onShowToast(`M+ (${memory + cur})`);
              }}
              className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750 transition-all"
            >
              M+
            </button>
            <button
              onClick={() => {
                const cur = parseFloat(displayValue) || 0;
                setMemory(prev => prev - cur);
                onShowToast(`M- (${memory - cur})`);
              }}
              className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750 transition-all"
            >
              M-
            </button>
            <button
              onClick={handleClear}
              className="py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900 transition-all"
            >
              C
            </button>

            {/* Row 2: Trig functions & Parens */}
            <button
              onClick={() => handleInput('sin(')}
              className="py-3 rounded-xl bg-indigo-50/70 dark:bg-slate-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-all"
            >
              sin
            </button>
            <button
              onClick={() => handleInput('cos(')}
              className="py-3 rounded-xl bg-indigo-50/70 dark:bg-slate-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-all"
            >
              cos
            </button>
            <button
              onClick={() => handleInput('tan(')}
              className="py-3 rounded-xl bg-indigo-50/70 dark:bg-slate-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-all"
            >
              tan
            </button>
            <button
              onClick={() => handleInput('(')}
              className="py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-all font-mono"
            >
              (
            </button>
            <button
              onClick={() => handleInput(')')}
              className="py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-all font-mono"
            >
              )
            </button>

            {/* Row 3: Logarithms, Sqrt, Exp */}
            <button
              onClick={() => handleInput('ln(')}
              className="py-3 rounded-xl bg-indigo-50/70 dark:bg-slate-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-all"
            >
              ln
            </button>
            <button
              onClick={() => handleInput('log(')}
              className="py-3 rounded-xl bg-indigo-50/70 dark:bg-slate-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-all"
            >
              log₁₀
            </button>
            <button
              onClick={() => handleInput('sqrt(')}
              className="py-3 rounded-xl bg-indigo-50/70 dark:bg-slate-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-all"
            >
              √x
            </button>
            <button
              onClick={() => handleInput('^')}
              className="py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-all"
            >
              xʸ
            </button>
            <button
              onClick={() => handleInput('÷')}
              className="py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm transition-all"
            >
              ÷
            </button>

            {/* Row 4: 7, 8, 9, Constants */}
            <button
              onClick={() => handleInput('π')}
              className="py-3 rounded-xl bg-indigo-50/70 dark:bg-slate-800 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-all"
            >
              π
            </button>
            <button
              onClick={() => handleInput('7')}
              className="py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-base font-bold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-750 transition-all font-mono"
            >
              7
            </button>
            <button
              onClick={() => handleInput('8')}
              className="py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-base font-bold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-750 transition-all font-mono"
            >
              8
            </button>
            <button
              onClick={() => handleInput('9')}
              className="py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-base font-bold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-750 transition-all font-mono"
            >
              9
            </button>
            <button
              onClick={() => handleInput('×')}
              className="py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm transition-all"
            >
              ×
            </button>

            {/* Row 5: 4, 5, 6, e */}
            <button
              onClick={() => handleInput('e')}
              className="py-3 rounded-xl bg-indigo-50/70 dark:bg-slate-800 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-all"
            >
              e
            </button>
            <button
              onClick={() => handleInput('4')}
              className="py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-base font-bold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-750 transition-all font-mono"
            >
              4
            </button>
            <button
              onClick={() => handleInput('5')}
              className="py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-base font-bold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-750 transition-all font-mono"
            >
              5
            </button>
            <button
              onClick={() => handleInput('6')}
              className="py-3 rounded-xl bg-slate-50 dark:bg-slate-850 text-base font-bold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-750 transition-all font-mono"
            >
              6
            </button>
            <button
              onClick={() => handleInput('-')}
              className="py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm transition-all"
            >
              -
            </button>

            {/* Row 6: 1, 2, 3, Factorial */}
            <button
              onClick={() => handleInput('!')}
              className="py-3 rounded-xl bg-indigo-50/70 dark:bg-slate-800 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-all"
            >
              n!
            </button>
            <button
              onClick={() => handleInput('1')}
              className="py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-base font-bold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-750 transition-all font-mono"
            >
              1
            </button>
            <button
              onClick={() => handleInput('2')}
              className="py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-base font-bold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-750 transition-all font-mono"
            >
              2
            </button>
            <button
              onClick={() => handleInput('3')}
              className="py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-base font-bold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-750 transition-all font-mono"
            >
              3
            </button>
            <button
              onClick={() => handleInput('+')}
              className="py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm transition-all"
            >
              +
            </button>

            {/* Row 7: 0, ., Del, Equals */}
            <button
              onClick={() => handleInput('%')}
              className="py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-all font-mono"
            >
              %
            </button>
            <button
              onClick={() => handleInput('0')}
              className="py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-base font-bold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-750 transition-all font-mono"
            >
              0
            </button>
            <button
              onClick={() => handleInput('.')}
              className="py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-base font-bold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-750 transition-all font-mono"
            >
              .
            </button>
            <button
              onClick={handleDelete}
              className="py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750 transition-all flex items-center justify-center"
              title="Delete"
            >
              <Delete className="w-4 h-4" />
            </button>
            <button
              onClick={handleCalculate}
              className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-md transition-all"
            >
              =
            </button>
          </div>
        </div>

        {/* Calculation History - 4 Cols */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col h-full max-h-[500px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <History className="w-4 h-4 text-indigo-500" />
              <span>Calculation History</span>
            </div>
            {history.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="text-slate-400 hover:text-rose-500 text-xs flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pt-3 pr-1">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-slate-400 text-xs text-center">
                <CalcIcon className="w-8 h-8 mb-2 opacity-30" />
                <span>Calculations will appear here</span>
              </div>
            ) : (
              history.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    setExpression(item.expression);
                    setDisplayValue(item.result);
                  }}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200/60 dark:border-slate-800 cursor-pointer transition-all text-right space-y-0.5 group"
                >
                  <div className="text-xs text-slate-400 font-mono truncate">{item.expression} =</div>
                  <div className="text-base font-bold font-mono text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                    {item.result}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
