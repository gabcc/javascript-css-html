this._filterState=0;
this._filterList= new Array();
this._activesList=new Array();
this._parentElement=jQuery("#content-filter");
this._allowFilterChange=true;
this._effectDuration=500;

jQuery(document).ready(function(){
    setFilterableElementsToDefault();
})

/**
 * A filter element class.
 * Task - represent a mosaic content entity.
 */
function filterElement(){
    /**
     *
     * @param currentCategory - gets the current active category, so it knows wheter it should be visible or not.
     */
    this.refreshAppearing=function(currentCategory){
        if(containsArrayElement(this.categories,currentCategory)){
            jQuery(this.elementRef).css("opacity",1);
            jQuery(this.elementRef).removeClass("filter-transformed");
        }
        else{
            jQuery(this.elementRef).css("opacity",0);
            jQuery(this.elementRef).addClass("filter-transformed");
        }
    }

    /**
     *
     * @param currCategory - gets the current active category.
     * @returns {boolean} - returns true if it's in the given category.
     */
    this.isInCategory = function(currCategory){
        if(containsArrayElement(this.categories,currCategory)){
            return true;
        }
        else{
            return false;
        }
    }

    /**
     * Sets the position in css.
     *
     * @param left
     * @param top
     */
    this.setPosition = function(left, top){
        jQuery(this.elementRef).css("left",left);
        jQuery(this.elementRef).css("top",top);
    }

    this.elementRef=null;
    this.categories=new Array();
}

function setFilterableElementsToDefault(){
    var filterElements = new Array();

    var elementsFromDocument = document.getElementsByClassName("filter-element");
    for(var i=0;i<elementsFromDocument.length;i++){
        var temp = new filterElement();
        var categories = elementsFromDocument[i].getAttribute("filter-category");
        categories = createArrayFromAttribute(categories);

        temp.categories=categories;
        temp.color= randRgb();
        temp.elementRef=elementsFromDocument[i];

        window._filterList.push(temp);
    }

    refreshFilteredElements();
}

/**
 * Onclick eventhandler, triggers if user click on filter change.
 */
function changeFilterSettings(sender){
    /*After an event this event is blocked for the time is needed for the effect.
    Effect duration is defined in the window._effectDuration variable.*/
    if(window._allowFilterChange){
        window._filterState=sender.getAttribute("filter-setting");
        refreshFilteredElements();
        window._allowFilterChange=false;

        setTimeout(function(){
            window._allowFilterChange=true;
        },window._effectDuration);
    }
}

/**
 * Calculates the height of the parentnode, depending on the actives array.
 */
function calculateParentnodeHeight(activeElements){
    if(activeElements.length==0){
        var endHeight=0;
    }
    else{
        var endHeight=jQuery(window._filterList[0].elementRef).innerHeight();
        var widthLeft=jQuery(window._parentElement).innerWidth();

        for(var i=0;i<window._activesList.length;i++){
            widthLeft-=jQuery(window._activesList[i].elementRef).innerWidth();
            if(widthLeft<0){
                endHeight+=jQuery(window._filterList[0].elementRef).innerHeight();
                widthLeft=jQuery(window._parentElement).innerWidth();
            }
        }
    }

    /*Set height of parentnode*/
    jQuery(window._parentElement).css("height",endHeight);
}

/**
 * Caclulates the next position of the active elements.
 * @param activeElements - array of the elements.
 */
function calculateElementsPosition(activeElements){
    var leftPos=0;
    var topPos=0;

    if(activeElements.length>0){
        var widthStep=jQuery(activeElements[0].elementRef).innerWidth();
        var heightStep=jQuery(activeElements[0].elementRef).innerHeight();

        var maxWidth=jQuery(window._parentElement).innerWidth();

        for(var i=0;i<activeElements.length;i++){
            jQuery(activeElements[i].elementRef).css("left",leftPos);
            jQuery(activeElements[i].elementRef).css("top",topPos);

            leftPos+=widthStep;
            if((leftPos+widthStep)>maxWidth){
                topPos+=heightStep;
                leftPos=0;
            }
        }
    }
}

/**
 * Refreshes the view of the elements.
 */
function refreshFilteredElements(){
    clearArray(window._activesList);

    /*Puts the active elements (the ones should be visible) in an array..*/
    for(var i=0;i<window._filterList.length;i++){
        if(window._filterList[i].isInCategory(window._filterState)){
            window._activesList.push(window._filterList[i]);
        }
    }

    /*Calculate the height of the parentnode of the elements.*/
    calculateParentnodeHeight(window._activesList);

    /*Calculate the positions of the active elements.*/
    calculateElementsPosition(window._activesList);


    /*Calls the refresh method of the elements, so they set their opacity,
     and stuff depending on the given active category.*/
    for(var i=0;i<_filterList.length;i++){
        _filterList[i].refreshAppearing(window._filterState);
    }
}

/**
 * Set the size of the slider content window.
 */
function slideInSizer(){

    var slideWindow = document.getElementById("content-slider");
    slideWindow.setAttribute("style","right:-"+window.innerWidth+"px;");
}

/**
 *
 * @param sender - This var contains the sender element, so we know what to do.
 */
function slideIn(sender){
    var textToShow = sender.getAttribute("slider-content");
    var slideWindow = document.getElementById("content-slider");
    slideWindow.setAttribute("style","right:0px;");
}

/**
 * Sends back the slider window.
 */
function slideOut(){
    var slideWindow = document.getElementById("content-slider");
    slideWindow.setAttribute("style","right:-"+window.innerWidth+"px;");
}

/*------------------------------------*/
/*------------------------------------*/
/*Helper functions*/

function clearArray(array){
    while(array.length>0){
        array.pop();
    }
}

function createArrayFromAttribute(attribute){
    attribute = attribute.substr(1,attribute.length-2);
    var tempArray = attribute.split(',');
    return tempArray;
}

function randRgb(){
    return new Array(
        Math.floor(Math.random()*255),
        Math.floor(Math.random()*255),
        Math.floor(Math.random()*255)
    )
}

function containsArrayElement(array, element){
    for(var i=0;i<array.length;i++){
        if(array[i]==element){
            return true;
        }
    }

    return false;
}

function implode(tomb){
    var szoveg = tomb[0];
    if(tomb.length>1){
        for(var i=1;i<tomb.length;i++){
            szoveg+=","+tomb[i];
        }
    }
    return szoveg;
}