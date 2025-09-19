import { _decorator, Component, Prefab, instantiate, Vec3, math, Color, Sprite, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Spawner')
export class Spawner extends Component {
    @property(Prefab) blockPrefab: Prefab | null = null;
    @property(Prefab) pickupPrefab: Prefab | null = null;

    @property
    columns: number = 5;
    @property
    columnSpacing: number = 300;

    @property({ type: Number })
    fallSpeed: number = 1000;   // pixels per second

    @property({ type: Number })
    spawnInterval: number = 1.2; // seconds between row spawns

    @property({ type: Number })
    rowSpacing: number = 200; // space between rows

    private spawnTimer: number = 0;
    private activeObjects: Node[] = [];
    private nextSpawnY: number = 800; // starting Y position for first row

    update(dt: number) {
        // --- Spawning ---
        this.spawnTimer += dt;
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnRow(this.nextSpawnY);
            this.spawnTimer = 0;

            // reduce row spacing by 20%
            this.nextSpawnY += this.rowSpacing * 0.4;
        }

        // --- Falling ---
        for (let i = this.activeObjects.length - 1; i >= 0; i--) {
            const obj = this.activeObjects[i];
            if (!obj.active) {
                this.activeObjects.splice(i, 1); // remove from list if inactive
                continue;
            }

            const pos = obj.position;
            pos.y -= this.fallSpeed * dt;
            obj.setPosition(pos);

            // cleanup if off-screen
            if (pos.y < -800) {
                obj.active = false;
                this.activeObjects.splice(i, 1);
            }
        }
    }

    spawnRow(spawnY: number) {
        const gm = (globalThis as any).GameManager;
        if (!gm) return;

        const half = (this.columns - 1) / 2;

        for (let i = 0; i < this.columns; i++) {
            const x = (i - half) * this.columnSpacing;

            let node: Node | null = null;
            if (Math.random() < 0.7 && this.blockPrefab) {
                // --- Block ---
                node = instantiate(this.blockPrefab);
                node.setParent(this.node.parent || this.node);
                node.setPosition(new Vec3(x, spawnY, 0));

                const bComp = node.getComponent('Block');
                bComp?.setValue(math.randomRangeInt(1, 20));

                // Assign random color
                const colors = [
                    new Color(255, 69, 0),
                    new Color(30, 144, 255),
                    new Color(34, 139, 34),
                    new Color(255, 215, 0),
                    new Color(148, 0, 211)
                ];
                const spr = node.getComponent(Sprite);
                if (spr) spr.color = colors[Math.floor(Math.random() * colors.length)];

                gm.registerBlock(bComp);
            } else if (this.pickupPrefab) {
                // --- Pickup ---
                node = instantiate(this.pickupPrefab);
                node.setParent(this.node.parent || this.node);
                node.setPosition(new Vec3(x, spawnY, 0));

                const pComp = node.getComponent('Pickup');
                gm.registerPickup(pComp);
            }

            if (node) {
                this.activeObjects.push(node);
            }
        }
    }
}
