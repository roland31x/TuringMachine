import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineSimulatorComponent } from './machine-simulator.component';

describe('MachineSimulatorComponent', () => {
  let component: MachineSimulatorComponent;
  let fixture: ComponentFixture<MachineSimulatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MachineSimulatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MachineSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
