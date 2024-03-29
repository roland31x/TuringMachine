import { TuringMachineBlueprint, State, Symbol, Transition } from './turing-machine';

export class TuringMachineBuilder {

  private _loadedMachine: TuringMachineBlueprint = new TuringMachineBlueprint();

  public loadBlueprint(blueprint: TuringMachineBlueprint){

    this._loadedMachine = blueprint;

  }

  get loadedMachine(): TuringMachineBlueprint {
    return this._loadedMachine;
  }

  get tapeAlphabet(): Symbol[] {
    return this._loadedMachine.tapeAlphabet;
  }

  addSymbol(symbol: Symbol, inputAlphabet: boolean = false){
    if(inputAlphabet){
      this._loadedMachine.inputAlphabet.push(symbol);
    }
    this._loadedMachine.tapeAlphabet.push(symbol);
    this._loadedMachine.states.forEach(state => {
      let newTransition = new Transition(symbol, state, symbol, 'R');
      state.transitions.push(newTransition);
    });
  }

  removeSymbol(symbol: Symbol){
    if(this._loadedMachine.inputAlphabet.includes(symbol)){
      this._loadedMachine.inputAlphabet = this._loadedMachine.inputAlphabet.filter(x => x != symbol);
    }
    this._loadedMachine.tapeAlphabet = this._loadedMachine.tapeAlphabet.filter(x => x != symbol);
    this._loadedMachine.states.forEach(state => {
      state.transitions = state.transitions.filter(x => x.inputSymbol != symbol);

      state.transitions.forEach(transition => {
        if(transition.outputSymbol == symbol){
          transition.outputSymbol = this._loadedMachine.blankSymbol;
        }
      })
    });
  }

  addState(name : string){
    let state = new State(name, []);
    this.tapeAlphabet.map(x => state.transitions.push(new Transition(x, state, x, 'R')));
    this._loadedMachine.states.push(state);
  }

  removeState(state: State){
    this._loadedMachine.states.forEach(x => {
      x.transitions.forEach(transition => {
        if(transition.nextState == state){
          transition.nextState = this._loadedMachine.states.find(x => x != state)!;
        }
      })
    });

    this._loadedMachine.states = this._loadedMachine.states.filter(x => x != state);
    this._loadedMachine.acceptStates = this._loadedMachine.acceptStates.filter(x => x != state);
    this._loadedMachine.rejectStates = this._loadedMachine.rejectStates.filter(x => x != state);
    if(this._loadedMachine.initialState == state){
      this._loadedMachine.initialState = null;
    }
  }

  setInitialState(state: State){
    if(this.loadedMachine.initialState == state){
      this.loadedMachine.initialState = null;
    } else if(this.loadedMachine.acceptStates.includes(state)){
      this.loadedMachine.acceptStates = this.loadedMachine.acceptStates.filter(x => x != state);
      this.loadedMachine.initialState = state;
    } else if(this.loadedMachine.rejectStates.includes(state)){
      this.loadedMachine.rejectStates = this.loadedMachine.rejectStates.filter(x => x != state);
      this.loadedMachine.initialState = state;
    }
    else{
      this.loadedMachine.initialState = state;
    }
  }

  setAcceptState(state: State){
    if(this.loadedMachine.acceptStates.includes(state)){
      this.loadedMachine.acceptStates = this.loadedMachine.acceptStates.filter(x => x != state);
    } else if(this.loadedMachine.rejectStates.includes(state)){
      this.loadedMachine.rejectStates = this.loadedMachine.rejectStates.filter(x => x != state);
      this.loadedMachine.acceptStates.push(state);
    }
    else if(this.loadedMachine.initialState == state){
      this.loadedMachine.initialState = null;
      this.loadedMachine.acceptStates.push(state);
    }
    else{
      this.loadedMachine.acceptStates.push(state);
    }

  }

  setRejectState(state: State){
    if(this.loadedMachine.rejectStates.includes(state)){
      this.loadedMachine.rejectStates = this.loadedMachine.rejectStates.filter(x => x != state);
    } else if(this.loadedMachine.acceptStates.includes(state)){
      this.loadedMachine.acceptStates = this.loadedMachine.acceptStates.filter(x => x != state);
      this.loadedMachine.rejectStates.push(state);
    }
    else if(this.loadedMachine.initialState == state){
      this.loadedMachine.initialState = null;
      this.loadedMachine.rejectStates.push(state);
    }
    else{
      this.loadedMachine.rejectStates.push(state);
    }
  }

  constructor() { }
}
