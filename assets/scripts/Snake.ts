// scripts/Snake.ts
import { _decorator, Component, Node, Prefab, instantiate, Vec3, input, Input, EventTouch, EventMouse } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Snake')
export class Snake extends Component {
    @property(Prefab) segmentPrefab: Prefab | null = null;
    @property({ type: Number }) initialSegments = 6;
    @property({ type: Number }) inputSensitivity = 0.5;
    @property({ type: Number }) steerSpeed = 50; // head responsiveness

    @property({ type: Number }) followSpacing = 30; // distance between segments

    @property({ type: Number }) laneWidth = 200;    // width of one column
    @property({ type: Number }) laneCount = 5;      // total columns

    private targetX = 0;
    private dragging = false;
    private segments: Node[] = [];

    onLoad() {
        // Input setup
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);

        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);

        // Create initial segments
        for (let i = 0; i < this.initialSegments; i++) {
            this.addSegment();
        }
    }

    onDestroy() {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);

        input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    // --- Input Handlers ---
    private onTouchStart(t: EventTouch) { this.dragging = true; }
    private onTouchMove(t: EventTouch) {
        if (!this.dragging) return;
        const delta = t.getDelta();
        this.targetX += delta.x * this.inputSensitivity;
    }
    private onTouchEnd() { this.dragging = false; }

    private onMouseDown(e: EventMouse) { this.dragging = true; }
    private onMouseMove(e: EventMouse) {
        if (!this.dragging) return;
        const delta = e.getDelta();
        this.targetX += delta.x * this.inputSensitivity;
    }
    private onMouseUp() { this.dragging = false; }

    // --- Update Loop ---
    update(dt: number) {
        const gm = (globalThis as any).GameManager;
        let fixedY = this.node.position.y;
        if (gm && gm.cameraNode) {
            fixedY = gm.cameraNode.position.y - 300;
        }

        // Move head fast and responsive
        const pos = this.node.position;
        pos.x += (this.targetX - pos.x) * Math.min(1, this.steerSpeed * dt);
        pos.y = fixedY;

        // Clamp inside lanes
        const halfWidth = (this.laneCount - 1) * this.laneWidth * 0.5;
        pos.x = Math.min(Math.max(pos.x, -halfWidth), halfWidth);
        this.node.setPosition(pos);

        // --- Segment Following (Real-time, responsive) ---
        let prevPos = this.node.position.clone(); // head leads

        for (let i = 0; i < this.segments.length; i++) {
            const seg = this.segments[i];
            const segPos = seg.position.clone();

            // direction vector from segment to previous
            const dir = prevPos.subtract(segPos);
            const dist = dir.length();

            if (dist > this.followSpacing) {
                dir.normalize();
                seg.setPosition(segPos.add(dir.multiplyScalar(dist - this.followSpacing)));
            }

            // next segment follows this one
            prevPos = seg.position.clone();
        }
    }

    // --- Body Management ---
    public addSegment(count = 1) {
        for (let i = 0; i < count; i++) {
            if (!this.segmentPrefab) continue;

            const n = instantiate(this.segmentPrefab);
            this.node.parent?.addChild(n);

            const anchor = this.segments.length ? this.segments[this.segments.length - 1] : this.node;
            const pos = anchor.position.clone();
            pos.y -= this.followSpacing;
            n.setPosition(pos);

            this.segments.push(n);
        }
    }

    public removeSegments(count = 1) {
        for (let i = 0; i < count; i++) {
            if (this.segments.length > 0) {
                const last = this.segments.pop()!;
                last.destroy();
            } else {
                this.node.destroy();
                break;
            }
        }
    }

    public getLength() {
        if (!this.node.isValid) return 0;
        return 1 + this.segments.length;
    }
}
