/**
 * Created with JetBrains WebStorm.
 * User: Tom Le Coz
 * Date: 20/12/13
 * Time: 06:25
 * To change this template use File | Settings | File Templates.
 */


var BitmapData = function(w,h){
    if(BitmapData.index == undefined) BitmapData.index = 0;
    else BitmapData.index++;

    BitmapData.lastFloatArrayLen = -1;
    BitmapData.lastFloatArray = null;

    this.ratioX = 1;
    this.ratioY = 1;

    this.bmp = document.createElement("canvas")
    this.bmp.id = "bimapdata_"+BitmapData.index;
    this.context = this.bmp.getContext("2d");

    this.bmp.width = w;
    this.bmp.height = h;

    this.onLoad = function(){};
    this.onDraw = function(){};
    this.onResize = function(){};

}
BitmapData.prototype.initFromURL = function(url){
    var img = new Image();
    var th = this;
    var w, h,_w,_h;
    img.onload = function(){
        w = this.width;
        h = this.height;
        th.bmp.width = _w = th.getPowerOfTwo(w);
        th.bmp.height = _h = th.getPowerOfTwo(h);
        th.ratioX = w / _w;
        th.ratioY = h / _h;
        //alert("img load "+th.context+" : "+th.ratioX +" , "+th.ratioY);
        th.context.drawImage(this,0,0,w,h);
        th.onResize();
        th.onLoad();
    }
    img.src = url;
}

BitmapData.prototype.initFromCanvas = function(mc){
    var w, h,_w,_h;
    var th = this;

    w = mc.width;
    h = mc.height;
    th.bmp.width = _w = th.getPowerOfTwo(w);
    th.bmp.height = _h = th.getPowerOfTwo(h);
    th.ratioX = w / _w;
    th.ratioY = h / _h;
    th.drawImage(mc,0,0,w,h);
    th.onResize();
    th.onLoad();
}




BitmapData.prototype.getPowerOfTwo = function(n){
    var a = 1;
    while(a<n)a*=2;
    return a;
}

BitmapData.prototype.draw = function(element,px,py,w,h){
    this.context.clearRect(px,py,w,h);
    this.context.drawImage(element,px,py,w,h);
    this.onDraw();
}

BitmapData.prototype.getRGBAPixelRect = function(px,py,w,h,buffer){
    var imgW = this.bmp.width;
    var imgH = this.bmp.height;



    if(px + w > imgW) w -= (px + w) % imgW;
    if(py + h > imgH) h -= (py + h) % imgH;


    var c = this.context.getImageData(px,py,w,h).data;
    var k = 0;
    var len = c.length;
    var i;
    var col;
    var sum = 0;
    /*
    for(i=0;i<len;i+=4) {
        col = parseFloat(c[i+3] << 24 | c[i] << 16 | c[i+1] << 8 | c[i+2]);
        buffer[k++] = buffer[k++] = buffer[k++] = col;
        sum += col;
    }
    */
    //   buffer.o.update();

    //var t = new Uint32Array(c);
    for(i=0;i<len;i+=4) {
        col = c[i+3] << 24 | c[i] << 16 | c[i+1] << 8 | c[i+2];
        buffer[k++] = buffer[k++] = buffer[k++] = col;
        sum += col;
    }






    return sum/len;
}