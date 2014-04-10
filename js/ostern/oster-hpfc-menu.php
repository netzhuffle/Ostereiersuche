<polymer-element name="oster-hpfc-menu">
	<template>
		<?php
			@include_once '../../../board/menu.inc.php';
			@show_menu('../../../', 'service');
		?>
		<img id="zurueck" src="../../img/ostern/pfeil-zurueck.png" alt="Letztes Bild anzeigen">
	</template>
	<script>
		Polymer('oster-hpfc-menu');
	</script>
</polymer-element>