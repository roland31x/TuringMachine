import { Subject } from "rxjs";
import { KVP } from "../extras/KVP";

export class TuringMachine{
    public blueprint: TuringMachineBlueprint;
    public tapeR: KVP[];
    public tapeL: KVP[];
    public currentState: State | null;
    public headPointer: number = 0;

    public stepdelay: number = 1500;
    public _running: boolean = false;

    public stateChange = new Subject();
    public pointerChange = new Subject();
    public machineInfo = new Subject<string | null>(); 

    public get running(){
        return this._running;
    }

    constructor(blueprint?: TuringMachineBlueprint){
        this.blueprint = blueprint? blueprint : new TuringMachineBlueprint();
        this.tapeR = Array.from({length: 32}, () => new KVP(0,this.blueprint.blankSymbol));
        this.tapeL = Array.from({length: 32}, () => new KVP(0,this.blueprint.blankSymbol));
        this.currentState = this.blueprint.initialState;
    }

    public Stop(){
        this._running = false;
    }

    public Reset(){
        this.tapeR = Array.from({length: 32}, () => new KVP(0,this.blueprint.blankSymbol));
        this.tapeL = Array.from({length: 32}, () => new KVP(0,this.blueprint.blankSymbol));
        this.headPointer = 0;
        this.pointerChange.next(null);
        this.currentState = this.blueprint.initialState;
        this._running = false;
    }

    private get haltCondition(){
        return (this.blueprint.acceptStates.includes(this.currentState!) || this.blueprint.rejectStates.includes(this.currentState!))
    }

    public async Run(){

        if(this._running){
            return;
        }

        this._running = true;
        this.machineInfo.next(null);

        while(true){
            
            if(!this._running){
                this.Reset();
                this.machineInfo.next("Machine has been stopped.");
                return;
            }

            await new Promise(resolve => setTimeout(resolve, this.stepdelay));

            let currentSymbol = this.getSymbol();
            let transition = this.currentState!.transitions.find(x => x.inputSymbol == currentSymbol);
            if(transition){

                
                this.currentState = transition.nextState;
                this.stateChange.next(null);
                if(this.haltCondition){
                    console.log(this.blueprint);
                    console.log("halt");
                    console.log(this.currentState);
                    break;
                }

                if(this.headPointer < 0){
                    
                    this.tapeL[(this.tapeL.length - 1) - ((this.headPointer * -1) - 1)].value = transition.outputSymbol;
                }
                else{
                    this.tapeR[this.headPointer].value = transition.outputSymbol;
                }

                await new Promise(resolve => setTimeout(resolve, this.stepdelay));

                if(transition.direction == 'R'){
                    
                    if(this.headPointer + 1 == this.tapeR.length){
                        this.tapeR.push(new KVP(0,this.blueprint.blankSymbol));
                    }
                    this.headPointer++;

                } else if(transition.direction == 'L'){
                   
                    if(this.headPointer < 0 && (this.headPointer * -1) + 1 == this.tapeL.length){
                        this.tapeL.unshift(new KVP(0,this.blueprint.blankSymbol));
                    }

                    this.headPointer--;
                }

                this.pointerChange.next(null);               
            } else {
                this.currentState = this.blueprint.initialState;
                this.Reset();
                this.machineInfo.next("Machine has encountered an invalid transition.");
                break;
            }

        }

        this.machineInfo.next("Machine has halted in a" + (this.blueprint.acceptStates.includes(this.currentState!) ? "n accept" : " reject") + " state."); 
        this._running = false;
    }

    private getSymbol() : Symbol{
        if(this.headPointer < 0){
            return this.tapeL[(this.tapeL.length - 1) - ((this.headPointer * -1) - 1)].value;
        } else {
            return this.tapeR[this.headPointer].value;
        }
    }
}

export class TuringMachineBlueprint {

    public name: string = "New Machine";
    public states: State[];
    public inputAlphabet: Symbol[];
    public blankSymbol: Symbol;
    public tapeAlphabet: Symbol[];
    public initialState: State | null = null;
    public acceptStates: State[];
    public rejectStates: State[]
  
    constructor() {
        this.states = [];
        this.inputAlphabet = [];
        this.blankSymbol = new Symbol("_");
        this.tapeAlphabet = [ this.blankSymbol ];
        this.acceptStates = [];
        this.rejectStates = [];
    }
}

export class Symbol{
    constructor(
        public name: string,
    ) {}
}

export class State{
    constructor(
        public name: string,
        public transitions: Transition[]
    ) {}
}

export class Transition{
    constructor(
        public inputSymbol: Symbol,
        public nextState: State,
        public outputSymbol: Symbol,
        public direction: string
    ) {}
}

