this._elementIsDragged=false;
this._draggedElement=null;
this._mouseCenterEntered=false;
this._draggerElements=new Array();

this._containerParams= new Object();

function draggerElement(x,y){
    this.staticX=x;
    this.staticY=y;

}

jQuery(document).ready(function(){
    calculateContainerPosition();
})

/*ezeket tiltjuk*/
jQuery(document).ready(function(){
    jQuery(".dragger-draggable").on('dragstart', function(event) {
        return false;
    })

    jQuery(".dragger-draggable").on('dragend', function(event) {
        return false;
    })
})

jQuery(document).ready(function(){

    jQuery(".dragger-draggable").mousedown(function(sender){
        jQuery(this).addClass("dragged-element");
        jQuery(this).removeClass("dragger-element-still");
        window._draggedElement=this;
        window._elementIsDragged=true;
        trackElementWithPosition(sender);
    })

    jQuery(window).mouseup(function(){
        if(window._elementIsDragged){
            jQuery(window._draggedElement).removeClass("dragged-element");
            jQuery(window._draggedElement).addClass("dragger-element-still");

            /*If it was inside the center container.*/
            if(window._mouseCenterEntered){
                jQuery("#dragger-center").append(window._draggedElement);
            }
            else{
                jQuery("#dragger-elements-wrapper").append(window._draggedElement);
            }
        }
        jQuery(window._draggedElement).css("left","");
        jQuery(window._draggedElement).css("top","");
        window._elementDragged=false;
        window._draggedElement=null;
    })
})

jQuery(document).ready(function(){
    jQuery(window).mousemove(function(sender){
        if(window._elementIsDragged){
            trackElementWithPosition(sender);
        }

        if((sender.pageX>=window._containerParams.leftStart)
            &&(sender.pageY>=window._containerParams.topStart)
            &&(sender.pageX<window._containerParams.leftEnd)
            &&(sender.pageY<window._containerParams.topEnd)){
            window._mouseCenterEntered=true;
            jQuery("#dragger-center").addClass("dragger-center-hovered");
        }
        else{
            window._mouseCenterEntered=false;
            jQuery("#dragger-center").removeClass("dragger-center-hovered");
        }
    })

    jQuery(window).resize(function(){
        calculateContainerPosition();
    })
})

function calculateContainerPosition(){
    var startOffset = jQuery("#dragger-center").offset();
    var endOffset = new Object();
    endOffset.left = startOffset.left + jQuery("#dragger-center").outerWidth();
    endOffset.top = startOffset.top + jQuery("#dragger-center").outerHeight();

    window._containerParams.leftStart = startOffset.left;
    window._containerParams.topStart = startOffset.top;
    window._containerParams.leftEnd = endOffset.left;
    window._containerParams.topEnd = endOffset.top;
}

function trackElementWithPosition(sender){
    jQuery(window._draggedElement).css("left",sender.pageX - jQuery(window._draggedElement).width()/2);
    jQuery(window._draggedElement).css("top",sender.pageY - jQuery(window._draggedElement).height()/2);
}


