import {Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ContainerService} from './container.service';
import {NewContainer} from '../domain/new-container';
import {PairPipe} from '../infrastructure/pipe/pair-pipe';
import {Container} from '../domain/container';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ItemComponent} from '../item/item.component';
import {FormService} from '../infrastructure/form.service';
import {NgbCollapse, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {PrintComponent} from '../print/print.component';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css'],
  providers: [PairPipe],
})
export class ContainerComponent implements OnInit {

  @ViewChild(ItemComponent) itemComponent: ItemComponent;
  @ViewChild('containerCollapse') containerCollapse: NgbCollapse;
  @ViewChildren(ItemComponent) itemComponents: QueryList<ItemComponent>;

  containers: Container[] = [];
  addContainerForm: FormGroup;
  containerNameFormControl: FormControl;
  isCollapsed: Boolean[] = [];
  private currentLocation = window.location.origin;

  constructor(private containerService: ContainerService, private formService: FormService,
              private modalService: NgbModal, private router: Router) {
  }

  ngOnInit() {
    this.containerNameFormControl = new FormControl('', Validators.required);
    this.addContainerForm = new FormBuilder().group({
      containerNameFormControl: this.containerNameFormControl,
    });
    this.containerService.getContainers().subscribe((containers: Container[]) => {
        this.containers = containers;
        this.containers.forEach(() => this.isCollapsed.push(true));
      }
    );
  }

  addContainer(containerName: string): void {
    if (containerName.trim() === '' || isNullOrUndefined(this.itemComponent.getItem())) {
      this.formService.markAsDirty(containerName, this.containerNameFormControl);
      this.itemComponent.markAllAsDirty();
      return;

    }
    if (this.itemComponent.itemIsEmpty()) {
      return;
    }
    this.containerService.addContainer(new NewContainer(containerName, this.itemComponent.getItem()))
      .subscribe(container => {
        this.formService.resetFormControl(this.containerNameFormControl);
        this.containers.push(container);
        this.itemComponent.clearItem();
      });
  }

  collapse(elementId: number) {
    this.isCollapsed[elementId] = !this.isCollapsed[elementId];
  }

  addItemToContainer(id: String, itemComponent: ItemComponent) {
    if (isNullOrUndefined(itemComponent.getItem())) {
      itemComponent.markAllAsDirty();
      return;
    }

    if (itemComponent.itemIsEmpty()) {
      return;
    }

    this.containerService.addItemToContainer(id, itemComponent.getItem())
      .subscribe(() => {
        this.containers.map((container: Container) => {
          if (container.id === id) {
            container.add(itemComponent.getItem());
            itemComponent.clearItem();
          }
        });
      });
  }

  generateSticker(containerId: String) {
    this.containerService.getContainer(containerId)
      .subscribe((container: Container) => {
        const modalRef = this.modalService.open(PrintComponent, {size: 'lg'});
        modalRef.componentInstance.container = container;
      });
  }

  getDetails(containerId: String) {
    this.router.navigate(['containers', containerId]);
  }

  getContainerURL(containerId: String) {
    return this.currentLocation + '/#/containers/' + containerId;
  }
}
