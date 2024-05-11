import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServertimeComponent } from './servertime.component';

describe('ServertimeComponent', () => {
  let component: ServertimeComponent;
  let fixture: ComponentFixture<ServertimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServertimeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServertimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
