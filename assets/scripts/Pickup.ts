import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

@ccclass('Pickup')
export class Pickup extends Component {
    collect() {
        // When collected, just deactivate (GameManager will add segments)
        (globalThis as any).GameManager?.onPickupCollected(this.count || 1);
    this.node.active = false;

    }

    resetForReuse() {
        this.node.active = true;
    }
}
