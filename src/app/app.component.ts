import { Component, HostListener, NgZone } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import QrScanner from 'qr-scanner';
import { Observable, Subject, Subscriber } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent
{
  public webCamResult?: QrScanner.ScanResult;
  private trigger: Subject<void> = new Subject<void>();
  public mousePos: { x: number, y: number } = { x: 0, y: 0 };
  public webcamEnabled = true;

  constructor(private zone: NgZone) { }

  ngOnInit()
  {

    this.zone.runOutsideAngular(() =>
    {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream =>
        {
          this.zone.run(() =>
          {
            console.log(stream)
            // this.mediaTrackConstraints.deviceId = stream.id;
            // this.switchCameraSubscriber?.next(stream.id);
          });
        })
        .catch(err => console.error(err));
    })

  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: any)
  {
    //console.log(event.clientX, event.clientY);
    this.mousePos.x = event.clientX;
    this.mousePos.y = event.clientY;
  }

  public triggerSnapshot(): void
  {
    this.trigger.next();
  }

  public async handleImage(webcamImage: WebcamImage): Promise<void>
  {
    let result = await QrScanner.scanImage(webcamImage.imageAsDataUrl, { returnDetailedScanResult: true })
      .catch((err) =>
      {
        console.log(err)
      });

    if (!result)
      return;

    this.webCamResult = result;
    console.log(result)
  }

  public get triggerObservable(): Observable<void>
  {
    return this.trigger.asObservable();
  }
}
