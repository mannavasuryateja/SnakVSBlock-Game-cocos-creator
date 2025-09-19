// scripts/CameraScroll.ts
import { _decorator, Component, Node, Vec3, EventMouse, EventTouch } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraScroll')
export class CameraScroll extends Component {
    @property({ type: Number })
    scrollSpeed = 2; // units per second

    update(dt: number) {
        const pos = this.node.position;
        pos.y += this.scrollSpeed * dt;
        this.node.setPosition(pos);
    }
    private dragging: boolean = false;
    private targetX: number = 0;
    private inputSensitivity: number = 1;

    private onMouseMove(e: EventMouse) {
        if (!this.dragging) return;
        const delta = e.getDelta();
        this.targetX += delta.x * this.inputSensitivity;
        console.log("Mouse moved, delta:", delta.x, "targetX:", this.targetX);
    }

    private onTouchMove(t: EventTouch) {
        if (!this.dragging) return;
        const delta = t.getDelta();
        this.targetX += delta.x * this.inputSensitivity;
        console.log("Touch moved, delta:", delta.x, "targetX:", this.targetX);
    }
}
