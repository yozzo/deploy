/**
 * Created with JetBrains WebStorm.
 * User: Tom Le Coz
 * Date: 18/12/13
 * Time: 05:27
 * To change this template use File | Settings | File Templates.
 */

var MouseObj = function(canvas,rotationMax){
    this.x = 0;
    this.y = 0;
    this.rotaMax = rotationMax;
    this.rotaX = 0;
    this.rotaY = 0;

    this.mc = canvas;
    this.onMove = function(){};

    var rect = canvas.getBoundingClientRect();
    var w = rect.width;
    var h = rect.height;
    var centerX = w / 2;
    var centerY = h / 2;
    var th = this;

    canvas.th = this;
    canvas.onmousemove = function(e){

        var th = this.th;
        //alert("mousemove "+this.th.rotaMax)
        e = e || window.event;
        if (e.pageX == null && e.clientX != null ) {
            var html = document.documentElement
            var body = document.body
            e.pageX = e.clientX + (html.scrollLeft || body && body.scrollLeft || 0)
            e.pageX -= html.clientLeft || 0
            e.pageY = e.clientY + (html.scrollTop || body && body.scrollTop || 0)
            e.pageY -= html.clientTop || 0
        }


        th.x = e.pageX - centerX;
        th.y = e.pageY - centerY;
        th.rotaY = (th.x / centerX) * th.rotaMax;
        th.rotaX = (th.y / centerY) * th.rotaMax;

        //alert(th.rotaX+" : "+th.rotaY);

        th.onMove();
    }
}


