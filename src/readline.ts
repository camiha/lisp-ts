// Referenced: https://github.com/kanaka/mal/blob/master/impls/ts/node_readline.ts
import * as path from 'path';
import * as ffi from 'ffi-napi';
import * as fs from 'fs';

const RL_LIB = 'libedit';

const HISTORY_FILE = path.join(process.env.HOME || '.', '.lisp-ts');

const readlineLib = ffi.Library(RL_LIB, {
    readline: ['string', ['string']],
    add_history: ['int', ['string']],
});

let rlHistoryLoaded = false;

export const readline = (prompt?: string): string | undefined => {
    prompt = prompt || 'user> ';

    if (!rlHistoryLoaded) {
        rlHistoryLoaded = true;
        let lines: string[] = [];
        if (fs.existsSync(HISTORY_FILE)) {
            lines = fs.readFileSync(HISTORY_FILE).toString().split('\n');
        }

        lines = lines.slice(Math.max(lines.length - 2000, 0));

        for (let i = 0; i < lines.length; i++) {
            if (lines[i]) {
                readlineLib.add_history(lines[i]);
            }
        }
    }

    const line = readlineLib.readline(prompt);
    if (line) {
        readlineLib.add_history(line);
        try {
            fs.appendFileSync(HISTORY_FILE, line + '\n');
            // eslint-disable-next-line no-empty
        } catch (ext) {}

        return line;
    }
};
