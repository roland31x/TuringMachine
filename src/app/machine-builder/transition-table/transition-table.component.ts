import { Component, Input } from '@angular/core';
import { TransitionBuilderComponent } from '../transition-builder/transition-builder.component';
import { NgFor, NgIf } from '@angular/common';
import { TuringMachineBlueprint } from '../../turing-machine-classes/turing-machine';

@Component({
  selector: 'app-transition-table',
  standalone: true,
  imports: [TransitionBuilderComponent, NgIf, NgFor],
  templateUrl: './transition-table.component.html',
  styleUrl: './transition-table.component.scss'
})
export class TransitionTableComponent {
  @Input() tmBlueprint!: TuringMachineBlueprint;
  @Input() editable = true;
}
