import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnchantComponent } from './enchant.component';

describe('EnchantComponent', () => {
  let component: EnchantComponent;
  let fixture: ComponentFixture<EnchantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnchantComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnchantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
