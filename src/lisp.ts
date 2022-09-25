// --------------------------------
// basic types
// --------------------------------
type Atom = string | number | boolean;
type List = Atom | List[];

// --------------------------------
// parse
// --------------------------------
export const tokenize = (str: string): string[] => {
    return str
        .replace(/\(/g, ' ( ')
        .replace(/\)/g, ' ) ')
        .replace(/\n/g, ' ')
        .split(' ')
        .filter((x) => x !== '');
};

export const parseAtom = (token: string): Atom => {
    if (token === 'true') {
        return true;
    }
    if (token === 'false') {
        return false;
    }
    const fn = token.includes('.')
        ? parseFloat
        : (x: string) => parseInt(x, 10);
    const val = fn(token);
    return isNaN(val) ? token : val;
};

export const parenthesize = (tokens: string[]): List => {
    if (tokens.length === 0) {
        throw Error('parenthesize: tokens are undefined');
    }
    const token = tokens.shift();
    if (token === '(') {
        const list: List = [];
        while (tokens[0] !== ')') {
            list.push(parenthesize(tokens));
        }
        tokens.shift();
        return list;
    } else if (token === ')') {
        throw Error('parenthesize: unexpected )');
    } else if (token === undefined) {
        throw Error('parenthesize: token are undefined');
    }
    return parseAtom(token);
};

// --------------------------------
// evaluation: arithmetic ops
// --------------------------------
type ArithmeticOp = (arg: number[]) => number;
type ArithmeticOpMap = {
    [key: string]: ArithmeticOp;
};

const arithmeticOps: ArithmeticOpMap = {
    '+': (arg: number[]) => arg.reduce((arg1, arg2) => arg1 + arg2, 0),
    '-': (arg: number[]) => arg.reduce((arg1, arg2) => arg1 - arg2),
    '*': (arg: number[]) => arg.reduce((arg1, arg2) => arg1 * arg2, 1),
    '/': (arg: number[]) => arg.reduce((arg1, arg2) => arg1 / arg2),
};

const execArithmeticOps = (first: string, rest: List[], env: Env): number => {
    const evaluated = rest.map((cur) => evaluation(cur, env));
    if (evaluated.length === 0) {
        throw Error(
            `Arithmetic: Not enough arguments to the operator ${first}`,
        );
    }
    const fn = arithmeticOps[first];
    return fn(evaluated as number[]);
};

// --------------------------------
// evaluation: comparison op
// --------------------------------
type ComparisonOp = (arg1: Atom, arg2: Atom) => boolean;
type ComparisonOpMap = {
    [key: string]: ComparisonOp;
};

const comparisonOps: ComparisonOpMap = {
    '==': (arg1: Atom, arg2: Atom) => arg1 === arg2,
    '!=': (arg1: Atom, arg2: Atom) => arg1 !== arg2,
    '>': (arg1: Atom, arg2: Atom) => arg1 > arg2,
    '<': (arg1: Atom, arg2: Atom) => arg1 < arg2,
    '>=': (arg1: Atom, arg2: Atom) => arg1 >= arg2,
    '<=': (arg1: Atom, arg2: Atom) => arg1 <= arg2,
};

const execComparisonOps = (first: string, rest: List[], env: Env): Atom => {
    const fn = comparisonOps[first];
    if (rest.length !== 2) {
        throw Error(`Comparison: Not enough arguments ${first}`);
    }
    const [left, right] = rest;
    return fn(evaluation(left, env), evaluation(right, env));
};

// --------------------------------
// evaluation: logical op
// --------------------------------
type LogicalOp = (arg1: Atom, arg2: Atom) => boolean;
type LogicalOpMap = {
    [key: string]: LogicalOp;
};

const logicalOps: LogicalOpMap = {
    '&&': (arg1: Atom, arg2: Atom) => (arg1 && arg2) as boolean,
    '||': (arg1: Atom, arg2: Atom) => (arg1 || arg2) as boolean,
};

