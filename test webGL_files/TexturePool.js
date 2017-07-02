/**
 * Created with JetBrains WebStorm.
 * User: Tom Le Coz
 */

var TexturePool = function (gl,shaderObj) {

    this.gl = gl;
    this.shader = shaderObj;

    this.names = new Array();
    this.gpuTextures = new Array();
    this.textureObjs = new Array();
    this.indexs = new Array();
    this.locations = new Array();
    this.nb = 0;
    this.nbLoaded = 0;

    this.__defineGetter__("isReady",function(){return this.nb == this.nbLoaded;})
}

TexturePool.prototype.defineNewTexture = function(name,location){
    var id = this.nb;

    var th = this;
    var glt = new Texture3D(this.gl);
    glt.bitmapData.onLoad = function(){
        th.nbLoaded++;
    }

    this.names[id] = name;
    this.textureObjs[id] = glt;
    this.gpuTextures[id] = glt.gpuTexture;
    this.locations[id] = location;
    this.indexs[id] = id;


    var th = this;
    this.shader.__defineGetter__(name,function(){return th.textureObjs[id];})
    this.shader.__defineSetter__(name,function(val){th.textureObjs[id] = val;})

    this.nb++;

    return glt;
}

TexturePool.prototype.defineNewTextureFromURL = function(name,location,url){
    this.defineNewTexture(name,location).initFromURL(url);
}
TexturePool.prototype.defineNewTextureFromCanvas = function(name,location,canvas){
    this.defineNewTexture(name,location).initFromCanvas(canvas);
}



TexturePool.prototype.apply = function(){
    var i,len = this.nb;
    var gl = this.gl;
    var id;
    for(i=0;i<len;i++){
        id = this.indexs[i];
        gl.activeTexture(gl["TEXTURE"+id]);
        gl.bindTexture(gl.TEXTURE_2D, this.gpuTextures[i]);
        gl.uniform1i(this.locations[i], id);
    }
}

























