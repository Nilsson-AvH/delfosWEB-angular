import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreFooter } from './pre-footer';

describe('PreFooter', () => {
  let component: PreFooter;
  let fixture: ComponentFixture<PreFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreFooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreFooter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
