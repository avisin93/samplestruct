import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, AfterContentChecked, AfterViewChecked } from '@angular/core';
import { RuleService } from '../rule/rule/rule.service';
import { SweetAlertController } from '../../shared/controllers/sweet-alert.controller';
import { LoaderService } from '../../shared/components/loader/loader.service';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: 'app-image-edit',
  templateUrl: './image.edit.component.html',
  providers: [RuleService]
})
export class ImageEditComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

  @ViewChild('targetImage') img: ElementRef;
  public imagePath: string = 'assets/images/DMR.png';
  public isImageLoaded: boolean = true;
  public shouldTextToImage: boolean = false;
  public finalImageData;
  public areaCoords = {
    topLeftX: 0,
    topLeftY: 0,
    bottomRightX: 0,
    bottomRightY: 0,
    areaWidth: 0,
    areaHeight: 0
  };
  constructor (private ruleService: RuleService,
    private loaderService: LoaderService,
    private toaster: ToastrService) {

  }

  ngOnInit () {
    this.getImageData();
  }

  ngAfterViewInit () {

  }

  ngAfterViewChecked () {

  }

  ngOnDestroy () {

  }

  getImageData () {
    this.isImageLoaded = false;
    this.ruleService.getImageData({}).subscribe(data => {
      this.finalImageData = 'data:image/jpeg;base64,' + data.imgData;
      this.isImageLoaded = true;
      setTimeout(() => {
        this.initImageArea();
      }, 200);
    },() => {
      this.isImageLoaded = true;
    });
  }

  updateAreaCoordinates (event) {
    this.areaCoords.topLeftX = event.x;
    this.areaCoords.topLeftY = event.y;
    this.areaCoords.bottomRightX = event.x2;
    this.areaCoords.bottomRightY = event.y2;
    this.areaCoords.areaHeight = event.h;
    this.areaCoords.areaWidth = event.w;
    console.log('Updated area coords are: ', JSON.stringify(this.areaCoords));
    console.log('width=' + event.w + ' height=' + event.h);
  }

  resetCoords (event) {
    if (this.shouldTextToImage && (event.w === 0 && event.h === 0)) {
      this.shouldTextToImage = false;
    }
  }

  showConfirmationMsg (textMsg,callbackfn,noCallbackfn) {
    let confimMsg = new SweetAlertController();
    let options = {
      title: 'Confirm Message',
      text: textMsg,
      type: 'warning',
      width: '370px',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    };
    confimMsg.deleteConfirm(options,callbackfn,noCallbackfn);
  }

  initImageArea () {
    $(this.img.nativeElement).Jcrop({
      onSelect: this.updateAreaCoordinates.bind(this),
      onChange: this.resetCoords.bind(this)
    });
  }

  saveModifiedPDF (msgToShow = '', fillArea = true, targetValue = '') {
    msgToShow = msgToShow !== '' ? msgToShow : 'Do you want to fill the area of PDF?';
    this.showConfirmationMsg(msgToShow, () => {
      this.loaderService.show();
      this.ruleService.saveModifiedPDF({ areaCoords: this.areaCoords, fillArea: fillArea, targetText: targetValue }).subscribe(data => {
        this.shouldTextToImage = false;
        this.loaderService.hide();
        this.toaster.success('The modified PDF saved successfully');
      },() => {
        this.shouldTextToImage = false;
        this.loaderService.hide();
        this.toaster.error('Something went wrong');
      });
    }, () => {});
  }

  createVanvas () {
    this.showConfirmationMsg('Do you want to add text over PDF?', () => {
      let canvas = document.getElementById('canvas') as HTMLCanvasElement;
      let context = canvas.getContext('2d');
      canvas.width = $(this.img.nativeElement).width();
      canvas.height = $(this.img.nativeElement).height();
      context.drawImage($(this.img.nativeElement).get(0), 0, 0);
      context.font = '20pt';
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage($(this.img.nativeElement).get(0), 0, 0);
      context.fillStyle = 'black';
      context.fillText('The edited text is', this.areaCoords.topLeftX, this.areaCoords.topLeftY);
    }, () => {});
  }

  addTextOnImage () {
    const self = this;
    this.shouldTextToImage = true;
    setTimeout(() => {
      let divText = document.getElementById('text-area');
      let txtArea = document.createElement('textarea');
      txtArea.id = 'image-txt';
      let submitButton = document.createElement('button');
      submitButton.type = 'button';
      submitButton.value = 'Submit Text';
      submitButton.innerHTML = 'Submit Text';
      submitButton.id = 'append-text';
      divText.appendChild(txtArea);
      divText.appendChild(submitButton);
      $('#append-text').on('click', () => {
        console.log(txtArea.value);
        self.saveModifiedPDF('Do you want to add the text?', false, txtArea.value);
      });
    }, 100);
  }

}
