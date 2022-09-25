import { readline } from './readline';
import { tokenize, parenthesize, evaluation } from './lisp';

const main = () => {
    const env = {};
    for (;;) {
        const line = readline('lisp-ts> ');
        if (line === undefined) {
            continue;
        }
        if (line === '(exit)') {
            // eslint-disable no-console
            console.log('Bye.');
            return;
        }
        // eslint-disable-next-line no-console
        console.log(evaluation(parenthesize(tokenize(line)), env));
    }
};

main();
