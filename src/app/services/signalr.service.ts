import { Injectable } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  constructor() {}

  private _connection: HubConnection;
  get connection() {
    return this._connection;
  }

  start(hubUrl: string) {
    if (
      !this.connection ||
      this._connection?.state == HubConnectionState.Disconnected
    ) {
      const builder: HubConnectionBuilder = new HubConnectionBuilder();

      const hubConnection = builder
        .withUrl(hubUrl)
        .withStatefulReconnect()
        .build();

      hubConnection
        .start()
        .then(() => {
          console.log('Connected');
        })
        .catch((err) => setTimeout(() => this.start(hubUrl), 2000));
      this._connection = hubConnection;
      this._connection.onreconnected((conntionId) =>
        console.log('Reconnected')
      );
      this._connection.onreconnecting((conntionId) =>
        console.log('Reconnecting')
      );
      this._connection.onclose((conntionId) =>
        console.log('Close reconnection')
      );
    }
  }

  invoke(
    procedureName: string,
    message: any,
    successCallBack?: (value: any) => void,
    errorCallBack?: (err: any) => void
  ) {
    this.connection
      .invoke(procedureName, message)
      .then(successCallBack)
      .catch(errorCallBack);
  }

  on(procedureName: string, callBack: (...message: any) => void) {
    this.connection.on(procedureName, callBack);
  }
}
