/**
 * Created by Tom on 23/12/13.
 */

var BlendModeComponent = new Object()
BlendModeComponent.ZERO = "ZERO";
BlendModeComponent.ONE = "ONE";
BlendModeComponent.SRC_COLOR = "SRC_COLOR";
BlendModeComponent.ONE_MINUS_SRC_COLOR = "ONE_MINUS_SRC_COLOR";
BlendModeComponent.DST_COLOR = "DST_COLOR";
BlendModeComponent.ONE_MINUS_DST_COLOR = "ONE_MINUS_DST_COLOR";
BlendModeComponent.SRC_ALPHA = "SRC_ALPHA";
BlendModeComponent.ONE_MINUS_SRC_ALPHA = "ONE_MINUS_SRC_ALPHA";
BlendModeComponent.DST_ALPHA = "DST_ALPHA";
BlendModeComponent.ONE_MINUS_DST_ALPHA = "ONE_MINUS_DST_ALPHA";
BlendModeComponent.SRC_ALPHA_SATURATE = "SRC_ALPHA_SATURATE";
BlendModeComponent.CONSTANT_COLOR = "CONSTANT_COLOR";
BlendModeComponent.ONE_MINUS_CONSTANT_COLOR = "ONE_MINUS_CONSTANT_COLOR";
BlendModeComponent.CONSTANT_ALPHA = "CONSTANT_ALPHA";
BlendModeComponent.ONE_MINUS_CONSTANT_ALPHA = "ONE_MINUS_CONSTANT_ALPHA";


var BlendModeEquation = new Object();
BlendModeEquation.ADD = "ADD"
BlendModeEquation.SUBTRACT = "SUBTRACT"
BlendModeEquation.REVERSE_SUBTRACT = "REVERSE_SUBTRACT"
BlendModeEquation.MIN = "MIN"
BlendModeEquation.MAX = "MAX"

var BlendMode = new Object();

var Blend = function(component0,component1,equation){
    this.c0 = component0;
    this.c1 = component1;
    this.eq = equation;
}


Blend.prototype.enable = function(){
    var gl = Blend.gl;
    gl.blendFunc(gl[this.c0],gl[this.c1]);
    //gl.blendEquation(gl[this.eq]);
    gl.enable(gl.BLEND);

    //this.gl.disable(this.gl.DEPTH_TEST);
}

Blend.prototype.disable = function(){
    this.gl.disable(this.gl.BLEND);
    //this.gl.enable(this.gl.DEPTH_TEST);
}


BlendMode.USE_ALPHA_CHANNEL = new Blend(BlendModeComponent.SRC_ALPHA,BlendModeComponent.ONE_MINUS_SRC_ALPHA,BlendModeEquation.ADD);