const execLogicalOps = (first: string, rest: List[], env: Env): boolean => {
    const fn = logicalOps[first];
    if (rest.length !== 2) {
        throw Error(`Logical: Not enough arguments ${first}`);
    }
    const [left, right] = rest;
    return fn(evaluation(left, env), evaluation(right, env));
};

// --------------------------------
// evaluation: if
// --------------------------------
const execIfOps = (_: string, rest: List[], env: Env): Atom => {
    const [check, ifTrue, ifFalse] = rest;
    return evaluation(check, env)
        ? evaluation(ifTrue, env)
        : evaluation(ifFalse, env);
};

// --------------------------------
// evaluation: util funcs
// --------------------------------
const isAtom = (target: Atom | List): target is Atom => {
    return !Array.isArray(target);
};

const isList = (target: Atom | List): target is List[] => {
    return Array.isArray(target);
};

export const getFirst = (list: List[]): Atom => {
    if (list.length === 0) {
        throw Error('List is empty');
    }
    if (isAtom(list[0])) {
        return list[0];
    }
    throw new Error('Expected an Atom at the start of a List');
};

export const getRest = (list: List[]): List[] => {
    if (list.length === 0) {
        return [];
    }
    return list.slice(1);
};

// --------------------------------
// environment
// --------------------------------
export type UDF = (arg: List) => Atom; // user defined function
export type Env = {
    [key: string]: Atom | List | UDF;
};

// --------------------------------
// setq
// --------------------------------
export const setq = (rest: List[], env: Env) => {
    const [name, value] = rest;
    if (typeof name !== 'string') {
        throw Error('define: name must be a string');
    }
    if (name in env) {
        throw Error(`define: ${name} is already defined`);
    }
    env[name] = evaluation(value, env);
    return true;
};

// --------------------------------
// defun
// --------------------------------
export const defun = (rest: List[], env: Env) => {
    const name = rest[0];

    if (typeof name !== 'string') {
        throw Error('defun: name must be a string');
    }
    if (rest.length < 3) {
        throw Error('defun: Not enough arguments');
    }
    if (name in env) {
        throw Error(`defun: ${name} is already defined`);
    }

    const params = rest[1] as List[];
    const body = rest.slice(2);

    env[name] = (args) => {
        if ((args as List[]).length !== params.length) {
            throw Error(
                `defun: Expected ${params.length} number of arguments to the function ${name}`,
            );
        }
        params.forEach((_, i) => {
            env[params[i] as string] = args[i as keyof List]; // ts7053
        });
        return body.map((cur) => evaluation(cur, env))[0];
    };
    return true;
};

export const execUDF = (
    first: string,
    rest: List[],
    env: Env,
): Atom => {
    const fn = env[first] as UDF;
    const resolved = rest.map((cur) => evaluation(cur, env));
    return fn(resolved);
};

// --------------------------------
// evaluation
// --------------------------------
export const evaluation = (exp: Atom | List, env: Env = {}): Atom => {
    if (isAtom(exp)) {
        if (typeof exp === 'string') {
            if (exp in env) {
                return env[exp] as Atom;
            }
            throw Error(`evaluation: ${exp} is not defined`);
        }
        return exp;
    } else if (isList(exp)) {
        const first = getFirst(exp);
        if (typeof first !== 'string') {
            throw new Error('evaluation: first param is expected a string');
        }
        const rest = getRest(exp);
        if (first in arithmeticOps) {
            return execArithmeticOps(first, rest, env);
        } else if (first in comparisonOps) {
            return execComparisonOps(first, rest, env);
        } else if (first in logicalOps) {
            return execLogicalOps(first, rest, env);
        } else if (first === 'if') {
            return execIfOps(first, rest, env);
        } else if (first === 'setq') {
            return setq(rest, env);
        } else if (first === 'defun') {
            return defun(rest, env);
        } else if (first in env) {
            return execUDF(first, rest, env);
        }
        return first;
    }
    throw new Error(`evaluation: unknown error ${exp}`);
};
