import { Injectable } from '@angular/core';
import { TuringMachine, TuringMachineBlueprint, Symbol, Transition, State } from '../turing-machine-classes/turing-machine';
import { LocalStorageService } from './local-storage.service';
import { mapToResolve } from '@angular/router';
import { BLUEPRINTS } from '../turing-machine-classes/pre-made-blueprints';
import { KVP } from '../extras/KVP';

@Injectable({
  providedIn: 'root'
})
export class MachineStorageService {

  private _loadedBlueprint! : TuringMachineBlueprint;
  constructor(
    private localStorage: LocalStorageService
  ) { this.init() }

  private init(){
    BLUEPRINTS.forEach(bp => {
      if(!this.localStorage.checkItem(bp[0])){
        this.localStorage.setItem(bp[0], bp);
      }
    });

    this._loadedBlueprint = this.parseBlueprint(this.localStorage.getItem(this.blueprintNames[0]));
  }

  public deleteBlueprint(key: string){
    this.localStorage.removeItem(key);
  }

  public saveBlueprint(blueprint: TuringMachineBlueprint, key?: string) {

    let path = "bp";
    if(key){
      path = key;
    }
    
    let saved = this.bpToString(blueprint);
    this.localStorage.setItem(path, saved);
    this._loadedBlueprint = this.parseBlueprint(saved);
  }

  get blueprintNames(): string[] {
    return this.localStorage.getValues();
  }
  
  private bpToString(blueprint: TuringMachineBlueprint) : string[] {
    let bp : string[] = [];

    bp.push(this.sanitizeString(blueprint.name));

    bp.push(blueprint.inputAlphabet.length.toString());
    blueprint.inputAlphabet.forEach(sym =>{
      bp.push(blueprint.tapeAlphabet.indexOf(sym) + ' ' + this.sanitizeString(sym.name));
    });

    bp.push(blueprint.tapeAlphabet.indexOf(blueprint.blankSymbol) + ' ' + this.sanitizeString(blueprint.blankSymbol.name));

    let tapeonly = blueprint.tapeAlphabet.filter(x => x != blueprint.blankSymbol && !blueprint.inputAlphabet.includes(x));
    bp.push(tapeonly.length.toString());
    tapeonly.forEach(sym => {
      bp.push(blueprint.tapeAlphabet.indexOf(sym) + ' ' + this.sanitizeString(sym.name));
    });

    bp.push(blueprint.states.length.toString());
    blueprint.states.forEach(state => {
      bp.push(blueprint.states.indexOf(state) + ' ' + this.sanitizeString(state.name));
    });

    bp.push(blueprint.states.length.toString());
    blueprint.states.forEach(state => {
      bp.push(state.transitions.length.toString() + ' ' + blueprint.states.indexOf(state).toString());
      state.transitions.forEach(transition => {
        bp.push(
          blueprint.tapeAlphabet.indexOf(transition.inputSymbol) + ' ' + 
          blueprint.states.indexOf(transition.nextState).toString() + ' ' +
          blueprint.tapeAlphabet.indexOf(transition.outputSymbol) + ' ' + 
          transition.direction);
      });
    });

    bp.push(blueprint.acceptStates.length.toString());
    blueprint.acceptStates.forEach(state => {
      bp.push(blueprint.states.indexOf(state).toString());
    });

    bp.push(blueprint.rejectStates.length.toString());
    blueprint.rejectStates.forEach(state => {
      bp.push(blueprint.states.indexOf(state).toString());
    });

    bp.push(blueprint.states.indexOf(blueprint.initialState!).toString());

    return bp;
  }

  private sanitizeString(string: string): string{
    if(string.trim() == ""){
      return "_"
    }
    return string;
  }

  private parseBlueprint(keys: string[]): TuringMachineBlueprint {
    let result = new TuringMachineBlueprint();

    let driver = 0;

    result.name = keys[driver++];
    
    let itercount = parseInt(keys[driver++]);

    let inputAlphabet = [];
    for(let i = 0; i < itercount; i++){
      let [index, name] = keys[driver++].split(' ');
      inputAlphabet.push(new KVP(parseInt(index), new Symbol(name)));
    }

    let [index,name] = keys[driver++].split(' ');
    let blank = new KVP(parseInt(index), new Symbol(name));

    let tapeOnly = [];

    itercount = parseInt(keys[driver++]);
    for(let i = 0; i < itercount; i++){
      let [index, name] = keys[driver++].split(' ');
      tapeOnly.push(new KVP(parseInt(index), new Symbol(name)));
    }

    let total = inputAlphabet.concat(tapeOnly);
    total.push(blank);

    itercount = parseInt(keys[driver++]);
    let states = [];
    for(let i = 0; i < itercount; i++){
      let [index, name] = keys[driver++].split(' ');
      states.push(new KVP(parseInt(index), new State(name, [])));
    }

    itercount = parseInt(keys[driver++]);
    for(let i = 0; i < itercount; i++){
      let [transcount, index] = keys[driver++].split(' ');
      let target = states.find(x => x.key == parseInt(index))!.value;
      for(let j = 0; j < parseInt(transcount); j++){
        let [input, next, output, direction] = keys[driver++].split(' ');
        target.transitions.push(new Transition(
          total.find(x => x.key == parseInt(input))!.value,
          states.find(x => x.key == parseInt(next))!.value,
          total.find(x => x.key == parseInt(output))!.value,
          direction
        ));
      }
    }

    itercount = parseInt(keys[driver++]);
    let acceptStates = [];
    for(let i = 0; i < itercount; i++){
      let index = parseInt(keys[driver++]);
      acceptStates.push(states.find(x => x.key == index)!.value);
    }

    itercount = parseInt(keys[driver++]);
    let rejectStates = [];
    for(let i = 0; i < itercount; i++){
      let index = parseInt(keys[driver++]);
      rejectStates.push(states.find(x => x.key == index)!.value);
    }

    result.initialState = states.find(x => x.key == parseInt(keys[driver++]))!.value;
    result.inputAlphabet = inputAlphabet.map(x => x.value);
    result.blankSymbol = blank.value;
    result.tapeAlphabet = total.map(x => x.value);
    result.states = states.map(x => x.value);
    result.acceptStates = acceptStates;
    result.rejectStates = rejectStates;

    return result;
  }

  public getBlueprint(key: string): TuringMachineBlueprint {
    return this.parseBlueprint(this.localStorage.getItem(key));
  }

  public loadedBlueprint(): TuringMachineBlueprint {
    return this._loadedBlueprint;
  }
}


