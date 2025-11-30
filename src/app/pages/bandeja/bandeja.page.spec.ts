import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BandejaPage } from './bandeja.page';

describe('BandejaPage', () => {
  let component: BandejaPage;
  let fixture: ComponentFixture<BandejaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
