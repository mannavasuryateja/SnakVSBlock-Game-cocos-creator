// assets/scripts/GameManager.ts
import { _decorator, Component, Node, UITransform, Label } from 'cc';
const { ccclass, property } = _decorator;

import { Block } from './Block';
import { Pickup } from './Pickup';

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Node) snakeHead: Node | null = null;
    @property(Node) cameraNode: Node | null = null;

    @property(Label) hudLengthLabel: Label | null = null;
    @property(Label) hudScoreLabel: Label | null = null;
    @property(Node) gameOverPanel: Node | null = null;

    public static instance: GameManager | null = null;

    private blocks: Block[] = [];
    private pickups: Pickup[] = [];
    private score: number = 0;
    private isGameOver: boolean = false;

    onLoad() {
        GameManager.instance = this;
        (globalThis as any).GameManager = this;
    }

    // Register objects
    registerBlock(b: Block | null) { if (b) this.blocks.push(b); }
    registerPickup(p: Pickup | null) { if (p) this.pickups.push(p); }

    // Called by Pickup
    onPickupCollected(count: number) {
        if (this.isGameOver) return;
        const snake = this.snakeHead?.getComponent('Snake') as any;
        snake?.addSegment(count);
        this.score += count;
        this.updateHUD();
    }

    // Called by Block
    onBlockBroken(value: number) {
        this.score += value;
        this.updateHUD();
    }

    private updateHUD() {
        const snake = this.snakeHead?.getComponent('Snake') as any;
        const length = snake ? snake.getLength() : 0;
        if (this.hudLengthLabel) this.hudLengthLabel.string = `Length: ${length}`;
        if (this.hudScoreLabel) this.hudScoreLabel.string = `Score: ${this.score}`;
    }

    update(dt: number) {
        if (this.isGameOver) return;
        if (!this.snakeHead) return;

        // Only HEAD collisions
        for (const p of this.pickups) {
            if (p.node.active && this.isColliding(this.snakeHead, p.node)) {
                p.collect();
            }
        }
        for (const b of this.blocks) {
            if (b.node.active && this.isColliding(this.snakeHead, b.node)) {
                const snake = this.snakeHead?.getComponent('Snake') as any;
                const damage = b.applyCollision(snake.getLength());
                snake.removeSegments(damage);
                this.updateHUD();
                if (snake.getLength() <= 0) this.handleGameOver();
            }
        }

        this.blocks = this.blocks.filter(b => b.node.active);
        this.pickups = this.pickups.filter(p => p.node.active);
    }

    private isColliding(nodeA: Node, nodeB: Node): boolean {
        const a = nodeA.getComponent(UITransform);
        const b = nodeB.getComponent(UITransform);
        if (!a || !b) return false;
        return a.getBoundingBoxToWorld().intersects(b.getBoundingBoxToWorld());
    }

    private handleGameOver() {
        this.isGameOver = true;
        if (this.gameOverPanel) this.gameOverPanel.active = true;
    }
}
