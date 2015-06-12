<dom-module id="oster-hpfc-menu">

	<template>
		<?php
			@include_once '../../../board/menu.inc.php';
			@show_menu('../../../', 'service');
		?>
		<img id="zurueck" src="../../img/ostern/pfeil-zurueck.png" alt="Letztes Bild anzeigen">
	</template>
	
	<script>
		Polymer({
			is: 'oster-hpfc-menu'
		});
	</script>
	
</dom-module>