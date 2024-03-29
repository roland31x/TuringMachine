import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransitionBuilderComponent } from './transition-builder.component';

describe('TransitionBuilderComponent', () => {
  let component: TransitionBuilderComponent;
  let fixture: ComponentFixture<TransitionBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransitionBuilderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransitionBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
