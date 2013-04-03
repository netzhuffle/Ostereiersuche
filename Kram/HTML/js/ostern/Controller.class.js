/**
 * Hufflepuff-Osterprojekt
 * @author JANNiS <jannis@huffle-home.de>
 */

/**
 * Steuerungsklasse für das Programm
 */
var Osterprojekt = new Class({
	/**
	 * Transparenz der Texte in Prozent
	 */
	transparenz: 15,
	/**
	 * Array für alle Bilder
	 * @type array
	 */
	bilder: [],
	/**
	 * Nummer des aktuellen Suchbildes
	 * @type integer
	 */
	jetzt: null,
	/**
	 * Speicher für die gefundenen Eier
	 * @type array
	 */
	speicher: [],
	/**
	 * Ob die Koordinaten ausgegeben werden sollen
	 * @type bool
	 */
	koordinatenModus: false,
	
	/**
	 * Lädt die gefunden Ostereier aus dem Cookie
	 */
	laden: function() {
		var speicher = Cookie.read("osterprojekt");
		if(speicher == null) {
			this.speicher = [];
			this.speicher[0] = [];
		} else {
			this.speicher = JSON.decode(speicher);
		}
		this.speicher.each(function(bild, bildid) {
			if(this.bilder[bildid]) {
				this.bilder[bildid].gefunden = true;
				bild.each(function(eiid) {
					if(this.bilder[bildid].eier[eiid]) {
						this.bilder[bildid].eier[eiid].gefunden = true;
					}
				}, this);
			}
		}, this);
		this.bild(this.speicher.length-1);
		if(this.koordinatenModus) alert("Bitte klicke den linkesten Punkt des ersten Eis an.");
	},
	
	/**
	 * Speichert ein gefundenes Ei in das Cookie
	 * @param ei	integer	Nummer des Eis
	 */
	speichern: function(ei) {
		if(!this.speicher[this.jetzt]) {
			this.speicher[this.jetzt] = [];
		}
		this.speicher[this.jetzt].include(ei);
		var speicher = JSON.encode(this.speicher);
		Cookie.write("osterprojekt", speicher, {duration: 365});
	},
	
	/**
	 * Bringt das gewünschte Bild auf die Bühne.
	 * Falls keines definiert ist, das chronoligisch folgende.
	 * Falls -1, wird das letzte angezeigt.
	 * @param id	integer	Nummer des Bildes im Bilder-Array (optional)
	 */
	bild: function(id) {
		if($chk(id)) {
			if(id == -1) {
				if(this.jetzt > 0) this.jetzt--;
				else return;
			} else {
				if(id < this.bilder.length) this.jetzt = id;
				else return;
			}
		} else if(this.jetzt+1 < this.bilder.length) {
			this.jetzt++;
		} else return;
		var bild = this.bilder[this.jetzt];
		var bildcontainer = $("bild");
		bildcontainer.empty();
		bildcontainer.grab(bild.getBild());
		$("titel").set("text", bild.titel);
		bild.loadKringel();
		this.checkPfeile();
	},
	
	/**
	 * Wenn ein Ei gefunden wurde
	 * Zeigt die Geschichte an und speichert das Ei
	 * @param ei	Ei		Das Ei, was gefunden wurde
	 * @param id	integer	Nummer des Eis im Array des Bildes (optional - wird nicht gespeichert falls nicht angegeben)
	 */
	gefunden: function(ei, id) {
		if($chk(id)) this.speichern(id);
		var hintergrund = $("text");
		var text = ei.getText();
		hintergrund.empty();
		hintergrund.grab(text);
		text.tween("opacity", 0, 1);
		var transparenz = 1 - this.transparenz / 100;
		hintergrund.tween("opacity", 0, transparenz);
		$("titel").set("text", ei.getTitel());
		this.checkPfeile(true);
	},
	
	/**
	 * Prüft, ob Pfeile angezeigt werden
	 * und blendet sie ein oder aus
	 * @param highlight	bool	Ob der vor-Pfeil blinken soll (optional - false, wenn nicht angegeben)
	 */
	checkPfeile: function(highlight) {
		if(this.jetzt > 0) {
			$("zurueck").setStyle("visibility", "visible");
			$("zurueck").removeEvents("click");
			$("zurueck").addEvent("click", (function() {
				this.bild(-1);
			}).bind(this));
		} else {
			$("zurueck").removeEvents("click");
			$("zurueck").setStyle("visibility", "hidden");
		}
		
		var alleGefunden = this.bilder[this.jetzt].eier.every(function(ei) {
			return ei.gefunden;
		});

		var vor = $("vor");
		if(alleGefunden && this.jetzt+1 < this.bilder.length) {
			this.bilder[this.jetzt+1].gefunden = true;
			if(highlight) {
				vor.fade("in");
				vor.get("tween").removeEvents("complete");
				vor.get("tween").addEvent("complete", function() {
					vor.fade("toggle");
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
		var texthintergrund = $("text");
		texthintergrund.setStyle("opacity", "0");
		texthintergrund.setStyle("visibility", "hidden");
		texthintergrund.addEvent("click", function() {
			var transparenz = 1 - projekt.transparenz / 100;
			this.tween("opacity", transparenz, 0);
			this.getChildren().each(function(text) {
				text.tween("opacity", 1, 0);
				text.get("tween").addEvent("complete", (function(e) {
					this.destroy();
				}).bind(text));
			});
			var bildtitel = projekt.bilder[projekt.jetzt].titel;
			$("titel").set("text", bildtitel);
		});
		
		this.laden();
	}
});

var projekt = new Osterprojekt();
