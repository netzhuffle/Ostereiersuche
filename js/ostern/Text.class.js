/**
 * Hufflepuff-Osterprojekt
 * @author JANNiS <jannis@huffle-home.de>
 */

/**
 * Klasse für die Texte
 */
var Text = new Class({
	/**
	 * Name des Textes
	 * @type string
	 */
	name: null,
	/**
	 * Element des Textes
	 * @type element
	 */
	element: null,
	
	/**
	 * Konstruktor, initialisiert den Text
	 * @param name	string	Name des Textes
	 * @param id	string	ID des Elements, in dem der Text enthalten ist
	 */
	initialize: function(name, id) {
		this.name = name;
		this.element = document.id(id);
	},
	
	/**
	 * Gibt eine Kopie des Textes zurück
	 * und ersetzt darin alle {{ }} mit < >
	 * @return element Der Text mit ersetzten {{ }}
	 */
	getText: function() {
		var text = this.element.clone();
		var alt = text.get("html");
		var neu = alt.replace(/{{(.*)}}/g, "<$1>");
		text.set("html", neu);
		text.set("class", "text");
		text.setStyle("opacity", "0");
		return text;
	}
});