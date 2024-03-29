import { Component, OnDestroy } from '@angular/core';
import { TuringMachineBlueprint, TuringMachine, Symbol } from '../turing-machine-classes/turing-machine';
import { MachineStorageService } from '../services/machine-storage.service';
import { NgFor, NgIf } from '@angular/common';
import { KVP } from '../extras/KVP';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TransitionTableComponent } from '../machine-builder/transition-table/transition-table.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-machine-simulator',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, TransitionTableComponent],
  templateUrl: './machine-simulator.component.html',
  styleUrl: './machine-simulator.component.scss',
  animations: []
})
export class MachineSimulatorComponent implements OnDestroy {

  private _machine!: TuringMachine;
  private stateChange : any;
  private pointerChange : any;
  private machineInfoEvent : any;

  private _machineMessage : string | null = null;

  get machineMessage(){
    return this._machineMessage;
  }

  get savedMachines(){
    return this.storage.blueprintNames;
  }

  constructor(
    private storage: MachineStorageService,
    private router: Router
  ){   
    let bp = storage.loadedBlueprint();
    this.machine = new TuringMachine(bp);
  }

  changeMachine(event : any){
    console.log(event);
    if(this.machine.running){
      this.stop();
    }
    this.machine = new TuringMachine(this.storage.getBlueprint(event.target.value));
  }

  buildPage(){
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    if(this.stateChange){
      this.stateChange.unsubscribe();
    }
    if(this.pointerChange){
      this.pointerChange.unsubscribe();
    }
    if(this.machineInfoEvent){
      this.machineInfoEvent.unsubscribe();
    }
  }

  get machine(){
    return this._machine;
  }

  getMachine(name: string) : TuringMachine{
    return new TuringMachine(this.storage.getBlueprint(name));
  }

  set machine(m: TuringMachine){
    this._machine = m;
    this._machine.stepdelay = 1500;
    if(this.stateChange){
      this.stateChange.unsubscribe();  
    }
    this.stateChange = this.machine.stateChange.subscribe(() => this.triggerAnimations());
    if(this.pointerChange){
      this.pointerChange.unsubscribe();
    }
    this.pointerChange = this.machine.pointerChange.subscribe(() => this.setTapePosition());
    if(this.machineInfoEvent){
      this.machineInfoEvent.unsubscribe();
    }
    this.machineInfoEvent = this.machine.machineInfo.subscribe((v : string | null) => this._machineMessage = v);
    
  }

  input : Symbol[] = [];

  get inputString(){ 
    return this.input.map(sym => sym.name).join('');
  }

  addInputSymbol(sym: Symbol){
    this.input.push(sym);
  }

  backspace(){
    this.input.pop();
  }

  clearInput(){
    this.input = [];
  }

  private _tapePosition : string = 'translateX(' + (-25 - (32 * 50) + ( (-1 * 0) * 50)) + 'px)';

  get tapePosition(){
    return this._tapePosition;
  }

  setTapePosition(){
    this._tapePosition = 'translateX(' + (-25 - (this.machine.tapeL.length * 50) + ( (-1 * this.machine.headPointer) * 50)) + 'px)'
  }

  animateChanges = false;

  triggerAnimations(){
    this.animateChanges = true;
    setTimeout(() => this.animateChanges = false, 250);
  }

  async start(){
    this.machine.Reset();
    while(this.input.length > 0){
      this.machine.tapeR.unshift(new KVP(0,this.input.pop()!));
    }

    await this.machine.Run();
  }

  stop(){
    this.machine.Stop();
  }

}
