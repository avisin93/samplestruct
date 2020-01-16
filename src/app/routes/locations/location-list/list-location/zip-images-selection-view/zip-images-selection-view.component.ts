import { Component, OnInit, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { ListLocation } from '../list-location';
import * as _ from 'lodash';
import { NgxGalleryComponent, INgxGalleryOptions } from 'ngx-gallery';
import { DEFAULT_GALLERY_OPTIONS } from '@app/config';

declare var $: any;

@Component({
  selector: 'zip-images-selection-view',
  templateUrl: './zip-images-selection-view.component.html',
  styleUrls: ['./zip-images-selection-view.component.scss']
})
export class ZipImagesSelectionViewComponent implements OnInit {
  @Output() hideModal: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('zipGallery') zipGallery: NgxGalleryComponent;
  zipGalleryImages: any = [];
  locationIndex: number = 0;
  selectedlocationDetails: any = {};
  selectedImagesList: any = [];
  showCategorySection: boolean = false;
  showImageSection: boolean = false;
  public galleryOptions: INgxGalleryOptions[] = DEFAULT_GALLERY_OPTIONS
  constructor(public listLocation: ListLocation) { }

  ngOnInit() { }
  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.setDefaultViewSelectionData(true);
      this.previewClose();
    }
  }

  /**
  * It removes images from zipLocationArr
  */
  removeImageFromZipLocationsArr(index) {
    this.selectedlocationDetails.images.splice(index, 1);
    if (this.selectedlocationDetails.images.length == 0) {
      this.listLocation.zipDetails.locations.splice(this.locationIndex, 1);
      delete this.listLocation.zipLocationsObj[this.selectedlocationDetails.locationId];
      this.setDefaultViewSelectionData(false);
      if (this.listLocation.zipDetails.locations.length == 0) {
        // this.viewSelectionModal.hide();
        this.listLocation.clearData();
        this.hideModal.emit();
      }
    }
  }
  /**
  * It sets initial/default data needed for view selectiom modal popup
  * @param closeActiveFolderFlag as boolean to close active folder 
  */
  setDefaultViewSelectionData(closeActiveFolderFlag: boolean) {
    this.showCategorySection = false;
    this.showImageSection = false;
    this.selectedlocationDetails = {};
    this.locationIndex = 0;
    if (closeActiveFolderFlag) {
      const activeFolder = _.find(this.listLocation.zipDetails.locations, { 'active': true });
      if (activeFolder) {
        activeFolder.active = false;
      }
    }
  }
  /**
  * It shows/hides category section conditionally on view selection popup
  * @param receivedFolder as object for selected location
  */
  showCategory(receivedFolder, index) {
    this.locationIndex = index;
    const activeFolder = _.find(this.listLocation.zipDetails.locations, { 'active': true });
    if (activeFolder) {
      activeFolder.active = false;
      this.showCategorySection = (activeFolder !== receivedFolder) ? true : false;
    } else {
      this.showCategorySection = true;
    }
    receivedFolder["active"] = this.showCategorySection;
    this.showImageSection = false;
    this.selectedlocationDetails = this.showCategorySection ? receivedFolder : {};
  }
  /**
  * It shows/hides images section conditionally on view selection popup
  */
  showSelectedImagesList() {
    this.showImageSection = !this.showImageSection;
    this.selectedImagesList = this.showImageSection ? this.selectedlocationDetails.images : [];
  }
  /**
  * It adds/removes current image from/to collection of images in zipLocationsObj object of listLocation shared service
  * @param index as number for for getting selected image index
  */
  openGalleryPreview(index: number) {
    setTimeout(() => {
      this.zipGallery.openPreview(index);
    }, 50);
  }
  /**
  * It adds/removes current image from/to collection of images in zipLocationsObj object of listLocation shared service
  * @param index as number for getting selected image index
  */
  openZipGalleryPreview(index: number) {
    this.zipGalleryImages = this.selectedlocationDetails.images;
    this.openGalleryPreview(index);
  }
  /**
  * It sets orientation to image opened in preview
  */
  setOrientationToImage(event) {
    this.listLocation.setOrientationToImage(this, event);
  }
  /**
  * It hides preview on click of close button
  */
  previewClose() {
    this.listLocation.previewClose(this);
    this.zipGalleryImages = [];
  }
}
