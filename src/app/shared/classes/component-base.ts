import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';

export class ComponentBase {
    protected subscriptions: Subscription[] = [];

    // -------------------------------------------------------------------------------------------------------------------
    protected rxs(s: Subscription): void {
        this.subscriptions.push(s);
    }
}
