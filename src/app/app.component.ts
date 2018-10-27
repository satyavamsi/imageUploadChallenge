

import { Component} from '@angular/core';
import { Http, ResponseContentType } from '@angular/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import 'rxjs/operators';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {

  imageData: any;

  constructor(private http: Http, private sanitizer: DomSanitizer) {
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

        let urlCreator = window.URL;
        this.imageData = this.sanitizer.bypassSecurityTrustUrl(
            urlCreator.createObjectURL(blob));
      });
  }


}