/**
 * Created with JetBrains WebStorm.
 * User: Tom Le Coz
 * Date: 20/12/13
 * Time: 10:39
 * To change this template use File | Settings | File Templates.
 */

var Texture3D = function(gl){
    this.gl = gl;
    this.gpuTexture = gl.createTexture();
    this.uvScale = [1.0,1.0];

    this.onResize = function(){};
    this.onLoad = function(){};

    this.__initBitmapData(new BitmapData(1,1))



}

Texture3D.prototype.__initBitmapData = function(bd){
    var th = this;
    if(this.bitmapData != null){
        bd.onLoad = this.bitmapData.onLoad;
        this.bitmapData.onResize = function(){};
    }

    this.bitmapData = bd;
    this.bitmap = bd.bmp;

    this.bitmapData.onResize = function(){
        th.uvScale[0] = this.ratioX - 1/th.bitmap.width;
        th.uvScale[1] = this.ratioY - 1/th.bitmap.height;

        th.createMipmap();
        th.onResize();
    }





    this.createMipmap();

    this.uvScale[0] = this.bitmapData.ratioX - 1/this.bitmap.width;
    this.uvScale[1] = this.bitmapData.ratioY - 1/this.bitmap.height;
    this.bitmapData.onLoad();
    this.onResize();

    this.bitmapData.onDraw = function(){
        //alert("draw "+th.createMipmap)
        th.createMipmap();
    }

}

Texture3D.prototype.createMipmap = function(){
    var gl = this.gl;

    gl.bindTexture(gl.TEXTURE_2D, this.gpuTexture);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.bitmap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

Texture3D.prototype.initFromBitmapData = function(bd){
     this.__initBitmapData(bd);
}

Texture3D.prototype.initFromURL = function(url){
    this.bitmapData.initFromURL(url);
}
Texture3D.prototype.initFromCanvas = function(mc){
    this.bitmapData.initFromCanvas(mc);
}
