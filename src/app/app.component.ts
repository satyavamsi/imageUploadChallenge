

import { Component} from '@angular/core';
import { Http, ResponseContentType, RequestOptions } from '@angular/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import 'rxjs/operators';
import { HttpHeaders, HttpClient, HttpRequest } from '@angular/common/http';
import { Headers } from '@angular/http';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {

  imageData: any;
  imageFile: any;

  constructor(private http: Http, private sanitizer: DomSanitizer, private http2: HttpClient) {
  }



  getImage(){
    const imageUrl = 'https://picsum.photos/200/300/?random';
    
    this.http.get(imageUrl, {
      responseType: ResponseContentType.Blob
    })
      .toPromise()
      .then((res: any) => {
        let blob = new Blob([res._body], {
          type: res.headers.get("Content-Type")
        });
        this.imageFile=blob;
        let urlCreator = window.URL;
        this.imageData = this.sanitizer.bypassSecurityTrustUrl(
            urlCreator.createObjectURL(blob));
      });
  }

  uploadImage() {
    const url = 'https://edystupload.s3.ap-south-1.amazonaws.com/';
    const headers = new HttpHeaders({'content-type': 'multipart/form-data'});
    const formData: FormData = new FormData(); 

  
    const body= {
      'x-amz-date' : '20181027T094242Z',
      'x-amz-algorithm': 'AWS4-HMAC-SHA256',
      'key': 'tempuploads/test123',
      'x-amz-signature': '73f5606614f7cd8c96f74ccaa49a1c7a14fc05a76d73d2b7a7e61f3cdd4aa465',
      'policy': 'eyJjb25kaXRpb25zIjogW3siYnVja2V0IjogImVkeXN0dXBsb2FkIn0sIFsic3RhcnRzLXdpdGgiLCAiJGtleSIsICJ0ZW1wdXBsb2Fkcy8iXSwgeyJ4LWFtei1hbGdvcml0aG0iOiAiQVdTNC1ITUFDLVNIQTI1NiJ9LCB7IngtYW16LWNyZWRlbnRpYWwiOiAiQUtJQUlDRUFTM1RGUUtZSVAyU0EvMjAxODEwMjcvYXAtc291dGgtMS9zMy9hd3M0X3JlcXVlc3QifSwgeyJ4LWFtei1kYXRlIjogIjIwMTgxMDI3VDA5NDI0MloifV0sICJleHBpcmF0aW9uIjogIjIwMTgtMTAtMjlUMDk6NDI6NDJaIn0=',
      'x-amz-credential': 'AKIAICEAS3TFQKYIP2SA/20181027/ap-south-1/s3/aws4_request',
      'file': this.imageFile
    }
    for(let key in body){
      formData.append(key, body[key]);
    }

    const req = new HttpRequest('POST',url, formData, {
      reportProgress: true // for progress data
    });


    this.http2.request(req)
              .subscribe((res) =>  {
                  console.log(res);
              });
  }


}