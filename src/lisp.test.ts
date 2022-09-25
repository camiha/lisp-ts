import {
    tokenize,
    parseAtom,
    parenthesize,
    getFirst,
    getRest,
    evaluation,
} from './lisp';

// --------------------------------
// tokenize
// --------------------------------
test('should return a tokenize result 1', () => {
    const actual = tokenize('(+ 1 1)');
    expect(actual).toEqual(['(', '+', '1', '1', ')']);
});

test('should return a tokenize result 2', () => {
    const actual = tokenize('(+ 1 (+ 1 2))');
    expect(actual).toEqual(['(', '+', '1', '(', '+', '1', '2', ')', ')']);
});

// --------------------------------
// parseAtom
// --------------------------------
test('should return a number', () => {
    const actual = parseAtom('1');
    expect(actual).toEqual(1);
});

test('should return a float', () => {
    const actual = parseAtom('1.1');
    expect(actual).toEqual(1.1);
});

test('should return a string', () => {
    const actual = parseAtom('test');
    expect(actual).toEqual('test');
});

// --------------------------------
// parenthesize
// --------------------------------
test('should return a parenthesize result', () => {
    const actual = parenthesize(tokenize('(+ 1 (+ 1 2))'));
    expect(actual).toEqual(['+', 1, ['+', 1, 2]]);
});

// --------------------------------
// evaluation: util funcs
// --------------------------------
test('should get lists first atom', () => {
    const actual = getFirst([1, 2, 3, 4, 5]);
    expect(actual).toEqual(1);
});

test('should get rest params', () => {
    const actual = getRest([1, 2, 3, 4, 5]);
    expect(actual).toEqual([2, 3, 4, 5]);
});

// --------------------------------
// evaluation: execArithmeticOps
// --------------------------------
test('should evaluate a arithmetic expression 1', () => {
    const actual = evaluation(parenthesize(tokenize('(+ 1 2)')));
    expect(actual).toEqual(3);
});

test('should evaluate a arithmetic expression 2', () => {
    const actual = evaluation(parenthesize(tokenize('(+ 1 2 3 4)')));
    expect(actual).toEqual(10);
});

test('should evaluate a arithmetic expression 3', () => {
    const actual = evaluation(parenthesize(tokenize('(- 2 1)')));
    expect(actual).toEqual(1);
});

test('should evaluate a arithmetic expression 4', () => {
    const actual = evaluation(parenthesize(tokenize('(- 4 3 2 1)')));
    expect(actual).toEqual(-2);
});

test('should evaluate a arithmetic expression 5', () => {
    const actual = evaluation(parenthesize(tokenize('(* 2 2)')));
    expect(actual).toEqual(4);
});

test('should evaluate a arithmetic expression 6', () => {
    const actual = evaluation(parenthesize(tokenize('(* 2 2 2 2)')));
    expect(actual).toEqual(16);
});

test('should evaluate a arithmetic expression 7', () => {
    const actual = evaluation(parenthesize(tokenize('(/ 2 2)')));
    expect(actual).toEqual(1);
});

test('should evaluate a arithmetic expression 8', () => {
    const actual = evaluation(parenthesize(tokenize('(/ 2 2 2)')));
    expect(actual).toEqual(0.5);
});

// --------------------------------
// evaluation: execComparisonOps
// --------------------------------
test('should evaluate a comparison expression 1', () => {
    const actual = evaluation(parenthesize(tokenize('(== 1 1)')));
    expect(actual).toEqual(true);
});

test('should evaluate a comparison expression 2', () => {
    const actual = evaluation(parenthesize(tokenize('(== 1 2)')));
    expect(actual).toEqual(false);
});

test('should evaluate a comparison expression 3', () => {
    const actual = evaluation(parenthesize(tokenize('(!= 1 1)')));
    expect(actual).toEqual(false);
});

test('should evaluate a comparison expression 4', () => {
    const actual = evaluation(parenthesize(tokenize('(!= 1 2)')));
    expect(actual).toEqual(true);
});

test('should evaluate a comparison expression 5', () => {
    const actual = evaluation(parenthesize(tokenize('(> 1 1)')));
    expect(actual).toEqual(false);
});

test('should evaluate a comparison expression 6', () => {
    const actual = evaluation(parenthesize(tokenize('(> 1 2)')));
    expect(actual).toEqual(false);
});

test('should evaluate a comparison expression 7', () => {
    const actual = evaluation(parenthesize(tokenize('(>= 3 2)')));
    expect(actual).toEqual(true);
});

