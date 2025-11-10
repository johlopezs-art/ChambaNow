import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LinkTrabajoPage } from './link-trabajo.page';

describe('LinkTrabajoPage', () => {
  let component: LinkTrabajoPage;
  let fixture: ComponentFixture<LinkTrabajoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkTrabajoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
