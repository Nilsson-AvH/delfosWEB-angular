import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselAdmin } from './carousel-admin';

describe('CarouselAdmin', () => {
  let component: CarouselAdmin;
  let fixture: ComponentFixture<CarouselAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarouselAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
