import p5 from "p5";
import Game from "./Game";

export default {
  init: function(dom) {
    new p5(Game,dom)
  }
};