test('should evaluate a comparison expression 8', () => {
    const actual = evaluation(parenthesize(tokenize('(>= 2 2)')));
    expect(actual).toEqual(true);
});

test('should evaluate a comparison expression 9', () => {
    const actual = evaluation(parenthesize(tokenize('(>= 1 2)')));
    expect(actual).toEqual(false);
});

test('should evaluate a comparison expression 10', () => {
    const actual = evaluation(parenthesize(tokenize('(< 1 1)')));
    expect(actual).toEqual(false);
});

test('should evaluate a comparison expression 11', () => {
    const actual = evaluation(parenthesize(tokenize('(< 1 2)')));
    expect(actual).toEqual(true);
});

test('should evaluate a comparison expression 12', () => {
    const actual = evaluation(parenthesize(tokenize('(<= 3 2)')));
    expect(actual).toEqual(false);
});

// --------------------------------
// evaluation: execLogicOps
// --------------------------------
test('should evaluate a logic expression 1', () => {
    const actual = evaluation(parenthesize(tokenize('(&& true true)')));
    expect(actual).toBe(true);
});

test('should evaluate a logic expression 2', () => {
    const actual = evaluation(parenthesize(tokenize('(&& true false)')));
    expect(actual).toBe(false);
});

test('should evaluate a logic expression 3', () => {
    const actual = evaluation(parenthesize(tokenize('(&& false true)')));
    expect(actual).toBe(false);
});

test('should evaluate a logic expression 4', () => {
    const actual = evaluation(parenthesize(tokenize('(&& false false)')));
    expect(actual).toBe(false);
});

test('should evaluate a logic expression 5', () => {
    const actual = evaluation(parenthesize(tokenize('(|| true true)')));
    expect(actual).toBe(true);
});

test('should evaluate a logic expression 6', () => {
    const actual = evaluation(parenthesize(tokenize('(|| true false)')));
    expect(actual).toBe(true);
});

test('should evaluate a logic expression 7', () => {
    const actual = evaluation(parenthesize(tokenize('(|| false true)')));
    expect(actual).toBe(true);
});

test('should evaluate a logic expression 8', () => {
    const actual = evaluation(parenthesize(tokenize('(|| false false)')));
    expect(actual).toBe(false);
});

// --------------------------------
// evaluation: execIfOps
// --------------------------------
test('should evaluate a if expression 1', () => {
    const actual = evaluation(parenthesize(tokenize('(if true 1 2)')));
    expect(actual).toEqual(1);
});

test('should evaluate a if expression 2', () => {
    const actual = evaluation(parenthesize(tokenize('(if false 1 2)')));
    expect(actual).toEqual(2);
});

// --------------------------------
// setq
// --------------------------------
test('should setq 1', () => {
    const env = {};
    evaluation(parenthesize(tokenize('(setq x 10)')), env);
    expect(env).toEqual({ x: 10 });
});

test('should setq 2', () => {
    const env = {};
    evaluation(parenthesize(tokenize('(setq x (+ 2 4))')), env);
    expect(env).toEqual({ x: 6 });
});

// --------------------------------
// defun
// --------------------------------
test('should define a function 1', () => {
    const env = {};
    evaluation(parenthesize(tokenize('(defun fn (x y) (+ x y))')), env);
    const actual = evaluation(parenthesize(tokenize('(fn 1 2)')), env);
    expect(actual).toEqual(3);
});

test('should define a function 2', () => {
    const env = {};
    evaluation(parenthesize(tokenize('(defun fn (x y) (* x y (* x y)))')), env);
    const actual = evaluation(parenthesize(tokenize('(fn 2 4)')), env);
    expect(actual).toEqual(64);
});

test('should define a function 3', () => {
    const env = {};
    evaluation(
        parenthesize(
            tokenize('(defun fn (x) (if (< x 2) 1 (* x (fn (- x 1)))))'),
        ),
        env,
    );
    const actual = evaluation(parenthesize(tokenize('(fn 5)')), env);
    expect(actual).toEqual(120);
});

test('should define a function 4', () => {
    const env = {};
    evaluation(
        parenthesize(
            tokenize('(defun fn (x) (if (< x 2) 1 (* x (fn (- x 1)))))'),
        ),
        env,
    );
    const actual = evaluation(parenthesize(tokenize('(fn 10)')), env);
    expect(actual).toEqual(3628800);
});

test('recursive function', () => {
    const env = {};
    evaluation(parenthesize(tokenize('(defun fact (n) (if (== n 0) 1 (* n (fact (- n 1)))))')), env);
    const actual = evaluation(parenthesize(tokenize('(fact 5)')), env);
    expect(actual).toEqual(120);
});