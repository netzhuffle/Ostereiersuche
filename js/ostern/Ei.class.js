/**
 * Hufflepuff-Osterprojekt
 * 
 * @author JANNiS <jannis@huffle-home.de>
 */

/**
 * Klasse für die zu suchenden Eier
 */
var Ei = new Class({
    /**
	 * Abstand des Eizentrums vom oberen Rand des Bildes in px
	 * 
	 * @type integer
	 */
    top : null,
    /**
	 * Abstand des Eizentrums vom linken Rand des Bildes in px
	 * 
	 * @type integer
	 */
    left : null,
    /**
	 * Höhe des Eis in px
	 * 
	 * @type integer
	 */
    height : 20,
    /**
	 * Breite des Eis in px
	 * 
	 * @type integer
	 */
    width : 20,
    /**
	 * URI des Kringels, wenn das Ei gefunden wurde
	 * 
	 * @type string
	 */
    kringelpfad : null,
    /**
	 * Text des Eis
	 * 
	 * @type Text
	 */
    text : null,
    /**
	 * Ob das Ei bereits gefunden wurde
	 */
    gefunden : false,
    
    /**
	 * Konstruktor, initialisiert das Ei
	 * 
	 * @param kringel string URI des Kringels für das Ei relativ zum Ordner
	 *            "images"
	 * @param text Text Text des Eis
	 * @param top integer Abstand des Eizentrums vom oberen Rand des Bildes in
	 *            px
	 * @param left integer Abstand des Eizentrums vom linken Rand des Bildes in
	 *            px
	 * @param height integer Höhe des Eis in px (optional, standard 20)
	 * @param width integer Breite des Eis in px (optional, standard 20)
	 */
    initialize : function(kringel, text, top, left, height, width)
    {
	    this.top = top;
	    this.left = left;
	    if (height)
		    this.height = height;
	    if (width)
		    this.width = width;
	    this.kringelpfad = "../../img/ostern/" + kringel;
	    this.text = text;
    },
    
    /**
	 * Gibt zurück, ob das Ei gefunden wurde
	 * 
	 * @param top integer Abstand von oben, wo gesucht wurde in px
	 * @param left integer Abstand von links, wo gesucht wurde in px
	 * @return boolean Ob das Ei gefunden wurde
	 */
    istGefunden : function(top, left)
    {
	    var oben = this.top - this.height / 2;
	    var unten = this.top + this.height / 2;
	    var links = this.left - this.width / 2;
	    var rechts = this.left + this.width / 2;
	    if (top >= oben && top <= unten && left >= links && left <= rechts) {
		    return true;
	    }
	    return false;
    },
    
    /**
	 * Gibt das Element für den Kringel zurück
	 * 
	 * @return element img-Element für den Kringel
	 */
    getKringel : function()
    {
	    var kringel = new Element("img", {
	        "src" : this.kringelpfad,
	        "styles" : {
	            "position" : "absolute",
	            "top" : this.top - 25,
	            "left" : this.left - 25
	        },
	        "events" : {
		        "click" : (function()
		        {
			        projekt.gefunden(this);
		        }).bind(this)
	        }
	    });
	    return kringel;
    },
    
    /**
	 * Gibt den Text hinter dem Ei zurück
	 * 
	 * @return element Text-Element
	 */
    getText : function()
    {
	    return this.text.getText();
    },
    
    /**
	 * Gibt den Titel des Textes des Eis zurück
	 * 
	 * @return element Titel des Textes
	 */
    getTitel : function()
    {
	    return this.text.name;
    }
});
