/**
 * Created with JetBrains WebStorm.
 * User: Tom Le Coz
 * Date: 19/12/13
 * Time: 07:25
 * To change this template use File | Settings | File Templates.
 */


var Render3D = function(width,height,fps){

    this.__initCanvasAndContext(width,height);

    Blend.gl = this.gl;
    this.camera = new Camera3D(this.gl);
    this.mouseObj = new MouseObj(this.canvas,180);
    this.currentShader = null;
    this.currentBlend = null;
    this.useDepthTest = true;


    var th = this;
    setInterval(this.update,Math.round(1000/fps),th)
}

Render3D.prototype.__initCanvasAndContext = function(w,h){
    this.canvas = document.createElement("canvas");
    this.canvas.id = "viewport";
    this.canvas.width = w;
    this.canvas.height = h;
    this.canvas.border = "none";
    this.canvas.margin = 0;
    this.elements = new Array();
    this.nbElement = 0;

    try{
        this.gl = this.canvas.getContext("experimental-webgl");
        //alert("gl = "+this.gl);
        this.gl.viewportWidth = w;
        this.gl.viewportHeight = h;
    } catch (e){
        alert("WebGL is not supported")
        return;
    }
    this.gl.clearColor(0.0,0.0,0.0,1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(WebGLRenderingContext.CULL_FACE)
    this.gl.cullFace(WebGLRenderingContext.FRONT);

    document.body.appendChild(this.canvas);
}


Render3D.prototype.addChild = function(mc){
    if(this.elements.lastIndexOf(mc)<0)this.elements[this.nbElement++] = mc;
    return mc;
}
Render3D.prototype.removeChild = function(mc){
    var id = this.elements.lastIndexOf(mc)
    if(id >= 0)this.elements.splice(id,1);
    return mc;
}

Render3D.prototype.update = function(th){



    with(th){

        if(nbElement){
            gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);



            camera.rotationX -= (camera.rotationX - mouseObj.rotaX) * 0.15;
            camera.rotationY -= (camera.rotationY - mouseObj.rotaY) * 0.15;
            camera.update();


            var i;
            th.el = elements[0];
            th.checkIfShaderOrBlendmodeChange(th);
            th.el.update();

            for(i=1;i<nbElement;i++){
                th.el = elements[i];
                th.checkIfShaderOrBlendmodeChange(th);
                th.el.update();
            }


        }

   }

}

Render3D.prototype.checkIfShaderOrBlendmodeChange = function(th){
    with(th){

        if(currentShader != th.el.shader){

            if(null != currentShader) currentShader.stop();
            currentShader = th.el.shader;
            currentShader.start();



            if(currentBlend != currentShader.blendMode){

                if(currentBlend == null){

                    useDepthTest = false;
                    gl.disable(gl.DEPTH_TEST);
                    currentBlend = currentShader.blendMode;
                    currentBlend.enable();

                }else{
                    if(currentShader.blendMode){

                        currentBlend.disable();
                        currentBlend = currentShader.blendMode;
                        currentBlend.enable();
                    }else{

                        currentBlend.disable();
                        currentBlend = currentShader.blendMode;
                        useDepthTest = true;
                        gl.enable(gl.DEPTH_TEST);
                    }
                }
            }
        }
    }
}























