import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../../+services';

@Component({
  moduleId: module.id,
  selector: 'lh-translations-notification',
  templateUrl: 'notification.component.html',
  styleUrls: [ 'notification.component.css' ],
  providers: [ WebsocketService ]
})
export class TranslationsNotificationComponent implements OnInit {
  constructor(private websocket: WebsocketService) { }

  ngOnInit() {
    this.websocket.init();
  }
}