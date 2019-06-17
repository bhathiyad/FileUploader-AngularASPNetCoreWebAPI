import { Component, OnInit } from '@angular/core';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import { ToastyService, ToastOptions } from 'ng2-toasty';
import { NgForm } from "@angular/forms";
import { FileInfo } from './FileInfo';
import { HttpClient } from '@angular/common/http';

// const URL = '/api/';
//const URL = 'https://localhost:44348/api/UploadFile';
const URL = 'https://localhost:5001/api/UploadFile';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  // uploader:FileUploader;
  // hasBaseDropZoneOver:boolean;
  // hasAnotherDropZoneOver:boolean;
  // response:string;

  // constructor (){
  //   this.uploader = new FileUploader({
  //     url: URL,
  //     headers:[{name:'Content-Type', value:'multipart/form-data'}], 
  //     disableMultipart: true, // 'DisableMultipart' must be 'true' for formatDataFunction to be called.
  //     formatDataFunctionIsAsync: true,
  //     formatDataFunction: async (item) => {
  //       return new Promise( (resolve, reject) => {
  //         resolve({
  //           name: item._file.name,
  //           length: item._file.size,
  //           contentType: item._file.type,
  //           date: new Date()
  //         });
  //       });
  //     }
  //   });

  //   this.hasBaseDropZoneOver = false;
  //   this.hasAnotherDropZoneOver = false;

  //   this.response = '';

  //   this.uploader.response.subscribe( res => this.response = res );
  // }

  // public fileOverBase(e:any):void {
  //   this.hasBaseDropZoneOver = e;
  // }

  // public fileOverAnother(e:any):void {
  //   this.hasAnotherDropZoneOver = e;
  // }

  uploader: FileUploader | null = null;
  //model:any = { Id : 0, Description : "Test"};
  model = new FileInfo();
  hasBaseDropZoneOver:boolean;
  hasAnotherDropZoneOver:boolean;

  constructor(private toastyService: ToastyService, private http: HttpClient) { }

  ngOnInit() {
    this.initUploader();
  }

  initUploader() {
    this.uploader = new FileUploader(
      <FileUploaderOptions>{
        url: "https://localhost:5001/api/Upload/UploadFile",
        headers: [
          { name: "Accept", value: "application/json" }
        ],
        isHTML5: true,
        // allowedMimeType: ["image/jpeg", "image/png", "application/pdf", "application/msword", "application/zip"]
        allowedFileType: [
          "application",
          "image",
          "video",
          "audio",
          "pdf",
          "compress",
          "doc",
          "xls",
          "ppt",
          "pdf"
        ],
        removeAfterUpload: true,
        autoUpload: false,
        maxFileSize: 10 * 1024 * 1024
      }
    );

    this.uploader.onBuildItemForm = (fileItem, form) => {
      console.log(fileItem);
      for (const key in this.model) {
        if (this.model.hasOwnProperty(key)) {
          form.append(key, (<any>this.model)[key]);
        }
      }
    };

    this.uploader.onCompleteAll = () => {
      // clear the form
      // this.model = new Ticket();

      this.toastyService.success(
        <ToastOptions>{
          title: "Success!",
          msg:
            "Your ticket has been submitted successfully and will be resolved shortly!",
          theme: "bootstrap",
          showClose: true,
          timeout: 15000
        }
      );
    };

    this.uploader.onWhenAddingFileFailed = (item, filter, options) => {
      console.log(options);
      this.toastyService.error(
        <ToastOptions>{
          title: "Error!",
          msg: `You can't select ${item.name} file because of the ${filter.name} filter.`,
          theme: "bootstrap",
          showClose: true,
          timeout: 15000
        }
      );
    };

    this.uploader.onErrorItem = (fileItem, response, status, headers) => {
      console.log({ status, headers });
      this.toastyService.error(
        <ToastOptions>{
          title: "Error uploading file!",
          msg: `${response} -> ${fileItem.file.name}`,
          theme: "bootstrap",
          showClose: true,
          timeout: 15000
        }
      );
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      console.log({ item, response, status, headers });
      if (response) {
        const ticket = JSON.parse(response);
        console.log(`ticket:`, ticket);
      }
    };
  }

  getCookie(name: string): string {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) {
      const lastItem = parts.pop();
      if (lastItem) {
        const uri = lastItem.split(";").shift();
        if (uri) {
          return decodeURIComponent(uri);
        }
      }
    }
    return "";
  }

  submitForm(form: NgForm) {
    console.log("this.model", this.model);
    console.log("form.value", form.value);
    console.log("this.fileUploader", this.uploader);

    this.http.get<any[]>("https://localhost:5001/api/Upload/UploadFile")
    .subscribe(a => {
      console.log(a);
    });

    if (!this.uploader) {
      throw new Error("this.fileUploader is null.");
    }
    this.uploader.uploadAll();

    // NOTE: Upload multiple files in one request -> https://github.com/valor-software/ng2-file-upload/issues/671
  }

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }

}
