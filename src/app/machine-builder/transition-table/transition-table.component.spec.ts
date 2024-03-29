import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransitionTableComponent } from './transition-table.component';

describe('TransitionTableComponent', () => {
  let component: TransitionTableComponent;
  let fixture: ComponentFixture<TransitionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransitionTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransitionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
