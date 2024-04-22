import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { TuringMachineBuilder } from '../turing-machine-classes/turing-machine-builder';
import { State, Symbol } from '../turing-machine-classes/turing-machine';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { MachineStorageService } from '../services/machine-storage.service';
import { TransitionTableComponent } from './transition-table/transition-table.component';


@Component({
  selector: 'app-machine-builder',
  standalone: true,
  imports: [NgFor, NgIf, TransitionTableComponent, FormsModule],
  templateUrl: './machine-builder.component.html',
  styleUrl: './machine-builder.component.scss'
})
export class MachineBuilderComponent {

  private machineService = new TuringMachineBuilder();

  loadMenuActive = false;

  constructor(
    private router : Router,
    private blueprintStorage: MachineStorageService
  ) {}


  get loadedMachine() {
    return this.machineService.loadedMachine;
  }

  get getColumns(){
    return 'repeat(' + (this.loadedMachine.tapeAlphabet.length + 1) +', 1fr';
  }

  get getRows(){
    return 'repeat(' + (this.loadedMachine.states.length + 1) +', 1fr';
  }

  get tapeSpecial(){
    return this.loadedMachine.tapeAlphabet.filter(x => !this.loadedMachine.inputAlphabet.includes(x) && x != this.loadedMachine.blankSymbol);
  }

  get okMachine(){
    return this.stateCountReq && this.inputSymbolReq && this.stateAcceptReq && this.stateInitialReq;
  }

  get stateCountReq(){
    return this.loadedMachine.states.length != 0;
  }

  get inputSymbolReq(){
    return this.loadedMachine.inputAlphabet.length != 0;
  }

  get stateAcceptReq(){
    return this.loadedMachine.acceptStates.length != 0;
  }

  get stateInitialReq(){
    return this.loadedMachine.initialState;
  }

  addState(){
    this.machineService.addState('q' + this.loadedMachine.states.length);
  }

  addSymbol(inputAlphabet: boolean = false){
    this.machineService.addSymbol(new Symbol("new"), inputAlphabet);
  }

  removeSymbol(symbol: Symbol){
    this.machineService.removeSymbol(symbol);
  }

  removeState(state: State){
    this.machineService.removeState(state);
  }

  setInitialState(state: State){
    this.machineService.setInitialState(state);
  }
  setAcceptState(state: State){
    this.machineService.setAcceptState(state);
  }
  setRejectState(state: State){
    this.machineService.setRejectState(state);
  }

  get savedNames(){
    return this.blueprintStorage.blueprintNames;
  }

  showLoadMenu(){
    this.loadMenuActive = true;
  }

  hideLoadMenu(){
    this.loadMenuActive = false;
  }

  load(key: string){
    this.machineService.loadBlueprint(this.blueprintStorage.getBlueprint(key));
    this.hideLoadMenu();
  }

  deletebp(key: string){
    this.blueprintStorage.deleteBlueprint(key);
  }

  goToSim(){
    this.router.navigate(['sim']);
  }

  build(){
    this.blueprintStorage.saveBlueprint(this.loadedMachine, this.loadedMachine.name);
    this.goToSim();
  }
}
