import { _decorator, Component, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Block')
export class Block extends Component {
    @property(Label) valueLabel: Label | null = null;
    private value: number = 1;

    setValue(v: number) {
        this.value = v;
        if (this.valueLabel) this.valueLabel.string = String(this.value);
    }

    applyCollision(snakeLen: number): number {
        if (snakeLen >= this.value) {
            // Snake survives, block fully destroyed
            const damage = this.value;
            this.value = 0;
            this.node.active = false;
            (globalThis as any).GameManager?.onBlockBroken(damage);
            return damage;
        } else {
            // Snake dies, block reduces only by snakeLen
            const damage = snakeLen;
            this.value -= damage;
            if (this.valueLabel) this.valueLabel.string = String(this.value);
            return damage;
        }
    }

    resetForReuse() {
        this.node.active = true;
    }
}
