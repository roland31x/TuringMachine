import { State, Symbol, Transition, TuringMachineBlueprint } from "./turing-machine";
import { TuringMachineBuilder } from "./turing-machine-builder";

export async function BuildVigenere(encrypt : boolean) : Promise<TuringMachineBlueprint> {
    let machine = new TuringMachineBlueprint();
    
    let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    let asymbols = [];
    let ctextsymbols = [];
    let ktextsymbols = [];   
    let writestates = [];
    let blank = machine.blankSymbol;

    for(let i = 0; i < alphabet.length; i++){

        let sym = new Symbol(alphabet[i]);
        machine.inputAlphabet.push(sym);
        machine.tapeAlphabet.push(sym);
        asymbols.push(sym);

        let kSym = new Symbol("$" + alphabet[i]);
        machine.tapeAlphabet.push(kSym);
        ktextsymbols.push(kSym);

        let cSym = new Symbol("*" + alphabet[i]);
        machine.tapeAlphabet.push(cSym);
        ctextsymbols.push(cSym);

        writestates.push(new State("WRITE-" + alphabet[i], []));
    }

    let sep = new Symbol("=");
    machine.inputAlphabet.push(sep);
    machine.tapeAlphabet.push(sep);

    let readState = new State("READ", []);
    machine.initialState = readState;
    machine.states.push(readState);

    let findKey = new State("FIND-KEY", []);
    machine.states.push(findKey);

    let readKey = new State("READ-KEY", []);
    machine.states.push(readKey);

    let refreshKey = new State("REFRESH-KEY", []);
    machine.states.push(refreshKey);

    let error = new State("ERROR", []);
    machine.states.push(error);
    machine.rejectStates.push(error);

    let done = new State("DONE", []);
    machine.states.push(done);
    machine.acceptStates.push(done);

    writestates.forEach(state => {
        machine.states.push(state);
    });

    for(let i = 0; i < alphabet.length; i++){
        for(let j = 0; j < alphabet.length; j++){
            writestates[i].transitions.push(new Transition(ctextsymbols[j], readState, asymbols[(26 + (encrypt ? (j + i) : (j - 1))) % 26], 'R'));
            writestates[i].transitions.push(new Transition(ktextsymbols[j], writestates[i], ktextsymbols[j], 'L'));
            writestates[i].transitions.push(new Transition(asymbols[j], writestates[i], asymbols[j], 'L'));
        }
        writestates[i].transitions.push(new Transition(sep, writestates[i], sep, 'L'));
        readState.transitions.push(new Transition(asymbols[i], findKey, ctextsymbols[i], 'R'));
        readKey.transitions.push(new Transition(asymbols[i], writestates[i], ktextsymbols[i], 'L'));
        readKey.transitions.push(new Transition(ktextsymbols[i], readKey, ktextsymbols[i], 'R'))
        findKey.transitions.push(new Transition(asymbols[i], findKey, asymbols[i], 'R'));
        refreshKey.transitions.push(new Transition(ktextsymbols[i], refreshKey, asymbols[i], 'L'));   
    }
    readState.transitions.push(new Transition(sep, done, sep, 'R'));
    refreshKey.transitions.push(new Transition(sep, readKey, sep, 'R'));
    findKey.transitions.push(new Transition(sep, readKey, sep, 'R'));
    readKey.transitions.push(new Transition(blank, refreshKey, blank, 'L'));
    machine.name = "Vigenere Encrypt";


    //regularize
    machine.states.forEach(state => {
        machine.tapeAlphabet.forEach(symbol => {
            if(!state.transitions.some(x => x.inputSymbol == symbol)){
                state.transitions.push(new Transition(symbol, error, symbol, 'R'));
            }
        })
        if(!state.transitions.some(x => x.inputSymbol == blank)){
            state.transitions.push(new Transition(blank, error, blank, 'R'));
        }
    });

    console.log(machine.inputAlphabet);
    console.log("done");

    return new Promise((resolve) => resolve(machine));
}
