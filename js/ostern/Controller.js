/**
 * Hufflepuff-Osterprojekt
 * 
 * @author JANNiS <jannis@huffle-home.de>
 */

/**
 * Steuerungsklasse für das Programm
 */
var Osterprojekt = {
    /**
	 * Array für alle Bilder
	 * 
	 * @type array
	 */
    bilder: [],
    /**
	 * Nummer des aktuellen Suchbildes
	 * 
	 * @type integer
	 */
    jetzt: null,
    /**
	 * Speicher für die gefundenen Eier
	 * 
	 * @type array
	 */
    speicher: [],
    /**
	 * Ob die Koordinaten ausgegeben werden sollen
	 * 
	 * @type bool
	 */
    koordinatenModus: false,
    
    /**
	 * Lädt die gefundenen Ostereier aus dem Cookie
	 */
    laden: function() {
	    var speicher = Cookie.read("ostereiersuche");
	    if (speicher == null) {
		    this.speicher = [];
		    this.speicher[0] = [];
	    } else {
		    this.speicher = JSON.decode(speicher);
	    }
	    this.speicher.each(function(bild, bildid) {
		    if (this.bilder[bildid]) {
			    this.bilder[bildid].gefunden = true;
			    bild.each(function(eiid) {
				    if (this.bilder[bildid].eier[eiid]) {
					    this.bilder[bildid].eier[eiid].gefunden = true;
				    }
			    }, this);
		    }
	    }, this);
	    this.bild(this.speicher.length - 1);
	    if (this.koordinatenModus)
		    alert("Bitte klicke den linkesten Punkt des ersten Eis an.");
    },
    
    /**
	 * Speichert ein gefundenes Ei in das Cookie
	 * 
	 * @param ei integer Nummer des Eis
	 */
    speichern: function(ei) {
	    if (!this.speicher[this.jetzt]) {
		    this.speicher[this.jetzt] = [];
	    }
	    this.speicher[this.jetzt].include(ei);
	    var speicher = JSON.encode(this.speicher);
	    var path = location.pathname.substring(0, location.pathname.lastIndexOf('/'));
	    Cookie.write("ostereiersuche", speicher, {
	        path: path,
	        duration: 365
	    });
    },
    
    /**
	 * Bringt das gewünschte Bild auf die Bühne. Falls keines definiert ist, das
	 * chronologisch folgende. Falls -1, wird das letzte angezeigt.
	 * 
	 * @param id integer Nummer des Bildes im Bilder-Array (optional)
	 */
    bild: function(id) {
	    if (id || id === 0) {
		    if (id == -1) {
			    if (this.jetzt > 0)
				    this.jetzt--;
			    else
				    return;
		    } else {
			    if (id < this.bilder.length)
				    this.jetzt = id;
			    else
				    return;
		    }
	    } else if (this.jetzt + 1 < this.bilder.length) {
		    this.jetzt++;
	    } else
		    return;
	    var bild = this.bilder[this.jetzt];
	    var bildcontainer = document.id("bild");
	    bildcontainer.empty();
	    bildcontainer.grab(bild.getBild());
	    document.id("titel").set("text", bild.titel);
	    bild.loadKringel();
	    this.checkPfeile();
    },
    
    /**
	 * Wenn ein Ei gefunden wurde Zeigt die Geschichte an und speichert das Ei
	 * 
	 * @param ei Ei Das Ei, was gefunden wurde
	 * @param id integer Nummer des Eis im Array des Bildes (optional - wird
	 *            nicht gespeichert falls nicht angegeben)
	 */
    gefunden: function(ei, id) {
	    if (id || id === 0)
		    this.speichern(id);
	    var hintergrund = document.id("text");
	    var text = ei.getText();
	    hintergrund.empty();
	    hintergrund.grab(text);
	    text.fade("in");
	    hintergrund.fade("in");
	    document.id("titel").set("text", ei.getTitel());
	    this.checkPfeile(true);
    },
    
    /**
	 * Prüft, ob Pfeile angezeigt werden und blendet sie ein oder aus
	 * 
	 * @param highlight bool Ob der vor-Pfeil blinken soll (optional - false,
	 *            wenn nicht angegeben)
	 */
    checkPfeile: function(highlight) {
	    if (this.jetzt > 0) {
		    document.id("zurueck").setStyle("visibility", "visible");
		    document.id("zurueck").removeEvents("click");
		    document.id("zurueck").addEvent("click", (function() {
			    this.bild(-1);
		    }).bind(this));
	    } else {
		    document.id("zurueck").removeEvents("click");
		    document.id("zurueck").setStyle("visibility", "hidden");
	    }
	    
	    var alleGefunden = this.bilder[this.jetzt].eier.every(function(ei) {
		    return ei.gefunden;
	    });
	    
	    var vor = document.id("vor");
	    if (alleGefunden && this.jetzt + 1 < this.bilder.length) {
		    this.bilder[this.jetzt + 1].gefunden = true;
		    if (highlight) {
			    vor.fade("in");
			    vor.get("tween").removeEvents("complete");
			    vor.get("tween").addEvent("complete", function() {
				    (function() {
					    vor.fade("toggle");
				    }).delay(1); // da sonst noch der alte toggle-Wert
				    // gesetzt ist (eingeblendet/ausgeblendet)
			    });
		    } else {
			    vor.get("tween").removeEvents("complete");
			    vor.get("tween").addEvent("complete", function() {
				    vor.fade("show");
			    });
			    vor.fade("show");
		    }
		    vor.removeEvents("click");
		    vor.addEvent("click", (function() {
			    this.bild();
		    }).bind(this));
		    
	    } else {
		    vor.removeEvents("click");
		    vor.get("tween").removeEvents("complete");
		    vor.get("tween").addEvent("complete", function() {
			    vor.fade("hide");
		    });
		    vor.fade("hide");
	    }
    },
    
    /**
	 * Startet das Programm
	 */
    start: function() {
	    var texthintergrund = document.id("text");
	    texthintergrund.fade("hide");
	    texthintergrund.addEvent("click", function() {
		    this.fade("out");
		    this.getChildren().each(function(text) {
			    text.fade("out");
			    text.get("tween").addEvent("complete", (function(e) {
				    this.destroy();
			    }).bind(text));
		    });
		    var bildtitel = projekt.bilder[projekt.jetzt].titel;
		    document.id("titel").set("text", bildtitel);
	    });
	    
	    this.laden();
    }
};

var projekt = Object.create(Osterprojekt);
