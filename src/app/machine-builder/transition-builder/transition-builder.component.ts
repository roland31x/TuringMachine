import { Component, Input } from '@angular/core';
import { State, Transition, TuringMachineBlueprint } from '../../turing-machine-classes/turing-machine';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-transition-builder',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './transition-builder.component.html',
  styleUrl: './transition-builder.component.scss'
})
export class TransitionBuilderComponent {

  @Input() state: State | null = null;
  @Input() machine: TuringMachineBlueprint | null = null;
  @Input() transition: Transition | null = null;
  @Input() builder = true;

  finalState() : boolean {
    return (this.machine!.acceptStates.includes(this.transition?.nextState!) || this.machine!.rejectStates.includes(this.transition?.nextState!));
  }

}
