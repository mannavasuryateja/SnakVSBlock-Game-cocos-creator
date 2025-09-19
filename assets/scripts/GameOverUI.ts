import { _decorator, Component, Node, Label, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameOverUI')
export class GameOverUI extends Component {
   @property(Node) panel: Node | null = null;
   @property(Label) finalScoreLabel: Label | null = null;

   show(score = 0) {
       if (this.panel) this.panel.active = true;
       if (this.finalScoreLabel) this.finalScoreLabel.string = `Final Score: ${score}`;
   }

   hide() {
       if (this.panel) this.panel.active = false;
   }

   onRestart() {
       const sc = director.getScene();
       if (sc && sc.name) {
           director.loadScene(sc.name);
       } else {
           window.location.reload();
       }
   }
}
