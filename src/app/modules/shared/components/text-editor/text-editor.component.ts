import { Component, OnInit, AfterViewInit, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { UploadImgComponent } from './upload-img/upload-img.component';
import { DynamicContentComponent } from './dynamic-content/dynamic-content.component';
import { SessionService } from '../../providers/session.service';
import { DomSanitizer } from '@angular/platform-browser';
declare var CKEDITOR: any;
@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent implements OnInit, AfterViewInit {
  ckEditorConfig;
  public editor: any;
  editorValue;

  dynamicContent = [];
  dialogOptions: any = {
    width: '700px',
    height: '600px',
    panelClass: 'appModalPopup'
  };
  dynamicContentDialogOptions: any = {
    width: '650px',
    height: '400px',
    panelClass: 'appModalPopup'
  };
  @Output('uploadImage') uploadImageEvent = new EventEmitter<any>();
  @Input('organizationId') organizationId = '';
  constructor (
    public dialog: MatDialog,
    private _ngZone: NgZone,
    private domSanitizer: DomSanitizer
  ) { }

  ngOnInit () {
    let self = this;
    let base = SessionService.get('base-role');
    if (CKEDITOR.plugins.registered.dynamicContent) {
      delete CKEDITOR.plugins.registered.dynamicContent;
    }
    CKEDITOR.plugins.add('dynamicContent', {
      icons: 'dynamicContent',
      init: function (editor) {
        editor.addCommand('insertDynamicContent', {
          exec: function (editor) {
            self._ngZone.run(() => {
              self.insertDynamicDialog(editor);
              // editor.insertHtml( 'The current date and time is: <em>' + now.toString() + '</em>' );
            });
          }
        });
        editor.ui.addButton('Timestamp', {
          icon: '/assets/images/dynamicContent.png',
          label: 'Insert Dynamic Content',
          command: 'insertDynamicContent',
          toolbar: 'about'
        });
      }
    });

    this.ckEditorConfig = {
      extraPlugins: 'dynamicContent',
      'removeButtons': 'Button,Find,Replace,Iframe,ImageButton,Form,TextArea,TextField,Textarea,Checkbox,RadioButton,SelectionField,Maximize,IFrame,About,Flash,Language,ShowBlocks,Save,Print,HiddenField,Subscript,Superscript,search,NewPage,DocProps,Preview,Templates',
      'easyimage_styles': {
        full: {
          // Changes just the class name, icon label remains unchanged.
          attributes: {
            'class': 'my-custom-full-class'
          }
        },
        skipBorder: {
          attributes: {
            'class': 'skip-border'
          },
          group: 'borders',
          label: 'Skip border'
        },
        thickBorder: {
          attributes: {
            'class': 'thick-border'
          },
          group: 'borders',
          label: 'Thick border'
        }
      },
      height: 500
    };
  }

  registerCKEditorCommands (editor: any) {
    let self = this;
    editor.addCommand('image', {
      exec: this.onUploadImage.bind(this)
    });
  }

  setTemplate (template) {
    let self = this;
    setTimeout(function () {
      self.editor.setData(template);
      // self.editor.insertHtml(template);
    });
  }

  getData () {
    let self = this;
    let htmldata = self.editor.getData();
    return htmldata;
  }

  ngAfterViewInit () {
    let self = this;
    setTimeout(function () {
      for (let instanceName in CKEDITOR.instances) {
        self.editor = CKEDITOR.instances[instanceName];
        self.editor.on('instanceReady', function (ev: any) {
          let _editor = ev.editor;
          self.registerCKEditorCommands(_editor);
        });
      }
    });
  }

  onUploadImage (editor: any) {
    // this.uploadModal.open();
    this._ngZone.run(() => {
      this.onUploadImageDialog(editor);
    });
  }

  onUploadImageDialog (editor) {
    let uploadImgDialogRef = this.dialog.open(UploadImgComponent, this.dialogOptions);
    uploadImgDialogRef.componentInstance.organizationId = this.organizationId;
    uploadImgDialogRef.componentInstance.uploadImageEvent.subscribe((event) => {
      this.uploadImageEvent.emit(event);
    });
    uploadImgDialogRef.afterClosed().subscribe((result) => {
      let path = uploadImgDialogRef.componentInstance.insertImagePath;
      if (typeof result !== 'undefined') {
        this.insertImage(path, editor);
      }
    });
  }

  insertDynamicDialog (editor) {
    let dynamicContentComponentRef = this.dialog.open(DynamicContentComponent, this.dynamicContentDialogOptions);
    dynamicContentComponentRef.componentInstance.dynamicContent = this.dynamicContent;
    dynamicContentComponentRef.afterClosed().subscribe((result) => {
      if (typeof result !== 'undefined') {
        let content = dynamicContentComponentRef.componentInstance.selectedContent;
        // let link = editor.document.createElement("SPAN");
        // link.setText(content.value);
       // editor.insertElement(content);
       // editor.insertHtml(content);
        editor.insertHtml(content.value.toString().replace(/^\s+|\s+$/g,''));
      }
    });
  }

  insertImage (path, editor) {
    try {
      let link = editor.document.createElement('img');
      link.setAttribute('alt', 'Image');
      link.setAttribute('src', path);
      editor.insertElement(link);
    } catch (error) {
      console.log((error as Error).message);
    }
  }

}
