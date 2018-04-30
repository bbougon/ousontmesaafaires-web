
export class FakeNgbActiveModal {

}

export class FakeNgbModal {

  open(content: any, options?: any) {
    return new FakeNgbModalRef();
  }
}

export class FakeNgbModalRef {

}
