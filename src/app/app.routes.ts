import { Routes } from '@angular/router';
import { MachineBuilderComponent } from './machine-builder/machine-builder.component';
import { MachineSimulatorComponent } from './machine-simulator/machine-simulator.component';

export const routes: Routes = [
    { path: '', component: MachineBuilderComponent },
    { path: 'sim', component: MachineSimulatorComponent }
];
