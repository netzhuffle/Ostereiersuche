/**
 * Hufflepuff-Osterprojekt
 * @author JANNiS <jannis@huffle-home.de>
 */

/**
 * Klasse für die Suchbilder
 */
var Bild = new Class({
	/**
	 * Überschrift des Bildes
	 * @type string
	 */
	titel: null,
	/**
	 * URI des Bildes
	 * @type string
	 */
	bildpfad: null,
	/**
	 * Das Bild
	 * @type element
	 */
	bild: null,
	/**
	 * Eier des Bildes
	 * @type array
	 */
	eier: null,
	/**
	 * Ob das Bild verfügbar ist
	 * (alle Eier des letzten Bildes gefunden)
	 */
	gefunden: false,
	
	/**
	 * Konstruktor, initialisiert das Bild
	 * @param titel		string	Name des Bildes
	 * @param bildpfad	string	URI des Bildes
	 * @param eier		array	Liste der Eier auf dem Bild
	 */
	initialize: function(titel, bildpfad, eier) {
		this.titel = titel;
		this.bildpfad = bildpfad;
		this.eier = eier;
		projekt.bilder.push(this);
	},
	
	/**
	 * Platziert die Kringel für alle bereits gefundenen Eier
	 */
	loadKringel: function() {
		this.eier.each(function(ei) {
			if(ei.gefunden) {
				var kringel = ei.getKringel();
				document.id("bild").grab(kringel);
			}
		});
	},
	
	/**
	 * Wenn auf das Bild geklickt wurde
	 * @param event	Event	Klick-Event
	 */
	geklickt: function(event) {
		var position = this.bild.getPosition();
		var left = event.page.x - position.x;
		var top = event.page.y - position.y;
		if(projekt.koordinatenModus) this.findeKoordinaten(left, top);
		this.eier.each(function(ei, i) {
			if(ei.istGefunden(top, left)) {
				if(!ei.gefunden) {
					ei.gefunden = true;
					var kringel = ei.getKringel();
					document.id("bild").grab(kringel);
				}
				projekt.gefunden(ei, i);
			}
		});
	},
	
	/**
	 * Hilft, die Koordinaten für die Eier zu bestimmen
	 * @param x	int	Geklickte x-Koordinate
	 * @param y int	Geklickte y-Koordinate
	 */
	findeKoordinaten: function(x, y) {
		if(!this.koordLinks) {
			this.koordLinks = x;
			alert("Bitte klicke jetzt den rechtesten Punkt des Eis an.");
		} else if(!this.koordRechts) {
			this.koordRechts = x;
			alert("Bitte klicke jetzt den obersten Punkt des Eis an.");
		} else if(!this.koordOben) {
			this.koordOben = y;
			alert("Bitte klicke nun den untersten Punkt des Eis an.");
		} else {
			this.koordUnten = y;
			var height = this.koordUnten - this.koordOben;
			var width = this.koordRechts - this.koordLinks;
			var top = this.koordOben + height/2;
			var left = this.koordLinks + width/2;
			var zeile = 'new Ei("kringel-schwarz.png", new Text("Name des Textes", "textid"), ' + top + ', ' + left + ', ' + height + ', ' + width + '),';
			prompt("Hier steht nun die Koordinaten-Zeile des Eis zum Kopieren.\nBitte klicke nun den linkesten Punkt des nächsten Eis an.", zeile);
			this.koordLinks = null;
			this.koordRechts = null;
			this.koordOben = null;
			this.koordUnten = null;
			var ei = new Ei("kringel-rot.png", new Text("Ein Aprilscherz", "aprilscherz"), top, left, height, width);
			this.eier.push(ei);
			this.eier.each(function(ei, i) {
				if(!ei.gefunden) {
					ei.gefunden = true;
					var kringel = ei.getKringel();
					document.id("bild").grab(kringel);
				}
				projekt.gefunden(ei, i);
			});
			Cookie.dispose("osterprojekt");
		}
	},
	
	/**
	 * Gibt das Element für Bild zurück
	 * @return element img-Element für das Bild
	 */
	getBild: function() {
		if(!this.bild) {
			this.bild = new Element("img", {
				"src": this.bildpfad,
				"events": {
					"click": this.geklickt.bind(this)
				}
			});
		}
		return this.bild;
	}
});