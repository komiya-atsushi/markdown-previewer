(function() {
	var DROP_AREA = 'dropArea';
	var RENDERING_AREA = 'renderingArea';
	var FILENAME_LABEL = 'filenameLabel';
	var LAST_MODIFIED_LABEL = 'lastModifiedLabel';
	var README = 'READMEmd';
	var MONITORING_INTERVAL_MILLIS = 250;

	var converter = null;
	var renderingArea = null;
	var dropArea = null;

	window.addEventListener("load", function() {
		converter = new Showdown.converter();

		dropArea = document.getElementById(DROP_AREA);
		dropArea.addEventListener("drop", onDrop, false);
		dropArea.addEventListener("dragover", function(ev) { ev.preventDefault(); }, false);

		renderingArea = document.getElementById(RENDERING_AREA);
		render(document.getElementById(README).innerText);

	}, false);

	var onDrop = function(ev) {
		var file = ev.dataTransfer.files[0];
		startMonitoring(file);

		dropArea.style.display = 'none';
		renderingArea.style.display = 'block';

		document.getElementById(FILENAME_LABEL).innerText = file.name;
		document.getElementById(LAST_MODIFIED_LABEL).innerText = file.lastModifiedDate.toLocaleString();

		ev.preventDefault();
	};

	var currentTimerId = null;
	var startMonitoring = function(file) {
		stopMonitoring();
		updatePreview(file);

		var lastModifiedTime = file.lastModifiedDate.getTime();
		currentTimerId = setInterval(function() {
			if (lastModifiedTime == file.lastModifiedDate.getTime()) {
				return;
			}

			lastModifiedTime = file.lastModifiedDate.getTime();
			updatePreview(file);
			
		}, MONITORING_INTERVAL_MILLIS);
	};

	var updatePreview = function(file) {
		var reader = new FileReader();
		reader.onload = function() {
			render(reader.result);
		};
		reader.readAsText(file);
	};

	var render = function(text) {
		renderingArea.innerHTML = converter.makeHtml(text);
	};

	var stopMonitoring = function() {
		if (!currentTimerId) {
			clearInterval(currentTimerId);
			currentTimerId = null;
		}
	};
})();