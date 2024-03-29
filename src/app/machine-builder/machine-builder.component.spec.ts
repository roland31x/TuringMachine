import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineBuilderComponent } from './machine-builder.component';

describe('MachineBuilderComponent', () => {
  let component: MachineBuilderComponent;
  let fixture: ComponentFixture<MachineBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MachineBuilderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MachineBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
