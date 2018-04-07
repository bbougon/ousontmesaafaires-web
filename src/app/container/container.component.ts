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
    this.itemComponent.hint();
    if (containerName.trim() === '' || Object.keys(this.itemComponent.getItem()).length === 0) {
      this.formService.markAsDirty(containerName, this.containerNameFormControl);
      this.itemComponent.markAllAsDirty();
      return;
    }

    if (!this.itemComponent.itemsAreEmpty()) {
      return;
    }

    this.containerService.addContainer(new NewContainer(containerName, this.itemComponent.getCreatedItem().item))
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
    itemComponent.hint();
    if (Object.keys(itemComponent.getItem()).length === 0) {
      itemComponent.markAllAsDirty();
      return;
    }

    if (!itemComponent.itemsAreEmpty()) {
      return;
    }

    this.containerService.addItemToContainer(id, itemComponent.getCreatedItem())
      .subscribe(() => {
        this.containers.map((container: Container) => {
          if (container.id === id) {
            container.add(itemComponent.getCreatedItem());
            itemComponent.clearItem();
          }
        });
      });
  }

  generateSticker(containerId: String) {
    this.containerService.getContainer(containerId)
      .subscribe((container: Container) => {
        const modalRef = this.modalService.open(PrintComponent);
        modalRef.componentInstance.container = container;
      });
  }

  getDetails(containerId: String) {
    console.log('Container ID: ' + containerId);
    this.router.navigate(['containers', containerId ]);
  }
}
