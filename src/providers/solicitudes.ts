import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';

// providers
import { NetworkProvider } from './network';

@Injectable()
export class SolicitudesProvider {
    public user: any;
    private baseUrl = 'modules/rup/prestaciones/';

    constructor(
        public network: NetworkProvider) {
    }

    get(params) {
        return this.network.get(this.baseUrl, params);
    }

}